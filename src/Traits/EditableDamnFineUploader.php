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
     * Get the uploader field, in the future this will return a field based on the implementation value
     * @return UppyField
     */
    protected function getUploaderField()
    {
        $field = UppyField::create($this->Name, $this->Title ?: false, null, null)
                    ->setFieldHolderTemplate(EditableFormField::class . '_holder')
                    ->setTemplate(__CLASS__);
        return $field;
    }

    /**
     * Get the submitted for field
     * @return SubmittedUppyField
     */
    public function getSubmittedFormField()
    {
        return SubmittedUppyField::create();
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
            $field->setUseDateFolder($this->UseDateFolder == 1);
        } else {
            // the fallback is the general "Uploads" location
            $field->setUseDateFolder($this->UseDateFolder == 1);
        }

        $this->doUpdateFormField($field);
        return $field;
    }
}
