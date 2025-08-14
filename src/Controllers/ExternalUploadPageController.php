<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Forms\Form;
use SilverStripe\Assets\File;
use SilverStripe\Core\Extension;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\ORM\ValidationResult;

/**
 * Controller for handling file uploads
 * @author James
 * @extends \Codem\DamnFineUploader\UploadPageController<\Codem\DamnFineUploader\ExternalUploadPage>
 */
class ExternalUploadPageController extends UploadPageController
{
    private static array $allowed_actions = [
        'UploadForm',
        'handleUpload',
        'uploaded' // notification URL
    ];

    /**
     * Return the upload field
     * @return AbstractUppyExternalUploadField
     */
    protected function getUploadField()
    {
        $args = [
            $this->config()->get('upload_field_name'),// name
            // title
            _t(
                'DamnFineUploader.UPLOAD',
                'Upload'
            )
        ];
        return $this->data()->getUploadField($args);
    }

    /**
     * Handle the file upload
     * Use an {@link Extension} to handle further file uploading
     */
    public function uploaded(HTTPRequest $request): HTTPResponse
    {
        return HTTPResponse::create();
    }

    /**
     * Handle the form submit action
     * For an external upload, the files are not local, but stored as records via
     * the field's notify handler
     * Use an {@link Extension} to handle further actions required
     */
    public function handleUpload(array $data, Form $form)
    {

        try {
            $submissionCount = 0;
            $response = null;
            $submissions = $this->data()->ExternalUploads();
            $submissionCount = $submissions->count();
            // your extension handles the uploads
            $response = $this->extend('handleExternalUploadedFiles', $submissions);
        } catch (\Exception) {
        }

        if ($response instanceof HTTPResponse) {
            // return the response returned from extensions
            return $response;
        } elseif ($submissionCount > 0) {
            $form->sessionMessage(
                _t(
                    "DamnFineUploader.FILES_UPLOADED",
                    "{uploaded} file(s) were saved",
                    [
                        'uploaded' => $submissionCount
                    ]
                ),
                ValidationResult::TYPE_GOOD
            );
            return $this->redirectBack();
        } else {
            $form->sessionMessage(
                _t(
                    "DamnFineUploader.FILES_UPLOADED_ATTEMPTED_MISMATCH",
                    "No files could be uploaded",
                ),
                ValidationResult::TYPE_ERROR
            );
            return $this->redirectBack();
        }
    }
}
