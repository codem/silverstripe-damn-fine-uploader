<?php
namespace Codem\DamnFineUploader;
use SilverStripe\View\Requirements;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use Exception;

/**
 * @note Provides a field to handle FilePond uploads
 */
class FilePondField extends DamnFineUploaderField {

    private $upload_metadata = [];

    protected $implementation = parent::IMPLEMENTATION_FILEPOND;

    /**
     * @config
     * @var array
     */
    private static $allowed_actions = [
        'upload',
        'remove'
    ];

    protected function setRequirements() {
        Requirements::set_force_js_to_bottom(true);
        // todo filepond requirements
        Requirements::javascript('codem/silverstripe-damn-fine-uploader: client/dist/js/filepond.js');
        Requirements::css('codem/silverstripe-damn-fine-uploader: client/dist/styles/filepond.css');
    }

    public function getImplementation() {
        return parent::IMPLEMENTATION_FILEPOND;
    }

    public function UploaderConfig() {
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
     * FineUpload upload endpoint - removals are invoked via upload() with a DELETE verb
     */
    public function upload(HTTPRequest $request) {
        if($request->isDELETE()) {
            return $this->remove($request);
        }
        // handle upload attempt
        return parent::upload($request);
    }

    /**
     * FilePond sends a DELETE with the body being the uuid
     */
    public function remove(HTTPRequest $request) {
        try {
            if( !$request->isDELETE() ) {
                // fallback expect a DELETE
                throw new InvalidRequestException("Invalid removal request received");
            }

            // get uuid sent through, the one sent back in upload
            $uuid = file_get_contents('php://input');

            // get the security token from the form
            $form = $this->getForm();
            // request doesn't provide this
            $token = $form->getSecurityToken();
            if (!$token) {
                throw new Exception("SecurityToken is not valid");
            }
            // grab a value
            $form_security_token = $token->getValue();

            //remove the file
            return $this->removeFile($uuid, $form_security_token);

        } catch (MissingDataException $e) {
            $error = $e->getMessage();
        } catch (InvalidRequestException $e) {
            $error = $e->getMessage();
        } catch (FileRemovalException $e) {
            $error = $e->getMessage();
        } catch (Exception $e) {
            $error = "General error:" . $e->getMessage();
        }

        $file_upload = [];
        return $this->removeErrorResponse($file_upload, $error);

    }

    /**
     * getMetaData
     * Retrieve upload metadata, currently found in $_REQUEST when an upload occurs
     */
    private function setMetaData() {
        $this->upload_metadata = isset($_REQUEST[ $this->file_input_param ] ) ? json_decode($_REQUEST[ $this->file_input_param ], true) : [];
        return $this->upload_metadata;
    }

    /**
     * getMetaDataValue
     * Retrieve a value from the upload based on a key
     */
    private function getMetaDataValue($key) {
        if(empty($this->upload_metadata)) {
            $this->setMetaData();
        }
        return isset($this->upload_metadata[ $key ]) ? $this->upload_metadata[ $key ] : null;
    }

    /**
     * Given a request, get the form security token
     */
    protected function getSecurityTokenFromRequest(HTTPRequest $request) {
        // Form attached to this field
        $form = $this->getForm();

        // CSRF check
        $token = $form->getSecurityToken();
        if (!$token) {
            throw new Exception("SecurityToken not found");
        }
        $token_value = $token->getValue();
        $form_security_token_name = $token->getName();

        // FilePond specifics here
        $request_security_token_value = $this->getMetaDataValue($form_security_token_name);
        if(empty($request_security_token_value)) {
            throw new MissingDataException( _t('DamnFineUploader.UPLOAD_MISSING_SECURITY_TOKEN', "The upload request is missing required information") );
        }

        if($token_value != $request_security_token_value) {
            throw new Exception("SecurityToken is not valid");
        }

        // return the token value
        return $request_security_token_value;
    }

    /**
     * Given a request, get the file uuid
     */
    protected function getFileUuidFromRequest(HTTPRequest $request) {
        //FilePond specifics
        $request_file_uuid = $this->getMetaDataValue( self::UUID_NAME );
        if(empty($request_file_uuid)) {
            throw new InvalidRequestException( _t('DamnFineUploader.UPLOAD_MISSING_UUID', 'Required data not received') );
        }
        return $request_file_uuid;
    }

    /**
     * Return the response that FilePond expects
     */
    protected function uploadSuccessfulResponse(array $file_upload, $uuid) {
        return (new HTTPResponse($uuid, 200))->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that FilePond expects on error
     */
    protected function uploadErrorResponse(array $file_upload, $error) {
        return $this->errorResponse($error, 400);
    }

    /**
     * Serialise error response for FilePond
     */
    protected function errorResponse($result, $code = 400) {
        return (new HTTPResponse($result, 400))->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that FilePond expects on successful file removal
     */
    protected function removeSuccessResponse() {
        return (new HTTPResponse('', 200))->addHeader('Content-Type', 'text/plain');
    }

    /**
     * Return the response that FilePond expects on file removal error
     */
    protected function removeErrorResponse(array $file_upload, $error) {
        return $this->errorResponse($error, 400);
    }

}
