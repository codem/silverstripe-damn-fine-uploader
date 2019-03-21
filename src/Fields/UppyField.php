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
        'upload',
    ];

    protected function setRequirements()
    {
        Requirements::set_force_js_to_bottom(true);
        // todo uppy requirements
        Requirements::javascript('codem/silverstripe-damn-fine-uploader: client/dist/js/uppy.js');
        Requirements::css('codem/silverstripe-damn-fine-uploader: client/dist/styles/uppy.css');
    }

    public function getImplementation()
    {
        return parent::IMPLEMENTATION_UPPY;
    }

    /**
     * Uppy does not support removal of files post-upload
     * @param HTTPRequest
     * @returns boolean
     */
    public function remove(HTTPRequest $request)
    {
        return false;
    }

    /**
     * Template helper method for UppyField
     * @returns string
     */
    public function UploaderConfig()
    {
        if (!$this->hasDefaultConfiguration()) {
            $this->setUploaderDefaultConfig();
        }

        /**
         * Prior to field output, ensure the values for file sizes are correct
         * Fineuploader uses 1e3 for reporting,
         * which can lead to weird errors like upload a 1.43MB file and FU stating
         * that the file should be < 1.5MB
         */
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
    protected function uploadSuccessfulResponse(array $file_upload, $uuid)
    {
        $response = [
            'uuid' => $uuid
        ];
        return (new HTTPResponse(json_encode($response), 200))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Return the response that Uppy expects on error
     */
    protected function uploadErrorResponse(array $file_upload, $error)
    {
        return $this->errorResponse($error, 400);
    }

    /**
     * Serialise error response for Uppy
     */
    protected function errorResponse($result, $code = 400)
    {
        return (new HTTPResponse($result, 400))->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that Uppy expects on successful file removal
     */
    protected function removeSuccessResponse()
    {
        return (new HTTPResponse('', 200))->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that Uppy expects on file removal error
     */
    protected function removeErrorResponse(array $file_upload, $error)
    {
        return $this->errorResponse($error, 400);
    }
}
