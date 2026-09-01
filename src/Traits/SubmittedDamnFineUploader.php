<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\ORM\FieldType\DBVarchar;
use SilverStripe\ORM\HasManyList;
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
    public function getSubmittedFiles(): HasManyList
    {
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
     */
    public function getFormattedValue()
    {
        $title = _t('DamnFineUploader.DOWNLOAD_FILE', 'Download file');
        $files = [];
        foreach ($this->getSubmittedFiles() as $file) {
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
     */
    public function getExportValue()
    {
        $links = [];
        foreach ($this->getSubmittedFiles() as $file) {
            if ($file instanceof File) {
                $links[] = $file->getAbsoluteURL();
            }
        }

        return DBField::create_field(DBVarchar::class, implode('|', $links));
    }
}
