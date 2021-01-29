<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\ORM\ValidationException;

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
     *
     * @return null
     * @throws \Exception
     */
    public function getValueFromData()
    {
        $controller = Controller::curr();
        if (!$controller) {
            throw new ValidationException(
                _t(
                    __CLASS__ . ".NO_CONTROLLER",
                    "Sorry, the file upload could not be completed due to a system error."
                )
            );
        }

        $form = ($controller->hasMethod('Form') ? $controller->Form() : null);

        try {

            /*
             * retrieve the keys for the previously uploaded files
             * requires form with security token
             * untrust the file after retrieval
             */
            $files = FileRetriever::getUploadedFilesByKey($this->Name, $controller->Form(), true);

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
                    $file->UserFormUpload = 1;
                    $field->Files()->add($file);
                }
            }

            // the Value value for the field is null
            return null;

        } catch (\Exception $e) {
            // failed at some point
            Logger::log("Error:" . $e->getMessage(), "NOTICE");
        }

        throw new ValidationException(
            _t(
                __CLASS__ . ".UPLOADED_FILES_NOT_FOUND",
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
        $types = trim($this->AllowedMimeTypes);
        if ($types) {
            $pattern = '/\s{1,}/';
            $types = preg_split($pattern, $types);
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
