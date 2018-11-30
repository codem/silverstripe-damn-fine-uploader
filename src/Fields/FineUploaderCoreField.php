<?php
namespace Codem\DamnFineUploader;
use SilverStripe\View\Requirements;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use Exception;

/**
 * @note Provides a field to handle FineUploader uploads. FineUploade
 *            FineUploader can either attach to this field's form, or not
 *            By default the module ships with FineUpload attaching to this field's containing form, this is done to get file data submitting with the form submission
 *            You can enable a standalone drag-drop style interface by setting autoUpload to true, file submissions will then be directed through this field's upload method
 *            Read More: https://docs.fineuploader.com/branch/master/features/forms.html
 */
class FineUploaderCoreField extends DamnFineUploaderField {

    protected $file_input_param = 'qqfile';

    /**
     * @config
     * @var array
     */
    private static $allowed_actions = [
            'upload',
            'remove'
    ];

    /**
     * JS/CSS requirements for this field, children may implement
     */
    protected function setRequirements() {
        Requirements::set_force_js_to_bottom(true);
        Requirements::javascript('codem/silverstripe-damn-fine-uploader: client/dist/js/core.js');
        Requirements::css('codem/silverstripe-damn-fine-uploader: client/dist/styles/core.css');
    }

    /**
     * Returns the current implementation or self::IMPLEMENTATION_TRADITIONAL_CORE if not set/handled
     */
    public function getImplementation() {
        return self::IMPLEMENTATION_TRADITIONAL_CORE;
    }

    /**
     * Provide custom request endpoint configuration
     * @param array $request
     * @see https://docs.fineuploader.com/branch/master/api/options.html#request
     */
    public function setOptionRequest(array $request) {
        return parent::setOptionRequest($request);
    }

    /**
     * Provide custom deleteFile options
     * @see https://docs.fineuploader.com/branch/master/api/options.html#deleteFile
     * This requires your own delete implementation with checks and balances
     */
    public function setOptionDelete(array $delete) {
        return parent::setOptionDelete($delete);
    }

    /**
     * Provide runtime config to be merged into lib_config
     * If you wish to override the endpoint, use setRequestEndpoint()
     * @note you can set any options provided here: https://docs.fineuploader.com/branch/master/api/options.html
     */
    public function setConfig(array $config) {
        return parent::setConfig($config);
    }


    /**
     * acceptFiles is a list of mimetypes, not file extensions: https://docs.fineuploader.com/branch/master/api/options.html#validation.acceptFiles
     */
    protected function setUploaderDefaultConfig() {
        return parent::setUploaderDefaultConfig();
    }

    /**
     * Template helper method
     * @see https://github.com/FineUploader/fine-uploader/issues/1396
     * @see https://github.com/FineUploader/fine-uploader/issues/1910
     * @param boolean $transform_size_limit (deprecated)
     */
    public function UploaderConfig($transform_size_limit = true) {
        if(!$this->hasDefaultConfiguration()) {
            $this->setUploaderDefaultConfig();
        }

        /**
         * Prior to field output, ensure the values for file sizes are correct
         * Fineuploader uses 1e3 for reporting,
         * which can lead to weird errors like upload a 1.43MB file and FU stating
         * that the file should be < 1.5MB
         */
        if(isset($this->lib_config['validation']['sizeLimit'])) {
            $size = $this->AcceptedFileSize();
            if(isset($this->lib_config['messages']['sizeError'])) {
                $this->lib_config['messages']['sizeError'] = str_replace("{sizeLimit}", $size . "MB", $this->lib_config['messages']['sizeError']);
            } else {
                $this->lib_config['messages']['sizeError'] = _t('DamnFineUploader.FILE_LARGE', "The file is too large, please upload a file smaller than {$size}MB");
            }
        }

        // only makes sense if a min size limit was set
        if(isset($this->lib_config['validation']['minSizeLimit'])) {
            $size = $this->AcceptedMinFileSize();
            if(isset($this->lib_config['messages']['minSizeError'])) {
                $this->lib_config['messages']['minSizeError'] = str_replace("{minSizeLimit}", $size . "MB", $this->lib_config['messages']['minSizeError']);
            } else {
                $this->lib_config['messages']['minSizeError'] = _t('DamnFineUploader.FILE_SMALL', "The file is too small, please upload a file larger than {$size}MB");
            }
        }

        return json_encode($this->lib_config);
    }

    /**
     * Return the response that FineUploader expects
     */
    protected function uploadSuccessfulResponse(array $file_upload, $uuid) {
        $result = [
            'success' => true,
            'size' => $file_upload['size'],
            'allowed' => $this->lib_config['validation']['sizeLimit'],
            'overSize' => $this->overSize($file_upload['size']),
            'newUuid' => $uuid
        ];
        return (new HTTPResponse(json_encode($result), 200))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Return the response that FineUploader expects on error
     */
    protected function uploadErrorResponse(array $file_upload, $error) {
        $result = [
            'success' => false,
            'error' => $error,

            'message' => [
                    'type' => 'error',
                    'value' => $error,
            ],

            'meta' => [
                'size' => [
                    'size' => isset($file_upload['size']) ? $file_upload['size'] : 0,
                    'allowed' => $this->lib_config['validation']['sizeLimit'],
                    'overSize' => isset($file_upload['size']) ? $this->overSize($file_upload['size']) : 0,
                ]
            ]

        ];
        return $this->errorResponse($result, 400);
    }

    /**
     * Return the response that FineUploader expects on successful file removal
     */
    protected function removeSuccessResponse() {
        $result = [
            'success' => true,
        ];

        return (new HTTPResponse(json_encode($result), 200))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Return the response that FineUploader expects on file removal error
     */
    protected function removeErrorResponse(array $file_upload, $error) {
        $result = [
            'success' => false,
            'error' => $error,

            'message' => [
                    'type' => 'error',
                    'value' => $error,
            ]
        ];
        return $this->errorResponse($result, 400);
    }

    /**
     * Serialise error response for FineUploader
     */
    protected function errorResponse($result, $code = 400) {
        //header('Content-Type', 'application/json');print json_encode($result);exit;
        // Note that custom web server error pages may interfere with this
        return (new HTTPResponse(json_encode($result), 400))->addHeader('Content-Type', 'application/json');
    }

}
