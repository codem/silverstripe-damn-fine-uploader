<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\Folder;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\FieldList;

/**
 * Trait for editable DFU field implementations
 */
trait CMSFieldConfigurator
{
    public static function get_php_max_file_size(): int
    {
        $maxUpload = Convert::memstring2bytes(ini_get('upload_max_filesize'));
        $maxPost = Convert::memstring2bytes(ini_get('post_max_size'));
        return min($maxUpload, $maxPost);
    }

    public function getPHPMaxFileSizeMB(): float
    {
        return round(static::get_php_max_file_size() / 1024 / 1024, 1);
    }

    /**
     * Add generic CMS fields to the record
     */
    public function addGenericFields(FieldList $fields, string $tab = "Main"): FieldList
    {

        $fields->removeByName([
            'Implementation',
            'Folder','FolderID', 'UseDateFolder',
            'MaxFileSizeMB','FileUploadLimit'
        ]);

        // Restrictions
        $fields->addFieldToTab(
            'Root.' . $tab,
            CompositeField::create(
                NumericField::create('MaxFileSizeMB')
                    ->setTitle(_t('DamnFineUploader.MAX_FILE_SIZE_MB', 'Max File Size MB'))
                    ->setDescription(_t('DamnFineUploader.MAX_FILE_SIZE_MB_DESCRIPTION', "Note: Maximum php allowed size is {maxSize} MB", ['maxSize' => $this->getPHPMaxFileSizeMB()])),
                NumericField::create('FileUploadLimit')
                    ->setTitle(_t('DamnFineUploader.MAX_NUMBER_FILES_IN_UPLOAD', 'Maximum number of files allowed in the upload'))
            )->setTitle(_t('DamnFineUploader.RESTRICTIONS', 'Restrictions'))
        );

        // SAVING
        // local saving (may be removed for external uploads)
        $this->addSaveLocationFields($fields, $tab);

        return $fields;
    }

    /**
     * Local save fields
     */
    public function addSaveLocationFields(FieldList $fields, string $tab): void
    {

        // determine folder name for field
        $folder = $this->Folder();
        if ($folder && $folder->exists()) {
            $uploadFolderLocation = $folder->getFilename();
            $uploadFolderLink = Controller::join_links(AssetAdmin::create()->Link('show/'), $folder->ID);
            $uploadFolderDescription = "<a target=\"_blank\" href=\"{$uploadFolderLink}\">"
                . _t('DamnFineUploader.VIEW_FOLDER_ADMIN', 'View folder')
                . "</a>";
            $uploadFolderRestrictionNote = '';
        } else {
            $uploadFolderLocation = _t('DamnFineUploader.FOLDER_DOES_NOT_EXIST_YET', 'The upload folder will be created when this field is first saved');
            $uploadFolderDescription = '';
            $uploadFolderRestrictionNote = '';
        }

        $useDateFolderField = CheckboxField::create('UseDateFolder')
            ->setTitle(_t('DamnFineUploader.FOLDER_DATE_FORMAT', 'Use a year/month/day upload folder suffix'))
            ->setDescription(
                _t(
                    'DamnFineUploader.FOLDER_DATE_FORMAT_DESCRIPTION',
                    'When checked, uploads will be saved into a date-based subdirectory structure. Example my-uploads/2020/12/31'
                )
            );


        // Composite field for showing save details
        $fields->addFieldToTab(
            'Root.' . $tab,
            CompositeField::create(
                $useDateFolderField,
                ReadonlyField::create(
                    'UploadFolderLocation',
                    _t('DamnFineUploader.UPLOAD_FOLDER_LOCATION', 'Upload folder location'),
                    $uploadFolderLocation
                )->setDescription($uploadFolderDescription)
            )->setTitle(_t('DamnFineUploader.SAVING', 'Saving'))
        );

        // Apply restricted access warning (taken from userforms module)
        if ($folder && $folder->exists() && !$folder->hasRestrictedAccess()) {
            $fields->insertBefore(
                'UploadFolderLocation',
                LiteralField::create(
                    'FileUploadWarning',
                    '<p class="alert alert-warning">'
                    . htmlspecialchars(_t(
                        'SilverStripe\\UserForms\\Model\\UserDefinedForm.UnrestrictedFileUploadWarning',
                        'Access to the current upload folder "{path}" is not restricted. Uploaded files will be publicly accessible if the exact URL is known.',
                        [
                            'path' => Convert::raw2att($folder->Filename)
                        ]
                    ))
                    . '</p>'
                )
            );
        }
    }
}
