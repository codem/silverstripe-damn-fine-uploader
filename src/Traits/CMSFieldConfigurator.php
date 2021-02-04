<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\HTTP;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\HeaderField;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\MimeValidator\MimeUploadValidator;

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
     * Get the allowed mime types, based on the selected file types
     * @return array
     */
    public function getAllowedMimeTypes() {
        $selected = $this->SelectedFileTypes;
        $mimetypes = [];
        $types = json_decode($selected, true);
        if(json_last_error() == JSON_ERROR_NONE && is_array($types)) {
            foreach($types as $type) {
                $expected = $this->getMimeTypes($type);
                $mimetypes = array_merge($mimetypes, $expected);
            }
        }
        return array_unique($mimetypes);
    }

    /**
     * This is pinched from MimeUploadValidator
     * @return array
     */
    public function getMimeTypes($extension) {
        $expectedMimes = [];
        // Get the mime types set in framework core
        $knownMimes = Config::inst()->get(HTTP::class, 'MimeTypes');
        if (isset($knownMimes[$extension])) {
            $expectedMimes[] = $knownMimes[$extension];
        }

        // Get the mime types and their variations from mime validator
        $knownMimes =  Config::inst()->get(MimeUploadValidator::class, 'MimeTypes');
        if (isset($knownMimes[$extension])) {
            $mimes = (array) $knownMimes[$extension];

            foreach ($mimes as $mime) {
                if (!in_array($mime, $expectedMimes)) {
                    $expectedMimes[] = $mime;
                }
            }
        }

        return $expectedMimes;
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

        // get allowed types field

        $mimetypes = $this->getAllowedMimeTypes();
        $type_description = trim(implode(", ", $mimetypes));
        if(!$type_description) {
            $type_description = _t(
                'DamnFineUploader.NONE',
                '(none)'
            );
        }
        $fields->addFieldToTab(
            'Root.' . $tab,
            TypeSelectionField::create('SelectedFileTypes')
                ->setTitle(
                    _t(
                        'DamnFineUploader.SELECT_FILE_TYPES',
                        'Select allowed file types for this form'
                    )
                )
                ->setDescription(
                    _t(
                        'DamnFineUploader.ALLOWED_MIME_TYPES',
                        "The following mimetypes are allowed, based on this selection: <strong>{types}</strong>",
                        [
                            'types' => $type_description
                        ]
                    )
                )
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
