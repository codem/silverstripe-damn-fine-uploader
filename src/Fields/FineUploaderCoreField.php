<?php
namespace Codem\DamnFineUploader;
use Silverstripe\Forms\FileField;
use Silverstripe\Forms\FormField;
use SilverStripe\View\Requirements;
use SilverStripe\ORM\DataObjectInterface;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\FileUploadReceiver;
use SilverStripe\Forms\FileHandleField;
use SilverStripe\Control\HTTP;
use Exception;

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

	protected $implementation = self::IMPLEMENTATION_TRADITIONAL_CORE;

	/**
	 * @config
	 * @var array
	 */
	private static $allowed_actions = [
			'upload'
	];

	public function __construct($name, $title = null, $value = null) {
		$this->constructFileUploadReceiver();
		// When creating new files, rename on conflict
		$this->getUpload()->setReplaceFile(false);

		parent::__construct($name, $title, $value);
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

		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}

		if(!isset($this->lib_config['validation']['acceptFiles'])) {
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
		$token = $form->getSecurityToken();
		$this->lib_config['request'] = [
			'method' => 'POST',
			'uuidName' => self::UUID_NAME,
			'requireSuccessJson' => true,
			'endpoint' => $this->Link('upload'),
			'params' => [
				$token->getName() => $token->getValue()
			]
		];

	}

	/**
	 * @note allows uploads via a custom path, by default this field's path to the Upload method is used
	 * @param array $request see https://docs.fineuploader.com/branch/master/api/options.html#request
	 */
	public function setOptionRequest(array $request) {
		$this->option_request = $request;
		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}
		$this->lib_config['request'] = $request;
		return $this;
	}

	/**
	 * @note allows deletes of uploads via a custom path
	 * This requires your own delete implementation with checks and balances
	 */
	public function setOptionDelete(array $delete) {
		$this->option_delete = $delete;
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

	public function getAcceptedTypes() {
		return $this->getUploaderConfigValue('validation','acceptFiles');
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
	protected function getMimeTypeFromExt($ext) {
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
		if(strpos($type, "/") !== false) {
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
		if(!$types) {
			throw new \Exception("No accepted types have been configured");
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
					$type = $this->getMimeTypeFromExt($matches[1]);
					if(strpos($type, "/") !== false) {
						// ensure we don't recurse
						$valid = $this->isAcceptedType($type);
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
	protected function checkUploadedFile($file_path) {
		$finfo = new finfo(FILEINFO_MIME_TYPE);
		$result = $finfo->file($file_path);
		$valid = $this->isAcceptedType($result);
	}

	public function validate($validator) {

	}

	/**
	 * Sign the UUID provided by FineUploader, using a key,
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
			if(empty($post)) {
				throw new InvalidFileException("No file data provided");
			}

			if(empty($post[ self::UUID_NAME ])) {
				throw new InvalidFileException("Required data not received");
			}

			// qqfile is populated from $_FILES['qqfile']
			if(empty($post['qqfile']['tmp_name'])) {
				throw new InvalidFileException("Required data not received");
			}

			if(!$this->isUploadedFile($post['qqfile']['tmp_name'])) {
				throw new InvalidFileException("The upload could not be saved");
			}

			$form = $this->getForm();
			$token = $form->getSecurityToken();
			if(empty($post[ $token->getName() ])) {
				throw new MissingDataException("The upload request is missing required information");
			}

			$form_security_token = $post[ $token->getName() ];

				// do this in a containing method
				// check for the uploaded file
				// check for permissions
				// check for file errors e.g bad type, bad extension
				// check for php errors
				// load into a File object or the type of file configured
			$file = $this->saveTemporaryFile($post['qqfile'], $error);
			if($error) {
				throw new InvalidFileException($error);
			}

			$uuid = $this->getUuid($post[ self::UUID_NAME ], $form_security_token);

			// save the token, together with the Form Security ID for the form used to upload the file
			// TODO create a folder and assign that as the parent
			$file->DFU = $uuid . "|" . $form_security_token;
			$file->write();

			$result = [
				'success' => true,
				'newUuid' => $uuid
			];
			return (new HTTPResponse(json_encode($result)))->addHeader('Content-Type', 'application/json');

		} catch (MissingDataException $e) {
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
		return (new HTTPResponse(json_encode($result), 400))->addHeader('Content-Type', 'application/json');

	}

}
