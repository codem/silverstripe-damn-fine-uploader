<?php
namespace Codem\DamnFineUploader;
use Silverstripe\Forms\FileField;
use SilverStripe\View\Requirements;
use SilverStripe\ORM\DataObjectInterface;
use SilverStripe\Control\HTTP_Request;
use SilverStripe\Control\HTTP_Response;
use SilverStripe\Core\Config\Config;
use Exception;

/**
 * @note Provides a field to handle FineUploader uploads. FineUploade
 *			FineUploader can either attach to this field's form, or not
 *			By default the module ships with FineUpload attaching to this field's containing form, this is done to get file data submitting with the form submission
 *			You can enable a standalone drag-drop style interface by setting autoUpload to true, file submissions will then be directed through this field's upload method
 *			Read More: https://docs.fineuploader.com/branch/master/features/forms.html
 */
class UploadField extends FileField {

	const IMPLEMENTATION_TRADITIONAL_CORE = 'traditionalcore';
	const IMPLEMENTATION_TRADITIONAL_UI = 'traditionalui';

	protected $lib_config;//fineuploader configuration
	protected $request_endpoint, $delete_endpoint;// custom endpoints
	protected $default_accepted_types = ['image/jpg','image/gif','image/webp','image/jpeg'];// default to images for now

	protected $implementation;

	public function __construct($name, $title = null, $value = null) {
		//$this->setUploaderDefaultConfig();
		parent::__construct($name, $title, $value);
	}

	/**
	 * Based on the implementation, set library requirements and the template to use
	 */
	protected function libraryRequirements() {

		switch($this->implementation) {
			case self::IMPLEMENTATION_TRADITIONAL_UI:
				Requirements::javascript('codem/dfu: client/dist/js/traditionalui.js');
				Requirements::css('codem/dfu: client/dist/styles/traditionalui.css');
				$this->template = "FineUploaderField_ui";
				break;
			case self::IMPLEMENTATION_TRADITIONAL_CORE:
			default:
				Requirements::javascript('codem/dfu: client/dist/js/traditionalcore.js');
				Requirements::css('codem/dfu: client/dist/styles/traditionalcore.css');
				$this->template = "FineUploaderField_core";
				break;
		}

		if(!$this->lib_config) {
			$this->setUploaderDefaultConfig();
		}

		if(!isset($this->lib_config->validation->acceptFiles)) {
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
		switch($this->implementation) {
			case self::IMPLEMENTATION_TRADITIONAL_CORE:
			case self::IMPLEMENTATION_TRADITIONAL_UI:
				return $this->implementation;
				break;
			default:
				return self::IMPLEMENTATION_TRADITIONAL_CORE;
				break;
		}
	}

	/**
	 * Sets the default config from YAML configuration and applies some configuration based on this form
	 */
	protected function setUploaderDefaultConfig() {
		// set default lib_config from yml
		$this->lib_config = $this->config()->fineuploader;
		// element options
		$form = $this->getForm();
		$this->lib_config['element'] = ($form ? $form->getHTMLID() : "");// the containing form id attribute
		$this->lib_config['autoUpload'] = false;// do not auto upload by default

		// form options
		$this->lib_config['form'] = [];
		$this->lib_config['form']['autoUpload'] = false;// do not auto upload by default

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
		if(!isset($this->lib_config->validation)) {
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
		//
		$extensions = array();
		foreach($types as $type) {
			return [

			];
		}
	}

	/**
	 * @note allows uploads via a custom path, by default this field's path to the Upload method is used
	 */
	public function setRequestEndpoint($path) {
		$this->request_endpoint = $path;
		return $this;
	}

	/**
	 * @note allows deletes of uploads via a custom path
	 */
	public function setDeleteEndpoint($path) {
		$this->delete_endpoint = $path;
		return $this;
	}

	public function Field($properties = array()) {
		$this->libraryRequirements();
		parent::Field($properties);
	}


	public function FieldHolder($properties = array ()) {
			$this->libraryRequirements();
			return parent::FieldHolder($properties);
	}

	/**
	 * The Small Field Holder is the large holder
	 */
	public function SmallFieldHolder($properties = array ()) {
			$this->libraryRequirements();
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
	 * Method to save this form field into the given {@link DataObject}.
	 *
	 * By default, makes use of $this->dataValue()
	 *
	 * @param DataObjectInterface $record DataObject to save data into
	 */
	public function saveInto(DataObjectInterface $record) {
		if($this->name) {
			$record->setCastedField($this->name, $this->dataValue());
		}
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
	 * @param HTTP_Request $request
	 * @return HTTP_Response
	 */
	public function upload(HTTP_Request $request) {
			// do this in a containing method
			// check for the uploaded file
			// check for permissions
			// check for file errors e.g bad type
			// check for php errors
			// load into a File object or the type of file configured
	}

}
