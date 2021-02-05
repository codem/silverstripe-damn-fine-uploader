<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Injector\Injector;

/**
 * Trait for submitted DFU field implementations
 */
trait SubmittedDamnFineUploader
{

    /**
     * Return the value of this field for inclusion into things such as
     * reports.
     *
     * @return string
     */
    public function getFormattedValue()
    {
        $title = _t('DamnFineUploader.DOWNLOAD_FILE', 'Download file');
        $files = [];
        foreach ($this->Files() as $i => $file) {
            $files[] = sprintf(
                '%s - <a href="%s" target="_blank">%s</a>',
                $file->Name,
                $file->URL,
                $title
            );
        }
        return DBField::create_field('HTMLText', implode('<br/>', $files));
    }

    /**
     * Return the value for this field in the CSV export.
     *
     * @return string
     */
    public function getExportValue()
    {
        $links = [];
        foreach ($this->Files() as $file) {
            $links[] = $file->getAbsoluteURL();
        }
        return implode('|', $links);
    }
}
