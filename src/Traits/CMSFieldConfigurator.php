<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\HeaderField;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Core\Config\Config;

/**
 * Trait for editable DFU field implementations
 */
trait CMSFieldConfigurator
{
    /**
     * @return float
     */
    public static function get_php_max_file_size()
    {
        $maxUpload = File::ini2bytes(ini_get('upload_max_filesize'));
        $maxPost = File::ini2bytes(ini_get('post_max_size'));
        return min($maxUpload, $maxPost);
    }

    public function getPHPMaxFileSizeMB()
    {
        return round(static::get_php_max_file_size() / 1024 / 1024, 1);
    }

    /**
     * @return FieldList
     */
    public function addGenericFields(FieldList $fields, $tab = "Main")
    {
        $fields->removeByName('Default');
        $fields->removeByName('Implementation');

        $fields->addFieldToTab(
            'Root.' . $tab,
            HeaderField::create(
                'UploadRestrictionsHeader',
                _t('DamnFineUploader.RESTRICTIONS', 'Restrictions')
            )
        );

        $fields->addFieldToTab(
            'Root.' . $tab,
            NumericField::create('MaxFileSizeMB')
                ->setTitle('Max File Size MB')
                ->setDescription("Note: Maximum php allowed size is {$this->getPHPMaxFileSizeMB()} MB")
        );

        $fields->addFieldToTab(
            'Root.' . $tab,
            NumericField::create('FileUploadLimit')
                ->setTitle('Maximum number of files allowed in the upload')
        );

        // Get the configured values for the field
        $config = Config::inst()->get(DamnFineUploaderField::class, 'implementation');
        $defaults = "";
        if (!empty($config['validation']['acceptFiles'])) {
            $defaults = strip_tags($config['validation']['acceptFiles']);
        }
        $fields->addFieldToTab(
            'Root.' . $tab,
            TextareaField::create('AllowedMimeTypes')
                ->setTitle(_t('DamnFineUploader.ACCEPTED_MIMETYPES', 'Accepted mime types allowed for uploads made via this field (one per line)'))
                ->setDescription(sprintf(_t('DamnFineUploader.DEFAULT_MIMETYPES', 'Default if none set: %s'), $defaults))
        );

        $fields->addFieldToTab(
            'Root.' . $tab,
            CheckboxField::create('UseDateFolder')
                ->setTitle(_t('DamnFineUploader.FOLDER_DATE_FORMAT', 'Use a year/month/day upload folder format suffix'))
                ->setDescription(
                    _t(
                        'DamnFineUploader.FOLDER_DATE_FORMAT_DESCRIPTION',
                        'When checked, uploads will be saved into a date-based subdirectory structure. Example my-uploads/2020/01/01'
                    )
                ),
            'FolderID'
        );

        return $fields;
    }
}
