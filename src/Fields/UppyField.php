<?php

namespace Codem\DamnFineUploader;

use SilverStripe\View\Requirements;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;

/**
 * @note provides a field to handle Uppy File Uploader uploads
 */
class UppyField extends DamnFineUploaderField
{
    protected string $implementation = parent::IMPLEMENTATION_UPPY;

    /**
     * @config
     */
    private static array $allowed_actions = [
        'upload', // local upload endpoint
        'notify', // notify of completed upload
        'presign' // return a presigned URL for a single file
    ];

    protected function setRequirements(): void
    {
        Requirements::set_force_js_to_bottom(true);

        Requirements::javascript(
            'codem/silverstripe-damn-fine-uploader:client/dist/js/uppy.min.js',
            [
                "defer" => true,
                "async" => true,
                "crossorigin" => "anonymous",
                "integrity" => "sha384-1SBO4khM4DteyagBFiiNfP6BkAIgFTVU1LgPGeinGrw2ysfE5YDM3kjORcOhUste"
            ]
        );

        Requirements::css(
            'codem/silverstripe-damn-fine-uploader:client/dist/styles/uppy.min.css',
            'screen',
            [
                "crossorigin" => "anonymous",
                "integrity" => "sha384-EiHcatVY+GmMfW0AMZ28qFBJpIr+ThW1XCSVzWtLToe3MyZnxNqYtnWPO9gdnlM+"
            ]
        );
    }

    public function getImplementation(): string
    {
        return parent::IMPLEMENTATION_UPPY;
    }

    /**
     * Uppy does not support removal of files post-upload
     */
    public function remove(HTTPRequest $request): HTTPResponse
    {
        return HTTPResponse::create('', 501);
    }

    /**
     * Template helper method for UppyField, returns the serialised configuration string for the library
     */
    public function UploaderConfig(): string
    {
        if (!$this->hasDefaultConfiguration()) {
            $this->setUploaderDefaultConfig();
        }

        if (isset($this->lib_config['validation']['sizeLimit'])) {
            $size = $this->AcceptedFileSize();
            if (isset($this->lib_config['messages']['sizeError'])) {
                $this->lib_config['messages']['sizeError'] = str_replace("{sizeLimit}", $size . "MB", $this->lib_config['messages']['sizeError']);
            } else {
                $this->lib_config['messages']['sizeError'] = _t('DamnFineUploader.FILE_LARGE', "The file is too large, please upload a file smaller than {$size}MB");
            }
        }

        // only makes sense if a min size limit was set
        if (isset($this->lib_config['validation']['minSizeLimit'])) {
            $size = $this->AcceptedMinFileSize();
            if (isset($this->lib_config['messages']['minSizeError'])) {
                $this->lib_config['messages']['minSizeError'] = str_replace("{minSizeLimit}", $size . "MB", $this->lib_config['messages']['minSizeError']);
            } else {
                $this->lib_config['messages']['minSizeError'] = _t('DamnFineUploader.FILE_SMALL', "The file is too small, please upload a file larger than {$size}MB");
            }
        }

        return json_encode($this->lib_config);
    }

    /**
     * Return the response that Uppy expects
     * @param array $file_upload the uploaded file
     * @param string $uuid our unique ref of the file
     */
    protected function uploadSuccessfulResponse(array $file_upload, string $uuid): HTTPResponse
    {
        $response = [
            'uuid' => $uuid
        ];
        return HTTPResponse::create(json_encode($response), 200)->addHeader('Content-Type', 'application/json');
    }

    /**
     * Return the response that Uppy expects on error
     * @param array $file_upload the uploaded file (or empty array, if it could not be found)
     */
    protected function uploadErrorResponse(array $file_upload, string $error_message): HTTPResponse
    {
        return $this->errorResponse($error_message, 400);
    }

    /**
     * Error response for Uppy
     * @param string $result error string
     * @param int $code HTTP error code
     */
    protected function errorResponse(string $result, int $code = 400): HTTPResponse
    {
        return HTTPResponse::create($result, 400)->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that Uppy expects on successful file removal
     */
    protected function removeSuccessResponse(): HTTPResponse
    {
        return HTTPResponse::create('', 200)->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that Uppy expects on file removal error
     * @param array $file_upload the uploaded file or empty if the file could not be found
     * @param string $error message
     */
    protected function removeErrorResponse(array $file_upload, string $error): HTTPResponse
    {
        return $this->errorResponse($error, 400);
    }
}
