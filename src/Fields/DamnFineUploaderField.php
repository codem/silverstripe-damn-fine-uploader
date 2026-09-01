<?php

namespace Codem\DamnFineUploader;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Upload;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTP;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\FileUploadReceiver;
use SilverStripe\Forms\FileHandleField;
use SilverStripe\MimeValidator\MimeUploadValidator;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Security\NullSecurityToken;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Requirements;
use Exception;
use finfo;

/**
 * Abstract class for all possible upload fields in the module
 * See UppyField for the field used by the Uppy uploader frontend
 */
abstract class DamnFineUploaderField extends FormField implements FileHandleField
{
    use FileUploadReceiver;

    public const IMPLEMENTATION_UPPY = 'uppy';

    public const UUID_NAME = 'dfu_uuid';

    // file is uploaded in this POST variable
    protected string $file_input_param = '';

    //library configuration
    protected array $lib_config = [];

    //runtime config, merged into lib_config
    protected $runtime_config = [];

    // custom delete settings
    protected array $option_delete = [];

    // custom request settings
    protected array $option_request = [];

    // default to images if no accepted types set
    protected string $default_accepted_types = 'image/jpg,image/gif,image/png,image/webp,image/jpeg';

    protected bool $use_date_folder = true;

    protected string $implementation = '';

    protected bool $supportsNotifications = false;

    /**
     * @var array
     * Array of mimetypes that are never allowed in uploads
     */
    private static array $denied_mimetypes = [
        'text/x-php', 'text/php', 'application/php', 'application/x-php',
        'application/x-httpd-php', 'application/x-httpd-php-source',
        'application/javascript', 'text/javascript',
        'application/css', 'text/css',
        'image/svg+xml',
        'text/html',
        'application/xml', 'application/xhtml+xml'
    ];

    /**
     * @var array
     * Array of types that are never allowed in uploads
     */
    private static array $denied_types = [
        '.php',
        '.js',
        '.css',
        '.svg',
        '.html',
        '.xml'
    ];

    protected $default_configuration_complete = false;

    /**
     * @config
     */
    private static array $allowed_actions = [
        'upload',
        'remove',
        'notify',
        'presign'
    ];

    /**
     * Construct the field, set the upload receiver up, with validator
     * Sets the file_input_param value to the field name, if none is set
     * @param string $name,
     * @param string $title = null
     * @param mixed $value
     */
    public function __construct($name, $title = null, $value = null)
    {
        // create the Upload instance
        $this->constructFileUploadReceiver();
        // When creating new files, rename on conflict
        $this->getUpload()->setReplaceFile(false);
        parent::__construct($name, $title, $value);
        if ($this->file_input_param === '') {
            $this->file_input_param = $name;
        }
    }

    /**
     * The value is an array of file upload ids, with keys determined by the frontend library
     * The file upload ids are passed back to the uploader after a successful call to self::upload()
     * @return ?array
     */
    public function dataValue()
    {
        $request = $this->form->getController()->getRequest();
        $post = [];
        if ($request) {
            $post = $request->postVars();
        }

        return $post[$this->getName()] ?? null;
    }

    /**
     * @return ?array
     */
    public function Value()
    {
        return $this->dataValue();
    }

    /**
     * Get custom validator for this field
     */
    public function getValidator(): MimeUploadValidator
    {
        return Injector::inst()->get(MimeUploadValidator::class);
    }

    /**
     * Set custom validator for this field, must be a MimeUploadValidator
     */
    public function setValidator(MimeUploadValidator $validator): self
    {
        $this->getUpload()->setValidator($validator);
        return $this;
    }

    /**
     * Each implementation requires it's own requirements
     */
    abstract protected function setRequirements(): void;

    /**
     * ..and implementation
     */
    abstract public function getImplementation(): string;

    /**
     * Implementations must provide this template helper method
     * a JSON encoded string should be returned containing uploader configuration
     */
    abstract public function UploaderConfig(): string;

    /**
     * Response for a successful upload
     * @param array $file_upload the uploaded file
     * @param string $uuid our unique ref of the file
     */
    abstract protected function uploadSuccessfulResponse(array $file_upload, string $uuid): HTTPResponse;

    /**
     * Response for a failed upload
     * @param array $file_upload the uploaded file (or empty array, if it could not be found)
     * @param string $error message
     */
    abstract protected function uploadErrorResponse(array $file_upload, string $error): HTTPResponse;

    /**
     * Error response
     * @param string $result error string
     * @param int $code HTTP error code
     */
    abstract protected function errorResponse(string $result, int $code = 400): HTTPResponse;

    /**
     * Return the response on successful removal
     */
    abstract protected function removeSuccessResponse(): HTTPResponse;

    /**
     * Return the response on failed removal
     * @param array $file_upload file data (or empty array, if it could not be found)
     * @param string $error message
     */
    abstract protected function removeErrorResponse(array $file_upload, string $error): HTTPResponse;

    /**
     * Retrieve the file input data from the request
     */
    private function getFileFromRequest(): ?array
    {
        return $_FILES[ $this->file_input_param ] ?? null;
    }

    /**
     * Given a request, get the form security token value from the request
     */
    protected function getSecurityTokenFromRequest(HTTPRequest $request): string
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

        if ($token_value != $post[ $form_security_token_name ] || !is_string($post[ $form_security_token_name ])) {
            throw new Exception("SecurityToken is not valid");
        }

        // return the token value
        return $post[ $form_security_token_name ];
    }

    /**
     * Given a request, get the file uuid
     */
    protected function getFileUuidFromRequest(HTTPRequest $request): string
    {
        $post = $request->postVars();// sent via POST by default
        if (empty($post[ self::UUID_NAME ]) || !is_string($post[ self::UUID_NAME ])) {
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
     */
    public function upload(HTTPRequest $request): HTTPResponse
    {
        try {
            $this->setRequest($request);
            $result = $this->validateUpload($this->getValidator());
            if (!$result instanceof \SilverStripe\Control\HTTPResponse) {
                throw new \Exception("The file could not be saved");
            }

            return $result;
        } catch (MissingDataException|InvalidRequestException|InvalidFileException $e) {
            $error = $e->getMessage();
        } catch (Exception $e) {
            $error = "General error:" . $e->getMessage();
        }

        $this->getUpload()->clearErrors();
        return $this->uploadErrorResponse([], $error);
    }

    /**
     * By default fields do not support presign
     */
    public function presign(HTTPRequest $request): HTTPResponse
    {
        return HTTPResponse::create(json_encode(false), 400)->addHeader('Content-Type', 'application/json');
    }

    /**
     * Handle notification received after upload success, error or completion
     * By default fields do not support notify, child fields should support this
     */
    public function notify(HTTPRequest $request): HTTPResponse
    {
        return HTTPResponse::create(json_encode(false), 400)->addHeader('Content-Type', 'application/json');
    }

    /**
     * Save the file somewhere, based on configuraton
     * @throws InvalidFileException|Exception
     */
    private function saveFile(array $file_upload, string $uuid, string $form_security_token_value): File
    {

        // Set allowed max file size
        $this->getValidator()->setAllowedMaxFileSize($this->lib_config['validation']['sizeLimit']);

        // TODO set max allowed file number (need this particular file upload to know how many siblings exist)

        // This will call loadIntoFile which triggers onAfterUpload()
        $file = $this->saveTemporaryFile($file_upload, $error);
        if ($error !== null && $error !== '') {
            // log this error
            Logger::log("File upload failed with error:" . $error, "INFO");
            throw new InvalidFileException(_t(
                'DamnFineUploader.FILE_COULD_NOT_BE_SAVED_INVALID_FILE',
                'Sorry, the file could not be saved'
            ));
        }

        if (!$file || !($file instanceof File)) {
            // log this error
            Logger::log("Invalid file instance returned on upload attempt", "INFO");
            throw new InvalidFileException(_t(
                'DamnFineUploader.FILE_COULD_NOT_BE_SAVED_INVALID_FILE',
                'Sorry, the file could not be saved'
            ));
        }

        // Ensure the file is not in a published state
        $file->doUnPublish();
        // Save the token, together with the Form Security ID for the form used to upload the file
        $file->DFU = $uuid . "|" . $form_security_token_value;
        $file->IsDfuUpload = 1;
        $file->writeToStage(Versioned::DRAFT);
        // Protect the file
        $file->protectFile();
        try {
            // generate thumbnails for the admin
            AssetAdmin::singleton()->generateThumbnails($file);
        } catch (\Exception) {
            // No-op as this is just  nice-to-have
        }

        return $file;
    }

    /**
     * Action to handle removal of a single file via its uuid.
     * It also automatically adds a _method param with a value of DELETE, triggering {@link HTTPRequest::detect_method()} handling
     * Converting the httpMethod to DELETE, so we need to check for either a POST OR DELETE request here
     */
    public function remove(HTTPRequest $request): HTTPResponse
    {
        try {

            $allow_delete = $this->config()->get('allow_delete');
            if (!$allow_delete) {
                throw new InvalidRequestException("Cannot remove this file");
            }

            $post = $request->postVars();
            if ($request->isPOST() && empty($post)) {
                //invalid POST
                throw new InvalidRequestException("No file data provided");
            }
            if (!$request->isDELETE()) {
                // fallback expect a DELETE
                throw new InvalidRequestException("Invalid removal request received");
            }

            // Get form security token
            $form_security_token = $this->getSecurityTokenFromRequest($request);

            // Get file uniq ID sent in request
            $file_uuid = $this->getFileUuidFromRequest($request);

            //remove the file
            return $this->removeFile($file_uuid, $form_security_token);
        } catch (MissingDataException|InvalidRequestException|FileRemovalException $e) {
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
    final protected function removeFile(string $uuid, string $form_security_token): HTTPResponse
    {
        $record = FileRetriever::getFile($uuid, $form_security_token);
        $record_id = null;
        if (($record instanceof File) && !empty($record->ID)) {
            $record_id = $record->ID;
            $record->doArchive();
        } else {
            // the file isn't here
            throw new FileRemovalException("The file could not be deleted");
        }

        $check = File::get()->byId($record_id);
        if (!empty($check->ID)) {
            // file was still found.. archive failed
            throw new FileRemovalException("The file could not be deleted");
        }

        return $this->removeSuccessResponse();
    }


    /**
     * Return a Relative upload link for this field
     */
    public function UploadLink(): string
    {
        return Controller::join_links('field/' . $this->name, 'upload');
    }

    /**
     * Return a Relative notification link for this field
     */
    public function NotificationLink(): string
    {
        return Controller::join_links('field/' . $this->name, 'notify');
    }

    /**
     * Return a Relative presign link for this field
     * Per-file requests are sent to this URL and it should return a presigned URL
     * for the specific file
     *
     * This link is only useful for uploaders that need to get a presigned url per file
     * via the presign() handler
     */
    public function PresignLink(): string
    {
        return Controller::join_links('field/' . $this->name, 'presign');
    }

    /**
     * Return a Relative remove link for this field (for remove file actions)
     */
    public function RemoveLink(): string
    {
        return Controller::join_links('field/' . $this->name, 'remove');
    }

    /**
     * setUseDateFolder - triggers the upload folder to be date based
     */
    final public function setUseDateFolder(bool $use = true): self
    {
        $this->use_date_folder = $use;
        return $this;
    }

    /**
     * Based on the implementation, set library requirements and the template to use
     * @note called by self::Field()
     */
    final protected function libraryRequirements(): void
    {
        $this->setRequirements();
        $this->initFieldConfig();
    }

    /**
     * initialise the field configuration and set a default,sane config specification
     * @param bool $force set to true to override any current config and re-init
     */
    final public function initFieldConfig(bool $force = false): void
    {
        if (!$this->hasDefaultConfiguration() || $force) {
            $this->setUploaderDefaultConfig();
        }
    }

    /**
     * Sets the default config from YAML configuration and applies some configuration based on this form
     */
    protected function setUploaderDefaultConfig(): self
    {
        $this->default_configuration_complete = false;

        // set default lib_config from yml
        $lib_config = $this->config()->get('implementation');

        // element options
        $form = $this->getForm();

        // form options
        $lib_config['form'] = [];

        // messages
        $lib_config['messages'] = [
            'emptyError' => _t('DamnFineUploader.ZERO_BYTES', 'The file {file} seems to be empty'),
            'noFilesError' => _t('DamnFineUploader.NO_FILES', 'No files were submitted'),
            'fileCannotBeUploadedError' => _t('DamnFineUploader.FILE_CANNOT_BE_UPLOAD', 'This file could not be added due to a system error. Please try again later.'),
            'minSizeError' => _t('DamnFineUploader.FILE_SMALL', 'The file is too small, please upload a file larger than {minSizeLimit}'),
            'sizeError' => _t('DamnFineUploader.FILE_LARGE', 'The file is too large, please upload a file smaller than {sizeLimit}'),
            'dimensionsMismatchError' => _t('DamnFineUploader.DIMENSIONS_MISMATCH', 'The image does not match the allowed dimensions'),
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
            'method' => $this->getHttpUploadMethod(),
            'uuidName' => self::UUID_NAME,
            'endpoint' => '',// see below
            'params' => []
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
            $lib_config['request']['endpoint'] = $this->getRequestEndpoint();
            $lib_config['request']['params'][ $token->getName() ] = $token->getValue();

            // deleteFile options if allowed
            $allow_delete = $this->config()->get('allow_delete');
            if ($allow_delete) {
                $lib_config['deleteFile']['enabled'] = true;//enable when we can handle a delete
                $lib_config['deleteFile']['endpoint'] = $this->getDeleteEndpoint();
                $lib_config['deleteFile']['params'][ $token->getName() ] = $token->getValue();
            }
        }

        // fallback to default accepted file types if none set in configuration
        if (empty($lib_config['validation']['acceptFiles'])) {
            $lib_config['validation']['acceptFiles'] = $this->getDefaultAcceptedTypes();
        }

        // apply notification url, for use on completion
        $lib_config['urls'] = [
            'notificationUrl' => $this->getNotificationUrl(),
            'presignUrl' => $this->getPresignUrl()
        ];

        // merge runtime config into default config, create lib_config
        $this->lib_config = array_replace_recursive($lib_config, $this->runtime_config);

        // Sanity check on allowed types and extensions
        $this->getAcceptedTypes();

        // Sanity check on the file size limit vs system restrictions
        $system_max_file_size = $this->getSystemAllowedMaxFileSize();
        if (empty($this->lib_config['validation']['sizeLimit'])) {
            // if not yet set, use the system size
            $this->lib_config['validation']['sizeLimit'] = $system_max_file_size;
        } elseif ($system_max_file_size > 0) {
            // ensure that the size is under the system size
            $this->lib_config['validation']['sizeLimit'] = min($this->lib_config['validation']['sizeLimit'], $system_max_file_size);
        }

        // sanity checks on the minimum size limits provided
        if (isset($this->lib_config['validation']['minSizeLimit']) && isset($this->lib_config['validation']['sizeLimit']) && $this->lib_config['validation']['minSizeLimit'] > $this->lib_config['validation']['sizeLimit']) {
            $this->lib_config['validation']['minSizeLimit'] = 0;
        }

        $this->default_configuration_complete = true;

        return $this;
    }

    /**
     * Return the HTTP method for upload
     */
    public function getHttpUploadMethod(): string
    {
        return 'POST';
    }

    /**
     * This field does not return presign urls by default
     */
    public function getPresignUrl(): string
    {
        return "";
    }

    /**
     * Notifcation URL for the field
     */
    public function getNotificationUrl(): string
    {
        $link = "";
        if ($this->supportsNotifications) {
            $action = $this->getForm()->FormAction();
            $link = Controller::join_links($action, $this->NotificationLink());
        }

        return $link;
    }

    /**
     * Checks whether lib_config is present and complete
     */
    public function hasDefaultConfiguration(): bool
    {
        return $this->lib_config !== [] && $this->default_configuration_complete;
    }

    /**
     * Set a Form Security Token on config
     */
    public function setSecurityToken(SecurityToken $token): self
    {
        $this->runtime_config['request']['params'][ $token->getName() ] = $token->getValue();
        return $this;
    }

    /**
     * Set a request endpoint (absolute or relative URL only) or reset based on the field's form (if available)
     * If you set a custom endpoint for uploads, you will need to handle the upload appropriately and return the expected result
     * When using this method other request options are sourced from {@link self::setUploaderDefaultConfig()}
     * To set custom request options see {@link self::setOptionRequest()}
     */
    public function setRequestEndpoint(string $endpoint): self
    {
        $this->runtime_config['request']['endpoint'] = $endpoint;
        return $this;
    }

    /**
     * Get the request endpoint for uploads
     */
    public function getRequestEndpoint(): string
    {
        if (!empty($this->runtime_config['request']['endpoint'])) {
            return $this->runtime_config['request']['endpoint'];
        }
        $action = $this->getForm()->FormAction();
        return Controller::join_links($action, $this->UploadLink());
    }

    /**
     * Set a delete endpoint (absolute or relative URL only) or reset based on the field's form (if available)
     * When using this method other deleteFile options are sourced from {@link self::setUploaderDefaultConfig()}
     * To set custom deleteFile options see {@link self::setOptionDelete()}
     */
    public function setDeleteEndpoint(string $endpoint): self
    {
        $this->runtime_config['deleteFile']['endpoint'] = $endpoint;
        return $this;
    }

    /**
     * Get the DELETE endpoint for uploads
     * @return string the path to the upload endpoint
     */
    public function getDeleteEndpoint(): string
    {
        if (!empty($this->runtime_config['deleteFile']['endpoint'])) {
            return $this->runtime_config['deleteFile']['endpoint'];
        }
        $action = $this->getForm()->FormAction();
        return Controller::join_links($action, $this->RemoveLink());
    }

    /**
     * Provide custom request endpoint configuration
     */
    public function setOptionRequest(array $request): self
    {
        $this->runtime_config['request'] = $request;
        return $this;
    }

    /**
     * Provide custom deleteFile options
     * This requires your own delete implementation with checks and balances
     */
    public function setOptionDelete(array $delete): self
    {
        $this->runtime_config['deleteFile'] = $delete;
        return $this;
    }

    /**
     * Get a single value from config, this populates lib_config if it is not already created
     */
    public function getUploaderConfigValue($category, $key): mixed
    {
        if (!$this->hasDefaultConfiguration()) {
            $this->setUploaderDefaultConfig();
        }

        return $this->lib_config[$category][$key] ?? null;
    }

    /**
     * Return all library configuration
     */
    public function getUploaderConfig(): array
    {
        return $this->lib_config;
    }

    /**
     * Provide runtime config to be merged into lib_config
     */
    public function setConfig(array $config): self
    {
        $this->runtime_config = $config;
        return $this;
    }

    /**
     * Filter the provided types - types without a period are given one
     * types in the denied types and mimetypes configuration are removed
     */
    public function filterTypes(array $types): array
    {
        // ensure that types without a period get one
        array_walk(
            $types,
            function (&$value, $key): void {
                $value = trim($value);
                if ($value !== "" && !str_contains($value, ".") && !str_contains($value, "/")) {
                    $value = ".{$value}";
                }
            }
        );
        // Remove denied types
        $denied = array_merge(
            $this->config()->get('denied_mimetypes'),
            $this->config()->get('denied_types')
        );
        if ($denied !== []) {
            // returns values in $types that are not in the list of denied types
            $types = array_diff($types, $denied);
        }

        return array_values(array_unique(array_filter($types)));
    }

    /**
     * Set accepted types for this file upload, extensions are determined based on the types provided
     *
     * If called, this is merged into the lib_config during setUploaderDefaultConfig()
     *
     * The allowed types are set in the format specified by https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers:
     *
     *      + A valid case-insensitive filename extension, starting with a period (".") character. For example: .jpg, .pdf, or .doc.
     *      + A valid MIME type string, with no extensions. (image/png)
     *      + The string video/* meaning "any video file" (substitute video for the category)
     *
     * For compatibility with other Silverstripe uploaders, the extension e.g "png" is allowed and will be set as .png
     *
     * Extensions are automatically determined based on the types provided
     */
    public function setAcceptedTypes(array $types): self
    {
        if (count($types) === 0) {
            // cannot set empty types
            return $this;
        }

        $types = $this->filterTypes($types);
        // ensure the type array is
        $this->runtime_config['validation']['acceptFiles'] = implode(",", $types);
        // based on filtered types, set allowed extensions
        $this->runtime_config['validation']['allowedExtensions'] = $this->getExtensionsForTypes($types);
        // set allowed extensions on the validator via  UploadReceiver trait
        $this->setAllowedExtensions($this->runtime_config['validation']['allowedExtensions']);
        return $this;
    }

    /**
     * Return the accepted types in configuration, set by setAcceptedTypes
     * This should be called after setUploaderDefaultConfig() is processed
     */
    public function getAcceptedTypes(): array
    {
        $acceptFiles = $this->lib_config['validation']['acceptFiles'];
        // configuration is provided as a string
        $acceptedTypes = [];
        if (is_string($acceptFiles)) {
            $acceptedTypes = array_filter(explode(",", $acceptFiles));
        }

        if (count($acceptedTypes) === 0) {
            $acceptedTypes = explode(",", $this->getDefaultAcceptedTypes());
        }

        // @var array
        $acceptedTypes = $this->filterTypes($acceptedTypes);
        $this->lib_config['validation']['acceptFiles'] = implode(",", $acceptedTypes);
        $this->lib_config['validation']['allowedExtensions'] = $this->getExtensionsForTypes($acceptedTypes);
        return $acceptedTypes;
    }

    /**
     * Return the default accepted types
     */
    public function getDefaultAcceptedTypes(): string
    {
        return $this->default_accepted_types;
    }

    /**
     * Returns the system provided max file size, in bytes
     */
    public function getSystemAllowedMaxFileSize(): int
    {
        return (int)$this->getValidator()->getAllowedMaxFileSize();
    }

    /**
     * Set the maximum allowed filesize, in bytes
     * Note that if the system setting is lower, that will be used
     */
    public function setAllowedMaxFileSize(int $bytes): self
    {
        $system = $this->getSystemAllowedMaxFileSize();
        $limit = $system > 0 ? min($bytes, $system) : $bytes;

        $this->runtime_config['validation']['sizeLimit'] = round($limit);

        return $this;
    }

    /**
     * This method is provided for consistency
     */
    public function setAcceptedMaxFileSize(int $bytes): self
    {
        return $this->setAllowedMaxFileSize($bytes);
    }

    /**
     * setAcceptedMinFileSize - set the minimum upload file size
     * Worth noting that you can provide a minSizeLimit > the sizeLimit here, in which case the minSizeLimit will be reset to 0
     * @param int $size bytes
     */
    public function setAcceptedMinFileSize(int $size): self
    {
        $this->runtime_config['validation']['minSizeLimit'] = $size;// bytes
        return $this;
    }

    public function setAllowedMaxItemLimit(int $limit): self
    {
        $this->runtime_config['validation']['itemLimit'] = $limit;
        return $this;
    }

    /**
     * Set max dimensions for image uploads
     */
    public function setAcceptedMaxDimensions(int $width, int $height): self
    {
        $this->runtime_config['validation']['image']['maxHeight'] = $height;
        $this->runtime_config['validation']['image']['maxWidth'] = $width;
        return $this;
    }

    /**
     * Set min dimensions for image uploads
     */
    public function setAcceptedMinDimensions(int $width, int $height)
    {
        $this->runtime_config['validation']['image']['minHeight'] = $height;
        $this->runtime_config['validation']['image']['minWidth'] = $width;
        return $this;
    }

    /**
     * Return a list of extensions matching the file types provided
     * The types provided can be extensions (with or without prefix .), or a mimetype
     * @param array $types example: [ 'png', '.png', 'image.png', 'image/*' ]
     */
    final public function getExtensionsForTypes(array $types): array
    {
        $mimeTypes = HTTP::config()->uninherited('MimeTypes');
        $extensions = [];
        foreach ($types as $type) {
            if (in_array(str_contains((string) $type, "."), [0, false], true) && !str_contains((string) $type, "/")) {
                // e.g "png"
                $extensions[] = $type;
            } elseif (str_starts_with((string) $type, ".")) {
                // e.g ".png" - add the standard extension, without the .
                $extensions[] = substr((string) $type, 1);
            } else {
                $parts = explode("/", (string) $type);
                $filtered = array_filter(
                    $mimeTypes,
                    function ($mimeType, $extension) use ($type, $parts): bool {
                        if ($mimeType == $type) {
                            // exact mimetype match
                            return true;
                        }
                        if (count($parts) === 2 && $parts[1] == "*") {
                            // that the mimetype (image/png) starts with image/
                            return  str_starts_with($mimeType, $parts[0] . "/");
                        }
                        return false;
                    },
                    ARRAY_FILTER_USE_BOTH
                );
                if ($filtered !== []) {
                    $extensions = array_merge($extensions, array_keys($filtered));
                }
            }
        }

        // return extensions with empty values removed
        $extensions = array_filter($extensions);
        sort($extensions);
        return $extensions;
    }

    /**
     * AcceptedExtensions - a template helper method
     */
    public function AcceptedExtensions(): string
    {
        $extensions = $this->getExtensionsForTypes($this->getAcceptedTypes());
        return implode(", ", $extensions);
    }

    /**
     * AcceptedFileSize - a template helper method to return allowed file size in MB
     * @see getUploaderConfig
     */
    public function AcceptedFileSize($round = 1): float
    {
        $size = (int)$this->lib_config['validation']['sizeLimit'];// bytes
        $mb = round($size / 1048576, $round);// allow for displaying< 1 MB uploads
        return $mb;
    }

    /**
     * AcceptedMinFileSize - a template helper method to return minimkum file size in MB
     * @see getUploaderConfig
     */
    public function AcceptedMinFileSize($round = 1): float
    {
        $size = (int)$this->lib_config['validation']['minSizeLimit'];// bytes
        $mb = round($size / 1048576, $round);// allow for displaying < 1 MB uploads
        return $mb;
    }

    /**
     * AcceptedItemLimit - a template helper method
     */
    public function AcceptedItemLimit(): int
    {
        return $this->lib_config['validation']['itemLimit'];
    }

    /**
     * AcceptedMaxWidth - a template helper method
     */
    public function AcceptedMaxWidth(): ?int
    {
        if (isset($this->lib_config['validation']['image']['maxWidth'])) {
            return (int)$this->lib_config['validation']['image']['maxWidth'];
        }
        return null;
    }

    /**
     * AcceptedMaxHeight - a template helper method
     */
    public function AcceptedMaxHeight(): ?int
    {
        if (isset($this->lib_config['validation']['image']['maxHeight'])) {
            return (int)$this->lib_config['validation']['image']['maxHeight'];
        }
        return null;
    }

    public function AcceptedMaxDimensions(): string
    {
        if (($width = $this->AcceptedMaxWidth()) && ($height = $this->AcceptedMaxHeight())) {
            return $width . "×" . $height;
        }
        return "";
    }

    /**
     * AcceptedMinWidth - a template helper method
     */
    public function AcceptedMinWidth(): ?int
    {
        if (isset($this->lib_config['validation']['image']['minWidth'])) {
            return (int)$this->lib_config['validation']['image']['minWidth'];
        }
        return null;
    }

    /**
     * AcceptedMinHeight - a template helper method
     */
    public function AcceptedMinHeight(): ?int
    {
        if (isset($this->lib_config['validation']['image']['minHeight'])) {
            return (int)$this->lib_config['validation']['image']['minHeight'];
        }
        return null;
    }

    public function AcceptedMinDimensions(): string
    {
        if (($width = $this->AcceptedMinWidth()) && ($height = $this->AcceptedMinHeight())) {
            return $width . "×" . $height;
        }
        return "";
    }

    /**
     * Test accepted mimetypes for an image/* value or extensions if they are
     * in a supported image category
     */
    public function AcceptsImages(): bool
    {
        // Check accepted types first
        $types = $this->getAcceptedTypes();
        foreach ($types as $type) {
            if (str_starts_with((string) $type, "image/")) {
                return true;
            }
        }

        // Check types for extensions against categories
        $categoryExtensions = File::get_category_extensions(['image', 'image/supported']);
        $allowedExtensions =  $this->getAllowedExtensions();
        $diff = array_intersect($categoryExtensions, $allowedExtensions);
        return $diff !== [];
    }

    public function Field($properties = [])
    {
        $this->libraryRequirements();
        return parent::Field($properties);
    }


    public function FieldHolder($properties = [])
    {
        return parent::FieldHolder($properties);
    }

    /**
     * The Small Field Holder is the large holder
     */
    public function SmallFieldHolder($properties = [])
    {
        return parent::FieldHolder($properties);
    }

    /**
     * @note provided an extension, get a mime type from SS mimetypes map
     * @param string $ext e.g jpg html - without the .
     */
    protected function getMimeTypeFromExtension($ext): string
    {
        $mimeTypes = Config::inst()->get('HTTP', 'MimeTypes');
        // The mime type doesn't exist
        if (!isset($mimeTypes[$ext])) {
            return 'application/unknown';
        }
        return $mimeTypes[$ext];
    }

    /**
     * @note split out mimetype into type and subtype
     */
    final protected function parseMimeType(string $mimetype): ?array
    {
        $parsed = null;
        if (str_contains($mimetype, "/")) {
            $parts = explode('/', $mimetype);
            $parsed = [
                'type' => $parts[0],
                'subtype' => $parts[1],
            ];
        }

        return $parsed;
    }

    /**
     * @param string $tmp_path the path from the particular upload in $_FILES
     */
    final protected function isUploadedFile(string $tmp_path): bool
    {
        return is_uploaded_file($tmp_path);
    }

    /**
     * @note provided a path to an uploaded file, check that it matches configuration prior to saving
     * The return value is an array with keys 'valid' being a boolean and 'mimetype' being the detected file mimetype
     * @throws \Exception
     */
    protected function checkUploadedFile(array $tmp_file): array
    {
        // Check if tmp_name is an uploaded file
        if (!$this->isUploadedFile($tmp_file['tmp_name'])) {
            throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_NOT_AN_UPLOAD', 'The upload could not be saved'));
        }

        // use the Upload class to validate using the MimeUploadValidator
        $valid = $this->getUpload()->validate($tmp_file);
        $file_path = $tmp_file['tmp_name'] ?? '';
        if (!$file_path) {
            throw new InvalidFileException(_t('DamnFineUploader.TMP_FILE_NOT_FOUND', 'Sorry, the file could not be read'));
        }

        // get file info using finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimetype = $finfo->file($file_path);

        // check for a denied mimetype in this uploader's configuration
        $is_denied = $this->isDeniedMimeType($mimetype);
        if ($is_denied) {
            $valid = false;
        }

        return [
            'valid' => $valid,
            'mimetype' => $mimetype
        ];
    }

    /**
     * Given a mimetpye, check if configuration denies it
     */
    public function isDeniedMimeType(string $mimetype): bool
    {
        // fallback - check denied mimetypes
        $is_denied = false;
        $denied = $this->config()->get('denied_mimetypes');
        if (!empty($denied) && is_array($denied)) {
            return in_array($mimetype, $denied);
        }

        return $is_denied;
    }

    /**
     * Validate the upload request
     * On success, returns an HTTPResponse matching the libraries expected 'Upload OK' result
     * On failure, returns boolean false or throws an \Exception
     * @throws InvalidRequestException
     * @throws \Exception
     */
    public function validateUpload(MimeUploadValidator $validator): ?HTTPResponse
    {

        $request = $this->getRequest();

        // set default file uploaded (empty)
        $file_upload = [];

        // get field config
        $this->initFieldConfig();

        // grab post vars from request
        $post = $request->postVars();

        // initial check on request
        if (!$request->isPOST()) {
            throw new InvalidRequestException("No file data provided");
        }

        if (empty($post)) {
            throw new InvalidRequestException("No file data provided");
        }

        // Get form security token
        $form_security_token_value = $this->getSecurityTokenFromRequest($request);

        // Get file uniq ID sent in request
        $file_uuid = $this->getFileUuidFromRequest($request);

        // Get the uploaded file
        $file_upload = $this->getFileFromRequest();

        // Do we have a file tmp_name ?
        if (empty($file_upload['tmp_name'])) {
            throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_MISSING_FILES', 'Required data not received'));
        }

        // set allowed extensions for the MimeUploadValidator
        $this->setAllowedExtensions($this->getExtensionsForTypes($this->getAcceptedTypes()));

        // set default folder name, if not set
        if (!$this->folderName) {
            $this->setFolderName(Upload::config()->get('uploads_folder'));
        }

        // Using date based sub directories
        if ($this->use_date_folder) {
            // Handle data based folder name, if no specific folder name already set
            $date_part = date('Y/m/d');
            $this->setFolderName(rtrim($this->folderName, "/") . "/{$date_part}/");
        } else {
            $this->setFolderName($this->folderName);
        }

        // Check the tmp file against allowed mimetypes  - e.g file/bad being uploaded as file.good
        $result = $this->checkUploadedFile($file_upload);
        if (!$result['valid']) {
            $mimetype = empty($result['mimetype']) ? 'unknown' : $result['mimetype'];
            throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_NOT_ACCEPTED_FILE', 'The file uploaded could not be accepted as it is a {invalidFileType} file, please try again with a different file', ['invalidFileType' => $mimetype]));
        }

        // create the file UUID for this file, sent back in the request
        $uuid = $this->getUuid($file_uuid);

        // save it
        $this->saveFile($file_upload, $uuid, $form_security_token_value);

        return $this->uploadSuccessfulResponse($file_upload, $uuid);

    }

    /**
     * Sign the file token sent by the frontend library in the request
     * @param string $uuid provided by the uploader library
     */
    protected static function sign_uuid(string $uuid): string
    {
        $key = Config::inst()->get(DamnFineUploaderField::class, 'signing_key');
        if (empty($key)) {
            throw new Exception("No signing key is set in configuration");
        }

        $salt = bin2hex(random_bytes(16));
        return hash_hmac("sha256", $uuid . $salt, (string) $key, false);
    }

    /**
     * @returns string the value returned as newUuid to the client uploader
     */
    protected function getUuid(string $uuid): string
    {
        if ($uuid === '') {
            throw new InvalidRequestException(_t('DamnFineUploader.UPLOAD_MISSING_UUID', 'Required data not received'));
        }

        return self::sign_uuid($uuid);
    }

    /**
     * Return how oversize a value is based on the configured size limit
     * @param int $in bytes
     */
    public function overSize($in): int|float
    {
        $check = $this->lib_config['validation']['sizeLimit'];
        if ($check == 0) {
            return 0;
        }

        return round(($in / $check), 2);
    }
}
