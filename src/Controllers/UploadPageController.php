<?php

namespace Codem\DamnFineUploader;

/**
 * @author James
 */
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\Form;
use SilverStripe\Assets\File;
use SilverStripe\Core\Extension;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Validation\ValidationResult;

/**
 * Controller for handling file uploads
 * @extends \PageController<\Codem\DamnFineUploader\UploadPage>
 */
class UploadPageController extends \PageController
{
    private static array $allowed_actions = [
        'UploadForm'
    ];

    private static string $upload_field_name = "UploadField";

    /**
     * @return UppyField
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
            $field->setDescription(strip_tags((string) $data->FormFieldDescription));
        }

        if ($data->FormFieldRightTitle) {
            $field->setRightTitle(strip_tags((string) $data->FormFieldRightTitle));
        }

        if ($data->FormFieldTitle) {
            $field->setTitle($data->FormFieldTitle);
        }

        // max file size, handle in bytes, provided in MB
        $bytes = $data->MaxFileSizeMB * 1048576;
        if ($bytes > 0) {
            $field->setAllowedMaxFileSize((int) $bytes);
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

        $field->setAcceptedTypes($data->getAllowedTypes());

        return $field;
    }


    protected function getUploadAction(): FormAction
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
     * No form is returned if an upload field is not available
     */
    public function UploadForm(): ?Form
    {
        $uploadField = $this->getUploadField();
        if (!$uploadField instanceof DamnFineUploaderField) {
            return null;
        }

        $fields = FieldList::create(
            $uploadField
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
    public function Form(): ?Form
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
            $fileData = [
                'expected' => 0,// expected uploads
                'found' => 0,// uploads successfully saved
                'files' => [],// array of found File records
                'file_ids' => [],// raw submitted file ids
            ];

            $fields = $form->Fields();
            $uploadField = $fields->dataFieldByName($this->config()->get('upload_field_name'));
            if (!$uploadField) {
                throw new \Exception("Field not found");
            }

            $name = $uploadField->getName();
            $files = FileRetriever::getUploadedFilesByKey($name, $form, true);
            $file_ids = isset($data[$name]) && is_array($data[$name]) ? $data[$name] : [];
            $fileData['file_ids'] = $file_ids;
            $fileData['expected'] = count($file_ids);
            $fileData['files'] = $files;
            $fileData['found'] = count($files);
            // your extension handles the uploads
            $response = $this->extend('handleUploadedFiles', $fileData, $uploadField, $form);
        } catch (\Exception $exception) {
            $response = $this->extend('handleFailedUpload', $fileData, $uploadField, $form, $exception);
        }

        if ($response instanceof HTTPResponse) {
            // return the response returned from extensions
            return $response;
        }

        if ($fileData['expected'] > 0
            && $fileData['expected'] == $fileData['found']) {
            $form->sessionMessage(
                _t(
                    "DamnFineUploader.FILES_UPLOADED",
                    "{uploaded} file(s) were saved",
                    [
                        'uploaded' => $fileData['found']
                    ]
                ),
                ValidationResult::TYPE_GOOD
            );
            return $this->redirectBack();
        }

        $form->sessionMessage(
            _t(
                "DamnFineUploader.FILES_UPLOADED_ATTEMPTED_MISMATCH",
                "Only {uploaded} out of {attempted} files could be uploaded",
                [
                    'uploaded' => $fileData['found'],
                    'attempted' => $fileData['expected']
                ]
            ),
            ValidationResult::TYPE_ERROR
        );
        return $this->redirectBack();
    }
}
