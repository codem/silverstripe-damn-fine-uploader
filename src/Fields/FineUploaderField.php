<?php
namespace Codem\DamnFineUploader;
use SilverStripe\View\Requirements;

/**
 * @note Traditional/UI implementation of FineUploader
 */
class FineUploaderField extends FineUploaderCoreField {

  protected $implementation = parent::IMPLEMENTATION_TRADITIONAL_UI;

  protected function setRequirements() {
    Requirements::set_force_js_to_bottom(true);
    Requirements::javascript('codem/silverstripe-damn-fine-uploader: client/dist/js/traditional.ui.js');
    Requirements::javascript('codem/silverstripe-damn-fine-uploader: client/dist/js/dfu.common.js');
    Requirements::javascript('codem/silverstripe-damn-fine-uploader: client/dist/js/dfu.ui.js');
    Requirements::css('codem/silverstripe-damn-fine-uploader: client/dist/styles/traditional.ui.gallery.css');
    Requirements::css('codem/silverstripe-damn-fine-uploader: client/dist/styles/dfu.ui.css');
  }

	/**
	 * Returns the current implementation or self::IMPLEMENTATION_TRADITIONAL_CORE if not set/handled
	 */
	public function getImplementation() {
    return parent::IMPLEMENTATION_TRADITIONAL_UI;
	}

}
