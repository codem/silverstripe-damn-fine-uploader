<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Forms\CheckboxSetField;
use SilverStripe\SiteConfig\SiteConfig;

/**
 * Provide a field to allow file type selections
 */
class TypeSelectionField extends CheckboxSetField
{
    public function __construct($name, $title = null, $source = [], $value = null)
    {
        $source = $this->getAllowedTypes();
        parent::__construct($name, $title, $source, $value);
    }

    /**
     * Get the allowed types from Site Config
     */
    public function getAllowedTypes() {
        $config = SiteConfig::current_site_config();
        $data = [];
        if($config->AllowedFileExtensions) {
            $types = $config->AllowedFileExtensions->getValues();
            if(is_array($types)) {
                foreach($types as $type) {
                    $data[$type] = $type;
                }
            }
        }
        return $data;
    }
}
