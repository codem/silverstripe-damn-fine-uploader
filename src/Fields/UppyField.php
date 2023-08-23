<?php

namespace Codem\DamnFineUploader;

use SilverStripe\View\Requirements;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use Exception;

/**
 * @note provides a field to handle Uppy File Uploader uploads
 */
class UppyField extends DamnFineUploaderField
{
    protected $implementation = parent::IMPLEMENTATION_UPPY;

    /**
     * @config
     * @var array
     */
    private static $allowed_actions = [
        'upload', // local upload endpoint
        'notify', // notify of completed upload
        'presign' // return a presigned URL for a single file
    ];

    protected function setRequirements()
    {
        Requirements::set_force_js_to_bottom(true);

        Requirements::javascript(
            'codem/silverstripe-damn-fine-uploader:client/dist/js/uppy.min.js',
            [
                "defer" => true,
                "async" => true,
                "crossorigin" => "anonymous",
                "integrity" => "sha384-iee18l3izaBdrIA/BvW7Ruv9baRlLFLhaPVZXsmjEpOLxlvVgxNlErVZb9k4hRm3"
            ]
        );
        Requirements::css(
            'codem/silverstripe-damn-fine-uploader:client/dist/styles/uppy.min.css',
            'screen',
            [
                "crossorigin" => "anonymous",
                "integrity" => "sha384-qUGMs4aTYflqjIQ7UaP2A0vFbfOoRHlYd6haCtxXgJuKQUJUb6Pttd5uUik8DLjA"
            ]
        );
    }

    public function getImplementation()
    {
        return parent::IMPLEMENTATION_UPPY;
    }

    /**
     * Uppy does not support removal of files post-upload
     * @param HTTPRequest $request
     * @return boolean
     */
    public function remove(HTTPRequest $request)
    {
        return false;
    }

    /**
     * Template helper method for UppyField, returns the serialised configuration string for the library
     * @return string
     */
    public function UploaderConfig()
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
     * @return HTTPResponse
     */
    protected function uploadSuccessfulResponse(array $file_upload, $uuid)
    {
        $response = [
            'uuid' => $uuid
        ];
        return (new HTTPResponse(json_encode($response), 200))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Return the response that Uppy expects on error
     * @param array $file_upload the uploaded file (or empty array, if it could not be found)
     * @param string $error_message
     * @return HTTPResponse
     */
    protected function uploadErrorResponse(array $file_upload, $error_message)
    {
        return $this->errorResponse($error_message, 400);
    }

    /**
     * Error response for Uppy
     * @param string $result error string
     * @param int $code HTTP error code
     * @return HTTPResponse
     */
    protected function errorResponse($result, $code = 400)
    {
        return (new HTTPResponse($result, 400))->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that Uppy expects on successful file removal
     * @return HTTPResponse
     */
    protected function removeSuccessResponse()
    {
        return (new HTTPResponse('', 200))->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that Uppy expects on file removal error
     * @param array $file_upload the uploaded file or empty if the file could not be found
     * @param string $error
     * @return HTTPResponse
     */
    protected function removeErrorResponse(array $file_upload, $error)
    {
        return $this->errorResponse($error, 400);
    }
}
