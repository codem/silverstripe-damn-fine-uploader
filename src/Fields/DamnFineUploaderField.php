<?php
namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use Silverstripe\Forms\FileField;
use Silverstripe\Forms\Form;
use Silverstripe\Forms\FormField;
use SilverStripe\View\Requirements;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\DataObjectInterface;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\FileUploadReceiver;
use SilverStripe\Forms\FileHandleField;
use SilverStripe\Assets\Upload;
use SilverStripe\Control\HTTP;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Security\NullSecurityToken;
use SilverStripe\Control\Controller;
use SilverStripe\Versioned\Versioned;
use Exception;
use finfo;

abstract class DamnFineUploaderField extends FormField implements FileHandleField
{
    use FileUploadReceiver;

    const IMPLEMENTATION_TRADITIONAL_CORE = 'traditionalcore';// @deprecated FineUploader Core implementation
    const IMPLEMENTATION_TRADITIONAL_UI = 'traditionalui';// @deprecated FineUploader UI implementation
    const IMPLEMENTATION_UPPY = 'uppy';// Uppy
    const UUID_NAME = 'dfu_uuid';

    protected $file_input_param = '';// file is uploaded in this POST variable

    protected $lib_config = [];//library configuration
    protected $runtime_config = [];//runtime config, merged into lib_config
    protected $option_delete;
    protected $option_request = [];//custom request/delete settings
    protected $default_accepted_types = ['image/jpg','image/gif','image/png','image/webp','image/jpeg'];// default to images for now
    protected $use_date_folder = true;

    protected $implementation = '';

    // TODO implement - files that match will fail
    private static $blacklist = [
        'php', 'php4', 'php5', 'php3', 'phtml',
        'js', 'css',
        'html', 'htm'
    ];

    private static $blacklist_mimetypes = [
        'text/x-php', 'text/php', 'application/php', 'application/x-php',
        'application/x-httpd-php', 'application/x-httpd-php-source',
        'application/javascript', 'text/javascript',
        'application/css', 'text/css'
    ];

    protected $default_configuration_complete = false;

    /**
     * @config
     * @var array
     */
    private static $allowed_actions = [
        'upload',
        'remove'
    ];

    public function __construct($name, $title = null, $value = null)
    {
        $this->constructFileUploadReceiver();
        // When creating new files, rename on conflict
        $this->getUpload()->setReplaceFile(false);
        parent::__construct($name, $title, $value);
        if (!$this->file_input_param) {
            $this->file_input_param = $name;
        }
    }

    /**
     * Each implementation requires it's own requirements
     */
    abstract protected function setRequirements();

    /**
     * ..and implementation
     */
    abstract public function getImplementation();

    /**
     * Implementations must provide this template helper method
     */
    abstract public function UploaderConfig();

    /**
     * Response string for a successful upload
     */
    abstract protected function uploadSuccessfulResponse(array $file_upload, $uuid);
    abstract protected function uploadErrorResponse(array $file_upload, $error);
    abstract protected function errorResponse($result, $code = 400);
    abstract protected function removeSuccessResponse();
    abstract protected function removeErrorResponse(array $file_upload, $error);

    /**
     * Retrieve the file input from the request
     */
    private function getFileFromRequest(HTTPRequest $request)
    {
        $post = $request->postVars();
        if (isset($post[ $this->file_input_param ])) {
            return $post[ $this->file_input_param ];
        } else {
            return false;
        }
    }

    /**
     * Given a request, get the form security token
     */
    protected function getSecurityTokenFromRequest(HTTPRequest $request)
    {
        // Form attached to this field
        $form = $this->getForm();

        // CSRF check
        $token = $form->getSecurityToken();
        if (!$token || !$token->checkRequest($request)) {
            throw new Exception("SecurityToken is not valid");
        }
        $token_value = $token->getValue();
        $form_security_token_name = $token->getName();

        $post = $request->postVars();// sent via POST by default
        if (empty($post[ $form_security_token_name ])) {
            throw new MissingDataException(_t('DamnFineUploader.UPLOAD_MISSING_SECURITY_TOKEN', "The upload request is missing required information"));
        }

        if ($token_value != $post[ $form_security_token_name ]) {
            throw new Exception("SecurityToken is not valid");
        }

        // return the token value
        return $post[ $form_security_token_name ];
    }

    /**
     * Given a request, get the file uuid
     */
    protected function getFileUuidFromRequest(HTTPRequest $request)
    {
        $post = $request->postVars();// sent via POST by default
        if (empty($post[ self::UUID_NAME ])) {
            throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_MISSING_UUID', 'Required data not received'));
        }
        return $post[ self::UUID_NAME ];
    }

    /**
      * Action to handle upload of a single file
      * @note the PHP settings to consider here are file_uploads, upload_max_filesize, post_max_size, upload_tmp_dir
      *      file_uploads - when off, the $_FILES array will be empty
      *      upload_max_filesize - files over this size will trigger error #1
      *      post_max_size - requests over this size will cause the $_FILES array to be empty
      *      upload_tmp_dir - an invalid or non-writable tmp dir will cause error #6 or #7
      * @note depending on the size of the uploads allowed, you may like to increase the max input/execution time for these requests
      *
      * Implementations can implement their own upload method
      *
      * @param SilverStripe\Control\HTTPRequest $request
      * @return SilverStripe\Control\HTTPResponse
      */
    public function upload(HTTPRequest $request)
    {
        try {

            // set default file uploaded (empty)
            $file_upload = [];

            // get field config
            $this->initFieldConfig();

            $post = $request->postVars();

            // initial check on request
            if (empty($post) || !$request->isPOST()) {
                throw new InvalidRequestException("No file data provided");
            }

            // Get form security token
            $form_security_token = $this->getSecurityTokenFromRequest($request);

            // Get file uniq ID sent in request
            $file_uuid = $this->getFileUuidFromRequest($request);

            // Get the uploaded file
            $file_upload = $this->getFileFromRequest($request);

            // Do we have a file tmp_name ?
            if (empty($file_upload['tmp_name'])) {
                throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_MISSING_FILES', 'Required data not received'));
            }

            // Check if tmp_name is an uploaded file
            if (!$this->isUploadedFile($file_upload['tmp_name'])) {
                throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_NOT_AN_UPLOAD', 'The upload could not be saved'));
            }

            // Check the tmp file against allowed mimetypes  - e.g file/bad being uploaded as file.good
            $result = $this->checkUploadedFile($file_upload);
            if (!$result['valid']) {
                $mimetype = !empty($result['mimetype']) ? $result['mimetype'] : 'unknown';
                throw new InvalidRequestException(sprintf(_t('DamnFineUploader.UPLOAD_NOT_ACCEPTED_FILE', 'The file uploaded could not be accepted as it is a %s file, please try again with a different file'), $mimetype));
            }

            // create the file UUID for this file, sent back in the request
            $uuid = $this->getUuid($file_uuid);

            // Config options for this upload

            // set allowed extensions for the upload validator
            $this->setAllowedExtensions($this->lib_config['validation']['allowedExtensions']);

            // set default folder name, if not set
            if (!$this->folderName) {
                $this->setFolderName(Upload::config()->uploads_folder);
            }

            // Using date based sub directories
            if ($this->use_date_folder) {
                // Handle data based folder name, if no specific folder name already set
                $date_part = date('Y/m/d');
                $this->setFolderName($this->folderName . "/{$date_part}/");
            } else {
                $this->setFolderName($this->folderName);
            }

            // save it
            $file = $this->saveFile($file_upload, $uuid, $form_security_token);

            // return OK
            return $this->uploadSuccessfulResponse($file_upload, $uuid);
        } catch (MissingDataException $e) {
            $error = $e->getMessage();
        } catch (InvalidRequestException $e) {
            $error = $e->getMessage();
        } catch (InvalidFileException $e) {
            $error = $e->getMessage();
        } catch (Exception $e) {
            $error = "General error:" . $e->getMessage();
        }

        $this->getUpload()->clearErrors();
        return $this->uploadErrorResponse($file_upload, $error);
    }

    /**
     * Save the file somewhere
     */
    final private function saveFile($file_upload, $uuid, $form_security_token)
    {

        // Set allowed max file size
        $this->getValidator()->setAllowedMaxFileSize($this->lib_config['validation']['sizeLimit']);

        // TODO set max allowed file number (need this particular file upload to know how many siblings exist)
        // This will call loadIntoFile which triggers onAfterUpload()
        $file = $this->saveTemporaryFile($file_upload, $error);
        if ($error) {
            throw new InvalidFileException($error);
        }
        if (!$file) {
            throw new InvalidFileException('File could not be saved');
        }

        // save the token, together with the Form Security ID for the form used to upload the file
        $file->DFU = $uuid . "|" . $form_security_token;
        $file->IsDfuUpload = 1;
        $file->writeToStage(Versioned::DRAFT);

        // if the file is ever published on upload, this unpublishes it
        if ($this->config()->get('unpublish_after_upload')) {
            $file->doUnpublish();
        }

        return $file;
    }

    /**
     * Action to handle removal of a single file via its uuid.
     * It also automatically adds a _method param with a value of DELETE, triggering {@link HTTPRequest::detect_method()} handling
     * Converting the httpMethod to DELETE, so we need to check for either a POST OR DELETE request here
     */
    public function remove(HTTPRequest $request)
    {
        try {
            $post = $request->postVars();
            if ($request->isPOST() && empty($post)) {
                //invalid POST
                throw new InvalidRequestException("No file data provided");
            } elseif (!$request->isDELETE()) {
                // fallback expect a DELETE
                throw new InvalidRequestException("Invalid removal request received");
            }

            // Get form security token
            $form_security_token = $this->getSecurityTokenFromRequest($request);

            // Get file uniq ID sent in request
            $file_uuid = $this->getFileUuidFromRequest($request);

            //remove the file
            return $this->removeFile($file_uuid, $form_security_token);
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
     * Remove a file based on its uuid and the form's security token
     * You can override this handling if you wish to modify the response (e.g a 202 response)
     */
    final protected function removeFile($uuid, $form_security_token)
    {
        $file = singleton(File::class);
        // Do not untrust to allow multiple delete attempts
        $record = $file->getByDfuToken($uuid, $form_security_token, false);
        $record_id = null;
        if (($record instanceof File) && !empty($record->ID)) {
            $record_id = $record->ID;
            $record->doArchive();
        } else {
            // the file isn't here
            throw new FileRemovalException("The file could not be deleted");
        }

        $check = DataObject::get_by_id(File::class, $record_id);
        if (!empty($check->ID)) {
            // check on the file returned a record with this id
            throw new FileRemovalException("The file could not be deleted");
        }

        return $this->removeSuccessResponse();
    }


    /**
     * Return a Relative upload link for this field
     *
     * @param string $action
     *
     * @return string
     */
    public function UploadLink()
    {
        return Controller::join_links('field/' . $this->name, 'upload');
    }

    /**
     * setUseDateFolder - triggers the upload folder to be date based
     */
    final public function setUseDateFolder($use = true)
    {
        $this->use_date_folder = $use;
        return $this;
    }

    /**
     * Based on the implementation, set library requirements and the template to use
     * @note called by self::Field()
     */
    final protected function libraryRequirements()
    {
        $this->setRequirements();
        $this->initFieldConfig();
    }

    /**
     * initialise the field configuration and set a default,sane config specification
     * @param boolean $force set to true to override any current config and re-init
     */
    final public function initFieldConfig($force = false)
    {
        if (!$this->hasDefaultConfiguration() || $force) {
            $this->setUploaderDefaultConfig();
        }
    }

    /**
     * Sets the default config from YAML configuration and applies some configuration based on this form
     */
    protected function setUploaderDefaultConfig()
    {
        $this->default_configuration_complete = false;

        // set default lib_config from yml
        $lib_config = $this->config()->get('implementation');

        // element options
        $form = $this->getForm();
        //$lib_config['element'] = (string)($form ? $form->getHTMLID() : "");// the containing form id attribute
        //$lib_config['autoUpload'] = false;// do not auto upload by default

        // form options
        $lib_config['form'] = [];
        //$lib_config['form']['autoUpload'] = false;// do not auto upload by default

        // messages
        $lib_config['messages'] = [
            'emptyError' => _t('DamnFineUploader.ZERO_BYTES', 'The file {file} seems to be empty'),
            'noFilesError' => _t('DamnFineUploader.NO_FILES', 'No files were submitted'),
            'minSizeError' => _t('DamnFineUploader.FILE_SMALL', 'The file is too small, please upload a file larger than {minSizeLimit}'),
            'sizeError' => _t('DamnFineUploader.FILE_LARGE', 'The file is too large, please upload a file smaller than {sizeLimit}'),
            'maxHeightImageError' => _t('DamnFineUploader.IMAGE_TALL', 'The image height is greater than the maximum allowed height'),
            'maxWidthImageError' => _t('DamnFineUploader.IMAGE_WIDE', 'The image width is greater than the maximum allowed width'),
            'minHeightImageError' => _t('DamnFineUploader.IMAGE_SHORT', 'The image height is smaller than the minimum allowed height'),
            'minWidthImageError' => _t('DamnFineUploader.IMAGE_NARROW', 'The image width is smaller than the minimum allowed width'),
            'tooManyItemsError' => _t('DamnFineUploader.MAX_ITEMS', 'The maximum number of uploads ({itemLimit}) has been reached'),
            'typeError' => _t('DamnFineUploader.TYPE_ERROR', '{file} has an invalid extension. Valid extension(s): {extensions}'),
        ];

        // start off with a zero minsize limit
        if (!isset($lib_config['validation']['minSizeLimit'])) {
            $lib_config['validation']['minSizeLimit'] = 0;
        }

        // text
        $lib_config['text'] = [
            'defaultResponseError' => _t('DamnFineUploader.GENERAL_ERROR', 'The upload failed due to an unknown reason')
        ];

        // request endpoint
        $lib_config['request'] = [
            'method' => 'POST',
            'uuidName' => self::UUID_NAME,
            'requireSuccessJson' => true,
            'endpoint' => '',// see below
            'params' => [],
            'paramsInBody' => true // sends request parameters in the body of the upload request
        ];

        // default deleteFile configuration
        // some options are set in config.yml
        $lib_config['deleteFile']['enabled'] = false;//off by default, see below
        $lib_config['deleteFile']['endpoint'] = '';//see below
        $lib_config['deleteFile']['method'] = 'POST';//enforce POST
        $lib_config['deleteFile']['params'] = [];// see below

        /**
         * This configuration requires the field to have a form attached,
         * which is not always the case e.g userform module where the
         * form is only attached after the field {@link SilverStripe\UserForms\Form\UserForm::__construct()}
         */
        if ($form instanceof Form) {
            // The configuration options require a form with a Security Token
            $token = $form->getSecurityToken();
            if (!$token || $token instanceof NullSecurityToken) {
                $form->enableSecurityToken();
            }

            // request options
            $lib_config['request']['endpoint'] = $this->Link('upload');
            $lib_config['request']['params'][ $token->getName() ] = $token->getValue();

            // deleteFile options if allowed
            $allow_delete = $this->config()->allow_delete;
            if ($allow_delete) {
                $lib_config['deleteFile']['enabled'] = true;//enable when we can handle a delete
                $lib_config['deleteFile']['endpoint'] = $this->Link('remove');
                $lib_config['deleteFile']['params'][ $token->getName() ] = $token->getValue();
            }
        }

        // fallback to default accepted file types if none set
        if (empty($lib_config['validation']['acceptFiles'])) {
            $lib_config['validation']['acceptFiles'] = implode(",", $this->default_accepted_types);// this could inckude
            $lib_config['validation']['allowedExtensions'] = $this->getExtensionsForTypes($this->default_accepted_types);//TODO
        }

        // merge runtime config into default config, create lib_config
        $this->lib_config = array_replace_recursive($lib_config, $this->runtime_config);

        // Sanity check on the file size limit vs system restrictions
        $system_max_file_size = $this->getSystemAllowedMaxFileSize();
        if (empty($this->lib_config['validation']['sizeLimit'])) {
            // if not yet set, use the system size
            $this->lib_config['validation']['sizeLimit'] = $system_max_file_size;
        } else {
            // ensure that the size is under the system size
            $this->lib_config['validation']['sizeLimit'] = min($this->lib_config['validation']['sizeLimit'], $system_max_file_size);
        }

        // sanity checks on the minimum size limits provided
        if (isset($this->lib_config['validation']['minSizeLimit']) && isset($this->lib_config['validation']['sizeLimit'])) {
            if ($this->lib_config['validation']['minSizeLimit'] > $this->lib_config['validation']['sizeLimit']) {
                $this->lib_config['validation']['minSizeLimit'] = 0;
            }
        }

        $this->default_configuration_complete = true;
    }

    /**
     * Checks whether lib_config is present and complete
     */
    public function hasDefaultConfiguration()
    {
        return !empty($this->lib_config) && $this->default_configuration_complete;
    }

    /**
     * Set a Form Security Token on config
     * @param SecurityToken $token
     */
    public function setSecurityToken(SecurityToken $token)
    {
        $this->runtime_config['request']['params'][ $token->getName() ] = $token->getValue();
        return $this;
    }

    /**
     * Set a request endpoint (absolute or relative URL only) or reset based on the field's form (if available)
     * When using this method other request options are sourced from {@link self::setUploaderDefaultConfig()}
     * To set custom request options see {@link self::setOptionRequest()}
     */
    public function setRequestEndpoint($endpoint = "")
    {
        if ($endpoint) {
            $this->runtime_config['request']['endpoint'] = $endpoint;
        } elseif ($form = $this->getForm()) {
            $this->runtime_config['request']['endpoint'] = $this->Link('upload');
        }
        return $this;
    }

    /**
     * Set a delete endpoint (absolute or relative URL only) or reset based on the field's form (if available)
     * When using this method other deleteFile options are sourced from {@link self::setUploaderDefaultConfig()}
     * To set custom deleteFile options see {@link self::setOptionDelete()}
     */
    public function setDeleteEndpoint($endpoint = "")
    {
        $this->runtime_config['deleteFile']['enabled'] = true;//setting an endpoint enables file uploads
        if ($endpoint) {
            $this->runtime_config['deleteFile']['endpoint'] = $endpoint;
        } elseif ($form = $this->getForm()) {
            $this->runtime_config['deleteFile']['endpoint'] = $this->Link('remove');
        }
        return $this;
    }

    /**
     * Provide custom request endpoint configuration
     * @param array $request
     */
    public function setOptionRequest(array $request)
    {
        $this->runtime_config['request'] = $request;
        return $this;
    }

    /**
     * Provide custom deleteFile options
     * This requires your own delete implementation with checks and balances
     */
    public function setOptionDelete(array $delete)
    {
        $this->runtime_config['deleteFile'] = $delete;
        return $this;
    }

    /**
     * Get a single value from config, this populates lib_config if it is not already created
     */
    public function getUploaderConfigValue($category, $key)
    {
        if (!$this->hasDefaultConfiguration()) {
            $this->setUploaderDefaultConfig();
        }
        if (isset($this->lib_config[$category][$key])) {
            return $this->lib_config[$category][$key];
        }
        return null;
    }

    /**
     * Provide runtime config to be merged into lib_config
     * If you wish to override the endpoint, use setRequestEndpoint()
     */
    public function setConfig(array $config)
    {
        $this->runtime_config = $config;
        return $this;
    }

    /**
     * @note set the accepted types for this form
     */
    public function setAcceptedTypes(array $types)
    {
        $this->runtime_config['validation']['acceptFiles'] = implode(",", $types);// this could inckude
        $this->runtime_config['validation']['allowedExtensions'] = $this->getExtensionsForTypes($types);//TODO
        return $this;
    }

    /**
     * Returns the system provided max file size, in bytes
     * @returns int
     */
    public function getSystemAllowedMaxFileSize()
    {
        $bytes = (int)$this->getValidator()->getAllowedMaxFileSize();
        return $bytes;
    }

    /**
     * Set the maximum allowed filesize, in bytes
     * Note that if the system setting is lower, that will be used
     */
    public function setAllowedMaxFileSize($bytes)
    {
        $bytes = (int)$bytes;
        $system = $this->getSystemAllowedMaxFileSize();
        $limit = min($bytes, $system);
        $this->runtime_config['validation']['sizeLimit'] = $limit;

        return $this;
    }

    /**
     * This method is provided for consistency
     */
    public function setAcceptedMaxFileSize($bytes)
    {
        return $this->setAllowedMaxFileSize($bytes);
    }

    /**
     * setAcceptedMinFileSize - set the minimum upload file size
     * Worth noting that you can provide a minSizeLimit > the sizeLimit here, in which case the minSizeLimit will be reset to 0
     * @param int $size bytes
     */
    public function setAcceptedMinFileSize($size)
    {
        $this->runtime_config['validation']['minSizeLimit'] = $size;// bytes
        return $this;
    }

    public function setAllowedMaxItemLimit($limit)
    {
        $this->runtime_config['validation']['itemLimit'] = $limit;
        return $this;
    }

    /**
     * Set max dimensions for image uploads
     */
    public function setAcceptedMaxDimensions($width, $height)
    {
        $this->runtime_config['validation']['image']['maxHeight'] = $height;
        $this->runtime_config['validation']['image']['maxWidth'] = $width;
        return $this;
    }

    /**
     * Set min dimensions for image uploads
     */
    public function setAcceptedMinDimensions($width, $height)
    {
        $this->runtime_config['validation']['image']['minHeight'] = $height;
        $this->runtime_config['validation']['image']['minWidth'] = $width;
        return $this;
    }

    public function getAcceptedTypes()
    {
        $mimetypes = $this->getUploaderConfigValue('validation', 'acceptFiles');
        if (is_string($mimetypes) !== false) {
            return explode(",", $mimetypes);
        } else {
            return [];
        }
    }

    /**
     * Return a list of extensions matching the file types provided
     * @param array $types e.g  ['image/jpg', 'image/gif']
     */
    final protected function getExtensionsForTypes($types)
    {
        $mime_types = HTTP::config()->uninherited('MimeTypes');
        $keys = [];
        foreach ($types as $type) {
            $result = array_keys($mime_types, $type);
            if (is_array($result)) {
                $keys = array_merge($keys, $result);
            }
        }
        return $keys;
    }

    /**
     * AcceptedExtensions - a template helper method
     */
    public function AcceptedExtensions()
    {
        $types = $this->getAcceptedTypes();
        $extensions = $this->getExtensionsForTypes($types);
        return implode(", ", $extensions);
    }

    /**
     * AcceptedFileSize - a template helper method to return allowed file size in MB
     * @see getUploaderConfig
     */
    public function AcceptedFileSize($round = 1)
    {
        $size = (int)$this->lib_config['validation']['sizeLimit'];// bytes
        $mb = round($size / 1048576, $round);// allow for displaying< 1 MB uploads
        return $mb;
    }

    /**
     * AcceptedMinFileSize - a template helper method to return minimkum file size in MB
     * @see getUploaderConfig
     */
    public function AcceptedMinFileSize($round = 1)
    {
        $size = (int)$this->lib_config['validation']['minSizeLimit'];// bytes
        $mb = round($size / 1048576, $round);// allow for displaying < 1 MB uploads
        return $mb;
    }

    /**
     * AcceptedItemLimit - a template helper method
     */
    public function AcceptedItemLimit()
    {
        $limit = $this->lib_config['validation']['itemLimit'];
        return $limit;
    }

    /**
     * AcceptedMaxWidth - a template helper method
     */
    public function AcceptedMaxWidth()
    {
        if (isset($this->lib_config['validation']['image']['maxWidth'])) {
            return (int)$this->lib_config['validation']['image']['maxWidth'];
        }
        return false;
    }

    /**
     * AcceptedMaxHeight - a template helper method
     */
    public function AcceptedMaxHeight()
    {
        if (isset($this->lib_config['validation']['image']['maxHeight'])) {
            return (int)$this->lib_config['validation']['image']['maxHeight'];
        }
        return false;
    }

    public function AcceptedMaxDimensions()
    {
        if (($width = $this->AcceptedMaxWidth()) && ($height = $this->AcceptedMaxHeight())) {
            return $width . "×" . $height;
        }
        return "";
    }

    /**
     * AcceptedMinWidth - a template helper method
     */
    public function AcceptedMinWidth()
    {
        if (isset($this->lib_config['validation']['image']['minWidth'])) {
            return (int)$this->lib_config['validation']['image']['minWidth'];
        }
        return false;
    }

    /**
     * AcceptedMinHeight - a template helper method
     */
    public function AcceptedMinHeight()
    {
        if (isset($this->lib_config['validation']['image']['minHeight'])) {
            return (int)$this->lib_config['validation']['image']['minHeight'];
        }
        return false;
    }

    public function AcceptedMinDimensions()
    {
        if (($width = $this->AcceptedMinWidth()) && ($height = $this->AcceptedMinHeight())) {
            return $width . "×" . $height;
        }
        return "";
    }

    /**
     * Test accepted mimetypes for an image/* value
     */
    public function AcceptsImages()
    {
        $types = $this->getAcceptedTypes();
        $accepts = false;
        foreach ($types as $type) {
            if (strpos($type, "image/") === 0) {
                $accepts = true;
                break;
            }
        }
        return $accepts;
    }

    public function Field($properties = array())
    {
        $this->libraryRequirements();
        return parent::Field($properties);
    }


    public function FieldHolder($properties = array())
    {
        return parent::FieldHolder($properties);
    }

    /**
     * The Small Field Holder is the large holder
     */
    public function SmallFieldHolder($properties = array())
    {
        return parent::FieldHolder($properties);
    }

    /**
     * @note provided an extension, get a mime type from SS mimetypes map
     * @param string $ext e.g jpg html - without the .
     */
    protected function getMimeTypeFromExtension($ext)
    {
        $mimeTypes = Config::inst()->get('HTTP', 'MimeTypes');
        // The mime type doesn't exist
        if (!isset($mimeTypes[$ext])) {
            return 'application/unknown';
        } else {
            return $mimeTypes[$ext];
        }
    }

    /**
     * @note split out mimetype into type and subtype
     */
    final protected function parseMimeType($mimetype)
    {
        $parsed = false;
        if (strpos($mimetype, "/") !== false) {
            $parts = explode('/', $mimetype);
            $parsed = array(
                'type' => $parts[0],
                'subtype' => $parts[1],
            );
        }
        return $parsed;
    }

    /**
     * @note refer to https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-accept
     */
    protected function isAccepted($mimetype)
    {
        $valid = false;
        $types = $this->getAcceptedTypes();//returns a mix of accept options configured for the input element
        if (empty($types)) {
            throw new Exception("No accepted mime types have been configured");
        }
        $mimetype_parts = $this->parseMimeType($mimetype);

        foreach ($types as $type) {
            $type_parts = $this->parseMimeType($type);
            if ($type_parts) {
                if ($type_parts['subtype'] == "*") {
                    // e.g image/* (HTML5)  image == image
                    $valid = ($type_parts['type'] == $mimetype_parts['type']);
                } else {
                    // match on both
                    // A valid MIME type with no extensions.
                    // e.g image/jpg == image/jpg
                    $valid = ($type_parts['type'] == $mimetype_parts['type'] && $type_parts['subtype'] == $mimetype_parts['subtype']);
                }
            } elseif ($result = preg_match("/^\.([a-zA-Z0-9]+)/", $type, $matches)) {
                // A file extension starting with the STOP character (U+002E). (e.g. .jpg, .png, .doc)
                if (!empty($matches[1])) {
                    $type = $this->getMimeTypeFromExtension($matches[1]);
                    if (strpos($type, "/") !== false) {
                        // ensure we don't recurse
                        $valid = $this->isAccepted($type);
                    }
                }
            } else {
                // unhandled
                continue;
            }

            if ($valid) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param string $tmp_path the path from $_FILES
     */
    final protected function isUploadedFile($tmp_path)
    {
        return is_uploaded_file($tmp_path);
    }

    /**
     * @note provided a path to an uploaded file, check that it matches configuration prior to saving
     */
    protected function checkUploadedFile($tmp_file)
    {
        $file_path = isset($tmp_file['tmp_name']) ? $tmp_file['tmp_name'] : '';
        if (!$file_path) {
            throw new InvalidFileException(_t('DamnFineUploader.TMP_FILE_NOT_FOUND', 'Sorry, the file could not be read'));
        }
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimetype = $finfo->file($file_path);
        $valid = $this->isAccepted($mimetype);
        return [
            'valid' => $valid,
            'mimetype' => $mimetype
        ];
    }

    /**
     * Validation occurs at {@link self::upload()}
     */
    public function validate($validator)
    {
        return true;
    }

    /**
     * Sign the UUID provided by FineUploader for return to it.
     * @param string $uuid provided by Fine Uploader
     * @param string $form_security_token security token value in this form
     * For PHP5 this uses the random_compat lib polyfill
     * @returns string
     */
    protected static function sign_uuid($uuid)
    {
        $key = Config::inst()->get(DamnFineUploaderField::class, 'signing_key');
        if (empty($key)) {
            throw new Exception("No signing key is set in configuration");
        }
        $salt = bin2hex(random_bytes(16));
        $token = hash_hmac("sha256", $uuid . $salt, $key, false);
        return $token;
    }

    /**
     * @returns string the value returned as newUuid to the client uploader
     */
    protected function getUuid($uuid)
    {
        if (empty($uuid)) {
            throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_MISSING_UUID', 'Required data not received'));
        }
        $signed_value = self::sign_uuid($uuid);
        return $signed_value;
    }

    /**
     * Return how oversize a value is
     * @param int $in bytes
     */
    public function overSize($in)
    {
        $check = $this->lib_config['validation']['sizeLimit'];
        if ($check == 0) {
            return 0;
        }
        return round(($in / $check), 2);
    }
}
