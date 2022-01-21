<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\ORM\HasManyList;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\UserForms\Extension\UserFormFileExtension;
use SilverStripe\Versioned\Versioned;

/**
 * Trait for submitted DFU field implementations
 */
trait SubmittedDamnFineUploader
{

    /**
     * Return submitted files after they have been written to the draft stage
     */
    public function getSubmittedFiles() : HasManyList {
        return Versioned::withVersionedMode(function () {
            Versioned::set_stage(Versioned::DRAFT);
            // Return draft files, with relevant filters
            return $this->Files()->filter([
                'IsDfuUpload' => 1,
                'UserFormUpload' => UserFormFileExtension::USER_FORM_UPLOAD_TRUE
            ]);
        });
    }

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
        foreach ($this->getSubmittedFiles() as $i => $file) {
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
        foreach ($this->getSubmittedFiles() as $file) {
            $links[] = $file->getAbsoluteURL();
        }
        return implode('|', $links);
    }
}
