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
use Exception;
use finfo;

/**
 * @note Provides a field to handle FineUploader uploads. FineUploade
 *			FineUploader can either attach to this field's form, or not
 *			By default the module ships with FineUpload attaching to this field's containing form, this is done to get file data submitting with the form submission
 *			You can enable a standalone drag-drop style interface by setting autoUpload to true, file submissions will then be directed through this field's upload method
 *			Read More: https://docs.fineuploader.com/branch/master/features/forms.html
 */
class FineUploaderCoreField extends FormField implements FileHandleField {

	use FileUploadReceiver;

	const IMPLEMENTATION_TRADITIONAL_CORE = 'traditionalcore';
	const IMPLEMENTATION_TRADITIONAL_UI = 'traditionalui';
	const UUID_NAME = 'dfu_uuid';

	protected $lib_config;//fineuploader configuration
	protected $option_delete, $option_request = [];//custom request/delete settings
	protected $default_accepted_types = ['image/jpg','image/gif','image/webp','image/jpeg'];// default to images for now
	protected $use_date_folder = true;
	protected $implementation = self::IMPLEMENTATION_TRADITIONAL_CORE;

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

	/**
	 * @config
	 * @var array
	 */
	private static $allowed_actions = [
			'upload',
			'remove'
	];

	public function __construct($name, $title = null, $value = null) {
		$this->constructFileUploadReceiver();
		// When creating new files, rename on conflict
		$this->getUpload()->setReplaceFile(false);

		parent::__construct($name, $title, $value);
	}

	/**
	 * Return a Relative upload link for this field
	 *
	 * @param string $action
	 *
	 * @return string
	 */
	public function UploadLink() {
			return Controller::join_links('field/' . $this->name, 'upload');
	}

	/**
	 * setUseDateFolder - triggers the upload folder to be date based
	 */
	public function setUseDateFolder($use = true) {
		$this->use_date_folder = $use;
		return $this;
	}

	protected function setRequirements() {
		Requirements::set_force_js_to_bottom(true);
		Requirements::javascript('codem/silverstripe-damn-fine-uploader: client/dist/js/core.js');
		Requirements::css('codem/silverstripe-damn-fine-uploader: client/dist/styles/core.css');
	}

	/**
	 * Based on the implementation, set library requirements and the template to use
	 */
	protected function libraryRequirements() {
		$this->setRequirements();
		$this->initFieldConfig();
	}

	/**
	 * initialise the field configuration and set a default,sane config specification
	 * acceptFiles is a list of mimetypes, not file extensions: https://docs.fineuploader.com/branch/master/api/options.html#validation.acceptFiles
	 * @param boolean $force set to true to override any current config and re-init
	 */
	public function initFieldConfig($force = false) {
		if(!$this->lib_config || $force) {
			$this->setUploaderDefaultConfig();
		}
		if(empty($this->lib_config['validation']['acceptFiles'])) {
			// if these haven't been set, set default types
			$this->setAcceptedTypes( $this->default_accepted_types );
		}
	}

	/**
	 * Sets the current implementation
	 */
	public function setImplementation($implementation) {
		$this->implementation = $implementation;
		return $this;
	}

	/**
	 * Returns the current implementation or self::IMPLEMENTATION_TRADITIONAL_CORE if not set/handled
	 */
	public function getImplementation() {
		return self::IMPLEMENTATION_TRADITIONAL_CORE;
	}

	/**
	 * Sets the default config from YAML configuration and applies some configuration based on this form
	 */
	protected function setUploaderDefaultConfig() {
		// set default lib_config from yml
		$this->lib_config = $this->config()->fineuploader;
		// element options
		$form = $this->getForm();
		//$this->lib_config['element'] = (string)($form ? $form->getHTMLID() : "");// the containing form id attribute
		//$this->lib_config['autoUpload'] = false;// do not auto upload by default

		// form options
		$this->lib_config['form'] = [];
		//$this->lib_config['form']['autoUpload'] = false;// do not auto upload by default

		// messages
		$this->lib_config['messages'] = [
			'emptyError' => _t('DamnFineUploader.ZERO_BYTES', 'The file {file} seems to be empty'),
			'noFilesError' => _t('DamnFineUploader.NO_FILES', 'No files were submitted'),
			'minSizeError' => _t('DamnFineUploader.FILE_SMALL', 'The file is too small, please upload a file larger than {minSizeLimit}'),
			'sizeError' => _t('DamnFineUploader.FILE_LARGE', 'The file is too large, please upload a file smaller than {sizeLimit}'),
			'maxHeightImageError' => _t('DamnFineUploader.IMAGE_TALL', 'The image height is greater than the maximum allowed height'),
			'maxWidthImageError' => _t('DamnFineUploader.IMAGE_SHORT', 'The image height is smaller than the minimum allowed height'),
			'minHeightImageError' => _t('DamnFineUploader.IMAGE_WIDE', 'The image width is greater than the maximum allowed width'),
			'minWidthImageError' => _t('DamnFineUploader.IMAGE_NARROW', 'The image width is smaller than the minimum allowed width'),
			'tooManyItemsError' => _t('DamnFineUploader.MAX_ITEMS', 'The maximum number of items ({itemLimit}) has been reached'),
			'typeError' => _t('DamnFineUploader.TYPE_ERROR', '{file} has an invalid extension. Valid extension(s): {extensions}'),
		];

		// text
		$this->lib_config['text'] = [
			'defaultResponseError' => _t('DamnFineUploader.GENERAL_ERROR', 'The upload failed due to an unknown reason')
		];

		// request endpoint
		$this->lib_config['request'] = [
			'method' => 'POST',
			'uuidName' => self::UUID_NAME,
			'requireSuccessJson' => true,
			'endpoint' => '',// see below
			'params' => [],
			'paramsInBody' => true // sends request parameters in the body of the upload request
		];

		// default deleteFile configuration
		// some options are set in config.yml
		$this->lib_config['deleteFile']['enabled'] = false;//off by default, see below
		$this->lib_config['deleteFile']['endpoint'] = '';//see below
		$this->lib_config['deleteFile']['method'] = 'POST';//enforce POST
		$this->lib_config['deleteFile']['params'] = [];// see below

		/**
		 * This configuration requires the field to have a form attached,
		 * which is not always the case e.g userform module where the
		 * form is only attached after the field {@link SilverStripe\UserForms\Form\UserForm::__construct()}
		 */
		if($form instanceof Form) {
			// The configuration options require a form with a Security Token
			$token = $form->getSecurityToken();
			if(!$token || $token instanceof NullSecurityToken) {
				$form->enableSecurityToken();
			}

			// request options
			$this->lib_config['request']['endpoint'] = $this->Link('upload');
			$this->lib_config['request']['params'][ $token->getName() ] = $token->getValue();

			// deleteFile options if allowed
			$allow_delete = $this->config()->allow_delete;
			if($allow_delete) {
				$this->lib_config['deleteFile']['enabled'] = true;//enable when we can handle a delete
				$this->lib_config['deleteFile']['endpoint'] = $this->Link('remove');
				$this->lib_config['deleteFile']['params'][ $token->getName() ] = $token->getValue();
			}
		}

	}

	/**
	 * Set a Form Security Token on config
	 * @param SecurityToken $token
	 */
	public function setSecurityToken(SecurityToken $token) {
		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}
		$this->lib_config['request']['params'][ $token->getName() ] = $token->getValue();
	}

	/**
	 * Set a request endpoint (absolute or relative URL only) or reset based on the field's form (if available)
	 * When using this method other request options are sourced from {@link self::setUploaderDefaultConfig()}
	 * To set custom request options see {@link self::setOptionRequest()}
	 */
	public function setRequestEndpoint($endpoint = "") {
		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}
		if($endpoint) {
			$this->lib_config['request']['endpoint'] = $endpoint;
		} else if ($form = $this->getForm()) {
			$this->lib_config['request']['endpoint'] = $this->Link('upload');
		}
	}

	/**
	 * Set a delete endpoint (absolute or relative URL only) or reset based on the field's form (if available)
	 * When using this method other deleteFile options are sourced from {@link self::setUploaderDefaultConfig()}
	 * To set custom deleteFile options see {@link self::setOptionDelete()}
	 */
	public function setDeleteEndpoint($endpoint = "") {
		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}
		$this->lib_config['deleteFile']['enabled'] = true;//setting an endpoint enables file uploads
		if($endpoint) {
			$this->lib_config['deleteFile']['endpoint'] = $endpoint;
		} else if ($form = $this->getForm()) {
			$this->lib_config['deleteFile']['endpoint'] = $this->Link('remove');
		}
	}

	/**
	 * Provide custom request endpoint configuration
	 * @param array $request
	 * @see https://docs.fineuploader.com/branch/master/api/options.html#request
	 */
	public function setOptionRequest(array $request) {
		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}
		$this->lib_config['request'] = $request;
		return $this;
	}

	/**
	 * Provide custom deleteFile options
	 * @see https://docs.fineuploader.com/branch/master/api/options.html#deleteFile
	 * This requires your own delete implementation with checks and balances
	 */
	public function setOptionDelete(array $delete) {
		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}
		$this->lib_config['deleteFile'] = $delete;
		return $this;
	}

	public function getUploaderConfigValue($category, $key) {
		if(isset($this->lib_config[$category][$key])) {
			return $this->lib_config[$category][$key];
		}
		return null;
	}

	public function getUploaderConfig() {
		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}
		return json_encode($this->lib_config);
	}

	/**
	 * @note override general config provided in YML, if you wish to override the endpoint, use setRequestEndpoint()
	 * @note you can set any options provided here: https://docs.fineuploader.com/branch/master/api/options.html
	 */
	public function setConfig(array $config) {
		$this->lib_config = $config;
		return $this;
	}

	/**
	 * @note set the accepted types for this form
	 */
	public function setAcceptedTypes(array $types) {
		if(!isset($this->lib_config['validation'])) {
			$this->lib_config['validation'] = [];
		}

		$this->lib_config['validation']['acceptFiles'] = implode(",", $types);// this could inckude
		$this->lib_config['validation']['allowedExtensions'] = $this->getExtensionsForTypes($types);//TODO
		return $this;
	}

	public function setAllowedMaxFileSize($bytes) {
		if(!isset($this->lib_config['validation'])) {
			$this->lib_config['validation'] = [];
		}
		$this->lib_config['validation']['sizeLimit'] = $bytes;
		return $this;
	}

	public function setAllowedMaxItemLimit($limit) {
		if(!isset($this->lib_config['validation'])) {
			$this->lib_config['validation'] = [];
		}
		$this->lib_config['validation']['itemLimit'] = $limit;
		return $this;
	}

	public function getAcceptedTypes() {
		$mimetypes = $this->getUploaderConfigValue('validation','acceptFiles');
		if(strpos($mimetypes, ",") !== false) {
			return explode(",", $mimetypes);
		} else {
			return [];
		}
	}

	/**
	 * @todo get a list of extensions for the types used
	 * @note this is used as a guide for frontend validation only
	 */
	final protected function getExtensionsForTypes($types) {
		$mime_types = HTTP::config()->uninherited('MimeTypes');
		$keys = [];
		foreach($types as $type) {
			$result = array_keys($mime_types, $type);
			if(is_array($result)) {
				$keys = array_merge($keys,$result);
			}
		}
		return $keys;
	}

	public function Field($properties = array()) {
		$this->libraryRequirements();
		return parent::Field($properties);
	}


	public function FieldHolder($properties = array ()) {
			return parent::FieldHolder($properties);
	}

	/**
	 * The Small Field Holder is the large holder
	 */
	public function SmallFieldHolder($properties = array ()) {
			return parent::FieldHolder($properties);
	}

	/**
	 * @note provided an extension, get a mime type from SS mimetypes map
	 * @param string $ext e.g jpg html - without the .
	 */
	protected function getMimeTypeFromExtension($ext) {
		$mimeTypes = Config::inst()->get('HTTP', 'MimeTypes');
		// The mime type doesn't exist
		if(!isset($mimeTypes[$ext])) {
			return 'application/unknown';
		} else {
			return $mimeTypes[$ext];
		}
	}

	/**
	 * @note split out mimetype into type and subtype
	 */
	final protected function parseMimeType($mimetype) {
		$parsed = false;
		if(strpos($mimetype, "/") !== false) {
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
	protected function isAccepted($mimetype) {
		$valid = false;
		$types = $this->getAcceptedTypes();//returns a mix of accept options configured for the input element
		if(empty($types)) {
			throw new \Exception("No accepted mime types have been configured");
		}
		$mimetype_parts = $this->parseMimeType($mimetype);

		foreach($types as $type) {
			$type_parts = $this->parseMimeType($type);
			if($type_parts) {
				if($type_parts['subtype'] == "*") {
					// e.g image/* (HTML5)  image == image
					$valid = ($type_parts['type'] == $mimetype_parts['type']);
				} else {
					// match on both
					// A valid MIME type with no extensions.
					// e.g image/jpg == image/jpg
					$valid = ($type_parts['type'] == $mimetype_parts['type'] && $type_parts['subtype'] == $mimetype_parts['subtype']);
				}
			} else if( $result = preg_match("/^\.([a-zA-Z0-9]+)/", $type, $matches ) ) {
				// A file extension starting with the STOP character (U+002E). (e.g. .jpg, .png, .doc)
				if(!empty($matches[1])) {
					$type = $this->getMimeTypeFromExtension($matches[1]);
					if(strpos($type, "/") !== false) {
						// ensure we don't recurse
						$valid = $this->isAccepted($type);
					}
				}
			} else {
				// unhandled
				continue;
			}

			if($valid) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param string $tmp_path the path from $_FILES
	 */
	final protected function isUploadedFile($tmp_path) {
		return is_uploaded_file($tmp_path);
	}

	/**
	 * @note provided a path to an uploaded file, check that it matches configuration prior to saving
	 */
	protected function checkUploadedFile($tmp_file) {
		$file_path = isset($tmp_file['tmp_name']) ? $tmp_file['tmp_name'] : '';
		if(!$file_path) {
			throw new InvalidFileException( _t('DamnFineUploader.TMP_FILE_NOT_FOUND', 'Sorry, the file could not be read' ));
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
	public function validate($validator) {
			return true;
	}

	/**
	 * Sign the UUID provided by FineUploader, using a key,
	 * @todo create a per upload random salt to deal with collisions on retry
	 * @param string $uuid provided by Fine Uploader
	 * @returns string
	 */
	public static function sign_uuid($uuid, $form_security_token) {
		$key = Config::inst()->get('Codem\DamnFineUploader\FineUploaderCoreField','signing_key');
		if(empty($key)) {
			throw new \Exception("Cannot get file by token if no signing key is set");
		}
		$token = hash_hmac ( "sha256" , $uuid . $form_security_token, $key, false );
		return $token;
	}

	/**
	 * @returns string the value returned as newUuid to the client uploader
	 */
	protected function getUuid($uuid, $form_security_token) {
		$token = self::sign_uuid($uuid, $form_security_token);
		return $token;
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
	 * @param SilverStripe\Control\HTTPRequest $request
	 * @return SilverStripe\Control\HTTPResponse
	 */
	public function upload(HTTPRequest $request) {
		try {
			$post = $request->postVars();
			if(empty($post) || !$request->isPOST()) {
				throw new InvalidRequestException("No file data provided");
			}

			$form = $this->getForm();
			$token = $form->getSecurityToken();
			// CSRF check
			if (!$token || !$token->checkRequest($request)) {
					throw new Exception("SecurityToken is not valid");
			}
			$form_security_token_name = $token->getName();
			if(empty($post[ $form_security_token_name ])) {
				throw new MissingDataException( _t('DamnFineUploader.UPLOAD_MISSING_SECURITY_TOKEN', "The upload request is missing required information") );
			}

			if(empty($post[ self::UUID_NAME ])) {
				throw new InvalidRequestException( _t('DamnFineUploader.UPLOAD_MISSING_UUID', 'Required data not received') );
			}

			// qqfile is populated from $_FILES['qqfile']
			if(empty($post['qqfile']['tmp_name'])) {
				throw new InvalidRequestException( _t('DamnFineUploader.UPLOAD_MISSING_FILES', 'Required data not received') );
			}

			if(!$this->isUploadedFile($post['qqfile']['tmp_name'])) {
				throw new InvalidRequestException( _t('DamnFineUploader.UPLOAD_NOT_AN_UPLOAD', 'The upload could not be saved') );
			}

			// get field config
			$this->initFieldConfig();

			// check the tmp file against allowed mimetypes  - e.g file/bad being uploaded as file.good
			$result = $this->checkUploadedFile($post['qqfile']);
			if(!$result['valid']) {
				$mimetype = !empty($result['mimetype']) ? $result['mimetype'] : 'unknown';
				throw new InvalidRequestException( sprintf(
																							_t('DamnFineUploader.UPLOAD_NOT_ACCEPTED_FILE',
																							'The file uploaded could not be accepted as it is a %s file, please try again with a different file'),
																							$mimetype
																					));
			}

			// create the file UUID token for FineUploader
			$form_security_token = $post[ $form_security_token_name ];
			$uuid = $this->getUuid($post[ self::UUID_NAME ], $form_security_token);

			// Config options for this upload

			// set allowed extensions for the upload validator
			$this->setAllowedExtensions( $this->lib_config['validation']['allowedExtensions'] );


			if(!$this->folderName) {
				$this->setFolderName( Upload::config()->uploads_folder );
			}

			if($this->use_date_folder) {
				// Handle data based folder name, if no specific folder name already set
				$date_part = date('Y/m/d');
				$this->setFolderName( $this->folderName . "/{$date_part}/" );
			} else {
				$this->setFolderName( $this->folderName );
			}

			// Set allowed max file size
			$this->getValidator()->setAllowedMaxFileSize($this->lib_config['validation']['sizeLimit']);

			// TODO set max allowed file number (need this particular file uplooad to know how many siblings exist)
			// This will call loadIntoFile which triggers onAfterUpload()
			$file = $this->saveTemporaryFile($post['qqfile'], $error);
			if($error) {
				throw new InvalidFileException($error);
			}

			// save the token, together with the Form Security ID for the form used to upload the file
			$file->DFU = $uuid . "|" . $form_security_token;
			$file->write();

			if($this->config()->unpublish_after_upload) {
				$file->doUnpublish();
			}

			$result = [
				'success' => true,
				'newUuid' => $uuid
			];
			return (new HTTPResponse(json_encode($result), 200))->addHeader('Content-Type', 'application/json');

		} catch (MissingDataException $e) {
			$error = $e->getMessage();
		} catch (InvalidRequestException $e) {
			$error = $e->getMessage();
		} catch (InvalidFileException $e) {
			$error = $e->getMessage();
		} catch (Exception $e) {
			$error = "General error";
		}

		$result = [
			'success' => false,
			'error' => $error,

			'message' => [
					'type' => 'error',
					'value' => $error,
			]
		];
		$this->getUpload()->clearErrors();
		return $this->errorResponse($result, 400);
	}

	protected function errorResponse($result, $code = 400) {
		//header('Content-Type', 'application/json');print json_encode($result);exit;
		// Note that custom web server error pages may interfere with this
		return (new HTTPResponse(json_encode($result), 400))->addHeader('Content-Type', 'application/json');
	}

	/**
	 * Action to handle removal of a single file via its uuid.
	 * Fineuploader submits a POST with the file uuid and the current form security token in the body
	 * It also automatically adds a _method param with a value of DELETE, triggering {@link HTTPRequest::detect_method()} handling
	 * Converting the httpMethod to DELETE, so we need to check for either a POST OR DELETE request here
	 */
	public function remove(HTTPRequest $request) {
		try {
			$post = $request->postVars();
			if(empty($post) || (!$request->isPOST() && !$request->isDELETE() )) {
				throw new InvalidRequestException("No file data provided");
			}

			$form = $this->getForm();
			$token = $form->getSecurityToken();
			// CSRF check
			if (!$token || !$token->checkRequest($request)) {
					throw new Exception("SecurityToken is not valid");
			}
			$form_security_token_name = $token->getName();
			if(empty($post[ $form_security_token_name ])) {
				throw new MissingDataException( _t('DamnFineUploader.UPLOAD_MISSING_SECURITY_TOKEN', "The upload request is missing required information") );
			}

			if(empty($post[ self::UUID_NAME ])) {
				throw new InvalidRequestException( _t('DamnFineUploader.UPLOAD_MISSING_UUID', 'Required data not received') );
			}

			$form_security_token = $post[ $form_security_token_name ];
			return $this->removeFile($post[ self::UUID_NAME ], $form_security_token);

		} catch (MissingDataException $e) {
			$error = $e->getMessage();
		} catch (InvalidRequestException $e) {
			$error = $e->getMessage();
		} catch (FileRemovalException $e) {
			$error = $e->getMessage();
		} catch (Exception $e) {
			$error = "General error";
		}

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
	 * Remove a file based on its uuid and the form's security token
	 * You can override this handling if you wish to modify the response (e.g a 202 response)
	 */
	protected function removeFile($uuid, $form_security_token) {
		$file = singleton(File::class);
		$record = $file->getByDfuToken($uuid, $form_security_token);
		$record_id = null;
		if(($record instanceof File) && !empty($record->ID)) {
			$record_id = $record->ID;
			$record->doArchive();
		} else {
			// the file isn't here
			throw new FileRemovalException("The file {$uuid}|{$form_security_token} could not be deleted 1");
		}

		$check = DataObject::get_by_id(File::class, $record_id);
		if(!empty($check->ID)) {
			// check on the file returned a record with this id
			throw new FileRemovalException("The file could not be deleted 2");
		}

		$result = [
			'success' => true,
		];

		return (new HTTPResponse(json_encode($result), 200))->addHeader('Content-Type', 'application/json');
	}

}
