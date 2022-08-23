<?php

namespace Codem\DamnFineUploader;

use DNADesign\ElementalUserForms\Model\ElementForm;
use DNADesign\ElementalUserForms\Control\ElementFormController;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\CMS\Controllers\ModelAsController;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\NumericField;
use SilverStripe\ORM\ValidationException;
use SilverStripe\UserForms\Extension\UserFormFileExtension;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Parsers\URLSegmentFilter;

/**
 * Trait for editable DFU field implementations
 */
trait EditableDamnFineUploader
{

    /**
     * @var SubmittedUploadField
     */
    protected $submitted_form_field = null;

    /**
     * Get the uploader field, in the future this will return a field based on the implementation value
     * @return UppyField
     */
    protected function getUploaderField()
    {
        $field = UppyField::create($this->Name, $this->Title ?: false, null, null)
                    ->setFieldHolderTemplate(EditableFormField::class . '_holder')
                    ->setTemplate(__CLASS__);
        return $field;
    }

    /**
     * Get the submitted for field
     * @return SubmittedUploadField
     */
    public function getSubmittedFormField()
    {
        if($this->submitted_form_field) {
            return $this->submitted_form_field;
        }
        $this->submitted_form_field = SubmittedUploadField::create();
        // this field needs to be in the DB, to enable relation writes
        $this->submitted_form_field->write();
        return $this->submitted_form_field;
    }

    /**
     * The value returned by this value is null, when this method is called
     * any files in the request are linked to the submitted upload field
     * Note $data param can be passed to this method by controller but is not present in EditableFileField
     *
     * @return null
     * @throws \Exception
     */
    public function getValueFromData(/*$data*/)
    {

        try {

            $controller = null;
            $parent = $this->Parent();
            if($parent instanceof SiteTree) {
                $controller = ModelAsController::controller_for($this->Parent());
            } else if(class_exists(ElementForm::class) && $parent instanceof ElementForm) {
                $controller = Injector::inst()->create(ElementFormController::class, $parent);
                $controller->doInit();
            }

            if (!$controller) {
                throw new ValidationException(
                    _t(
                        "DamnFineUploader.NO_CONTROLLER",
                        "Sorry, the file upload could not be completed due to a system error."
                    )
                );
            }

            $form = null;
            if($controller->hasMethod('Form')) {
                $form = $controller->Form();
            } else if($controller->hasMethod('getUploadForm')) {
                $form = $controller->getUploadForm();
            }

            if(!($form instanceof Form)) {
                throw new \Exception(
                    _t(
                        "DamnFineUploader.UPLOAD_CONTROLLER_ERROR",
                        "No 'Form' or 'getUploadForm' method is available on the controller or the returned value is not a Form instance"
                    )
                );
            }

            /*
             * retrieve the keys for the previously uploaded files
             * requires form with security token
             * untrust the file after retrieval
             */
            $files = FileRetriever::getUploadedFilesByKey($this->Name, $form, true);

            /**
              * Associate the files with the submitted form field
              * using the field created by the initial call to getSubmittedFormField
              * from the UserDefinedFormController
              */
            $field = $this->getSubmittedFormField();
            // remove file ID values already associated with this field (not the file)
            $field->Files()->removeAll();

            if(!empty($files)) {
                foreach($files as $file) {
                    if($file->SubmittedUploadFieldID && $file->SubmittedUploadFieldID != $field->ID) {
                        throw new \Exception("The file #{$file->ID} is already linked to submitted field #{$file->SubmittedUploadFieldID}");
                    }
                    $file->UserFormUpload = UserFormFileExtension::USER_FORM_UPLOAD_TRUE;// mark as a userform upload ('t','f', null)
                    $file->SubmittedUploadFieldID = $field->ID;// associate with the field
                    $file->writeToStage(Versioned::DRAFT);
                }
            } else if($this->Required == 1) {
                // required field but not files found
                throw new ValidationException(
                    _t(
                        "DamnFineUploader.REQUIRED_FIELD_NO_FILES",
                        "Please upload some files. The uploader requires Javascript, please ensure that it is enabled in your web browser."
                    )
                );
            }

            // the Value value for the field is null
            return null;

        } catch (\Exception $e) {
            // failed at some point
            Logger::log("Error:" . $e->getMessage(), "NOTICE");
        }

        throw new ValidationException(
            _t(
                "DamnFineUploader.UPLOADED_FILES_NOT_FOUND",
                "Sorry, the file upload could not be completed due to a system error."
            )
        );

    }

    /**
     * Return the form field used for uploads
     * @note that at this point, the Form instance has not been associated
     * @see UserFormExtension::updateForm()
     */
    public function getFormField()
    {
        $field = $this->getUploaderField();

        // Apply configurable settings
        // set accepted types on the field e.g image/jpeg
        $types = $this->getAllowedMimeTypes();
        if (!empty($types)) {
            $field->setAcceptedTypes($types);
        }

        // max file size, handle in bytes, provided in MB
        $bytes = $this->MaxFileSizeMB * 1048576;
        if ($bytes > 0) {
            $field->setAllowedMaxFileSize($bytes);
        } else {
            $field->setAllowedMaxFileSize(self::get_php_max_file_size());
        }

        if ((int)$this->FileUploadLimit <= 0) {
            $this->FileUploadLimit = 3;
        }
        $field->setAllowedMaxItemLimit($this->FileUploadLimit);

        // Set a folder name
        $folder = $this->Folder();
        if ($folder && $folder->exists()) {
            // Set a folder name
            $field->setFolderName($folder->getFilename());
            $field->setUseDateFolder($this->UseDateFolder == 1);
        } else {
            // the fallback is the general "Uploads" location
            $field->setUseDateFolder($this->UseDateFolder == 1);
        }

        $this->doUpdateFormField($field);
        return $field;
    }
}
