<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Control\HTTP;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\NumericField;
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
     * Add generic CMS fields to the record
     * @return FieldList
     */
    public function addGenericFields(FieldList $fields, string $tab = "Main") : FieldList
    {

        $fields->removeByName([
            'Implementation',
            'Folder','FolderID', 'UseDateFolder',
            'MaxFileSizeMB','FileUploadLimit','SelectedFileTypes'
        ]);

        // get allowed types field
        $mimetypes = $this->getAllowedMimeTypes();
        $typeDescription = trim(implode(", ", $mimetypes));
        if(!$typeDescription) {
            $typeDescription = _t(
                'DamnFineUploader.NONE',
                '(none)'
            );
        }
        $typeSelectionField = TypeSelectionField::create('SelectedFileTypes')
            ->setTitle(
                _t(
                    'DamnFineUploader.SELECT_FILE_TYPES',
                    'Select allowed file types for this upload field'
                )
            )
            ->setDescription(
                _t(
                    'DamnFineUploader.ALLOWED_MIME_TYPES',
                    "The following mimetypes are allowed, based on this selection: <strong>{types}</strong>",
                    [
                        'types' => $typeDescription
                    ]
                )
        );

        // Restrictions
        $fields->addFieldToTab(
            'Root.' . $tab,
            CompositeField::create(
                NumericField::create('MaxFileSizeMB')
                    ->setTitle('Max File Size MB')
                    ->setDescription("Note: Maximum php allowed size is {$this->getPHPMaxFileSizeMB()} MB"),
                NumericField::create('FileUploadLimit')
                    ->setTitle('Maximum number of files allowed in the upload'),
                $typeSelectionField
            )->setTitle( _t('DamnFineUploader.RESTRICTIONS', 'Restrictions') )
        );

        // SAVING
        // local saving (may be removed for external uploads)
        $this->addSaveLocationFields($fields, $tab);

        return $fields;
    }

    /**
     * Local save fields
     */
    public function addSaveLocationFields(FieldList $fields, string $tab) {

        // determine folder name for field
        $folder = $this->Folder();
        if($folder && $folder->exists()) {
            $uploadFolderLocation = $folder->getFilename();
            $uploadFolderLink = AssetAdmin::create()->getFileEditLink($folder);
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
                )->setDescription( $uploadFolderDescription )
            )->setTitle(_t('DamnFineUploader.SAVING', 'Saving'))
        );

        // Apply restricted access warning (taken from userforms module)
        if($folder && !$folder->hasRestrictedAccess()) {
            $fields->insertBefore(
                'UploadFolderLocation',
                LiteralField::create(
                    'FileUploadWarning',
                    '<p class="alert alert-warning">'
                    . _t(
                        'SilverStripe\\UserForms\\Model\\UserDefinedForm.UnrestrictedFileUploadWarning',
                        'Access to the current upload folder "{path}" is not restricted. Uploaded files will be publicly accessible if the exact URL is known.',
                        [
                            'path' => Convert::raw2att($folder->Filename)
                        ]
                    )
                    . '</p>'
                )
            );
        }
    }
}
