<?php

namespace Codem\DamnFineUploader;

/**
 * @author James
 */
use Codem\DamnFineUploader\UppyField;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\FormAction;
use Silverstripe\Forms\Form;
use SilverStripe\Assets\File;
use SilverStripe\Core\Extension;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\ORM\ValidationResult;

/**
 * Controller for handling file uploads
 */
class UploadPageController extends \PageController
{

    private static $allowed_actions = [
        'UploadForm',
        'handleUpload'
    ];

    private static $upload_field_name = "UploadField";

    /**
     * @return UppyField;
     */
    protected function getUploadField()
    {
        $field = UppyField::create(
            $this->config()->get('upload_field_name'),
            _t(
                'DamnFineUploader.UPLOAD',
                'Upload'
            )
        );
        $data = $this->data();
        if ($data->FormFieldTitle) {
            $field->setTitle($data->FormFieldTitle);
        }
        if ($data->FormFieldDescription) {
            $field->setDescription(strip_tags($data->FormFieldDescription));
        }
        if ($data->FormFieldRightTitle) {
            $field->setRightTitle(strip_tags($data->FormFieldRightTitle));
        }
        if ($data->FormFieldTitle) {
            $field->setTitle($data->FormFieldTitle);
        }

        // max file size, handle in bytes, provided in MB
        $bytes = $data->MaxFileSizeMB * 1048576;
        if ($bytes > 0) {
            $field->setAllowedMaxFileSize($bytes);
        } else {
            $field->setAllowedMaxFileSize(UploadPage::get_php_max_file_size());
        }

        $limit = (int)$data->FileUploadLimit;
        if ($limit <= 0) {
            $limit = 1;
        }
        $field->setAllowedMaxItemLimit($limit);

        // Set a folder name
        $folder = $data->Folder();
        if ($folder && $folder->exists()) {
            // Set a folder name
            $field->setFolderName($folder->getFilename());
            $field->setUseDateFolder($data->UseDateFolder == 1);
        } else {
            // the fallback is the general "Uploads" location
            $field->setUseDateFolder($data->UseDateFolder == 1);
        }

        $types = trim($data->AllowedMimeTypes);
        if ($types) {
            $pattern = '/\s{1,}/';
            $types = preg_split($pattern, $types);
            $field->setAcceptedTypes($types);
        }

        return $field;
    }



    /**
     * @return FormAction;
     */
    protected function getUploadAction()
    {
        $data = $this->data();
        $action = FormAction::create(
            'handleUpload',
            _t(
                'DamnFineUploader.UPLOAD',
                'Upload'
            )
        );

        if ($data->FormUploadButtonTitle) {
            $action->setTitle($data->FormUploadButtonTitle);
        }

        return $action;
    }

    /**
     * A file upload form
     */
    public function UploadForm()
    {
        $upload_field = $this->getUploadField();
        $fields = FieldList::create(
            $upload_field
        );
        $actions = FieldList::create(
            $this->getUploadAction()
        );

        $validator = null;
        $form = Form::create($this, 'UploadForm', $fields, $actions, $validator);
        $this->extend('updateUploadForm', $form);
        return $form;
    }

    /**
     * For templates that have $Form
     */
    public function Form()
    {
        return $this->UploadForm();
    }

    /**
     * Handle the file upload
     * Use an {@link Extension} to handle further file uploading
     */
    public function handleUpload(array $data, Form $form)
    {
        try {
            $response_data = [
                'expected' => 0,// expected uploads
                'found' => 0,// uploads successfully saved
                'files' => [],// array of found File records
                'file_ids' => [],// raw submitted file ids
            ];

            $fields = $form->Fields();
            $upload_field = $fields->dataFieldByName($this->config()->get('upload_field_name'));
            if (!$upload_field) {
                throw new \Exception("Field not found");
            }

            $name = $upload_field->getName();
            $files = FileRetriever::getUploadedFilesByKey($name, $form, true);
            $file_ids = isset($data[$name]) && is_array($data[$name]) ? $data[$name] : [];
            $response_data['file_ids'] = $file_ids;
            $response_data['expected'] = count($file_ids);
            $response_data['files'] = $files;
            $response_data['found'] = count($files);
            // your extension handles the uploads
            $response = $this->extend('handleUploadedFiles', $response_data, $upload_field, $form);
        } catch (Exception $e) {
            $response = $this->extend('handleFailedUpload', $response_data, $upload_field, $form);
        }

        if ($response instanceof HTTPResponse) {
            // return the response returned from extensions
            return $response;
        } else if($response_data['expected'] > 0
            && $response_data['expected'] == $response_data['found']) {
            $form->sessionMessage(
                _t(
                    "DamnFineUploader.FILES_UPLOADED",
                    "{uploaded} file(s) were saved",
                    [
                        'uploaded' => $response_data['found']
                    ]
                ),
                ValidationResult::TYPE_GOOD
            );
            return $this->redirectBack();
        } else {
            $form->sessionMessage(
                _t(
                    "DamnFineUploader.FILES_UPLOADED_ATTEMPTED_MISMATCH",
                    "Only {uploaded} out of {attempted} files could be uploaded",
                    [
                        'uploaded' => $response_data['found'],
                        'attempted' => $response_data['expected']
                    ]
                ),
                ValidationResult::TYPE_ERROR
            );
            return $this->redirectBack();
        }
    }
}
