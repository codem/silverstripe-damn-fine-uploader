<?php
namespace Codem\DamnFineUploader;

use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Core\Config\Config;

/**
 * Trait for editable DFU field implementations
 */
trait EditableDamnFineUploader
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
    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName('Default');

        $fields->addFieldToTab(
            'Root.Main',
            TreeDropdownField::create(
                'FolderID',
                _t('DamnFineUploader.SELECT_UPLOAD_FOLDER', 'Select upload folder'),
                Folder::class
            )
        );

        $fields->addFieldToTab(
            'Root.Main',
            NumericField::create('MaxFileSizeMB')
                ->setTitle('Max File Size MB')
                ->setDescription(sprintf(
                    _t('DamnFineUploader.MAXIMUM_UPLOAD_SIZE', "Note: Maximum php allowed size is %s MB"),
                    $this->getPHPMaxFileSizeMB()
                                ))
        );

        $config = Config::inst()->get(DamnFineUploaderField::class, 'implementation');
        $defaults = "";
        if(!empty($config['validation']['acceptFiles'])) {
            $defaults = strip_tags($config['validation']['acceptFiles']);
        }
        $fields->addFieldToTab(
            'Root.Main',
            TextareaField::create('AllowedMimeTypes')
                ->setTitle(_t('DamnFineUploader.ACCEPTED_MIMETYPES', 'Accepted mime types allowed for uploads made via this field (one per line)'))
                ->setDescription( sprintf( _t('DamnFineUploader.DEFAULT_MIMETYPES', 'Default if none set: %s'), $defaults) )
        );
        $fields->addFieldToTab(
            'Root.Main',
            CheckboxField::create('UseDateFolder')
                ->setTitle(_t('DamnFineUploader.FOLDER_DATE_FORMAT', 'Use a year/month/day upload folder format'))
                ->setValue(1)
        );
        return $fields;
    }

    /**
     * Return the form field used for uploads
     * @note that at this point, the Form instance has not been associated
     * @see UserFormExtension::updateForm()
     */
    public function getFormField()
    {
        $field = $this->getUploaderField();

        // Apply initial configuration
        //$field->initFieldConfig();// default configuration

        // Apply configurable settings
        // set accepted types on the field e.g image/jpeg
        $types = trim($this->AllowedMimeTypes);
        if ($types) {
            $pattern = '/\s{1,}/';
            $types = preg_split($pattern, $types);
            $field->setAcceptedTypes($types);
        }

        // max file size, handle in bytes, provided in MB
        $bytes = $this->MaxFileSizeMB * 1048576;
        if ($bytes > 0) {
            $field->setAllowedMaxFileSize($bytes);
        } else {
            $field->setAllowedMaxFileSize(self::get_php_max_file_size());
        }

        if ((int)$this->FileUploadLimit <= 0) {
            $this->FileUploadLimit = 3;
        }
        $field->setAllowedMaxItemLimit($this->FileUploadLimit);

        // Set a folder name
        $folder = $this->Folder();
        if ($folder && $folder->exists()) {
            // Set a folder name
            $field->setFolderName($folder->getFilename());
        } else {
            // the fallback is the general "Uploads" location
            $field->setUseDateFolder($this->UseDateFolder == 1);
        }

        $this->doUpdateFormField($field);
        return $field;
    }
}
