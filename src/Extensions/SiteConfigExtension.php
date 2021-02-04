<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\FieldList;
use Silverstripe\ORM\DataExtension;
use Symbiote\MultiValueField\Fields\MultiValueCheckboxField;
use Symbiote\MultiValueField\Fields\MultiValueDropdownField;
use Symbiote\MultiValueField\Fields\MultiValueListField;
use Symbiote\MultiValueField\ORM\FieldType\MultiValueField;

class SiteConfigExtension extends DataExtension {

    private static $db = [
        'AllowedFileExtensions' => MultiValueField::class
    ];

    /**
     * Get the allowed file extensions for this site
     */
    protected function getAllowedFileTypes() {
        $allowed_extensions = File::getAllowedExtensions();
        if(!is_array($allowed_extensions)) {
            return [];
        } else {
            $exts = array_filter($allowed_extensions);
            $data = [];
            foreach($exts as $ext) {
                $data[$ext] = $ext;
            }
            return $data;
        }
    }

    public function updateCMSFields(FieldList $fields)
    {
        $owner = $this->owner;
        $fields->addFieldToTab(
            'Root.Uploads',
            MultiValueListField::create(
                'AllowedFileExtensions',
                _t(
                    'DamnFineUploader.SELECT_ALLOWED_TYPES',
                    'Select allowed file types for uploads to this website'
                ),
                $this->getAllowedFileTypes()
            )
        );
        return $fields;
    }

}
