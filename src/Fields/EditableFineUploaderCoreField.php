<?php
namespace Codem\DamnFineUploader;

use Silverstripe\Forms\FileField;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\TextareaField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Assets\File;
use SilverStripe\UserForms\Model\EditableFormField;
use SilverStripe\UserForms\Model\EditableFormField\EditableFileField;
use SilverStripe\Control\Controller;

/**
 * @note provides an EditableUploadField for the userforms module
 */
class EditableFineUploaderCoreField extends EditableFormField {

    private static $singular_name = 'File Upload Field (Fine Uploader Basic)';
    private static $plural_names = 'File Fields (Fine Uploader Basic)';
    private static $db = [
        'MaxFileSizeMB' => 'Float',
        'AllowedMimeTypes' => 'Text',
        'FileUploadLimit' => 'Int',
        'UseDateFolder' => 'Boolean'
    ];

    /**
     * Add default values to database
     * @var array
     */
    private static $defaults = [
      'UseDateFolder' => 1,
      'FileUploadLimit' => 3,
    ];

    private static $table_name = 'EditableFineUploaderCoreField';

    /**
     * @return FieldList
     */
    public function getCMSFields() {
        $fields = parent::getCMSFields();
        $fields->removeByName('FolderID');
        $fields->removeByName('Default');

        $fields->addFieldToTab(
            'Root.Main',
            NumericField::create('MaxFileSizeMB')
                ->setTitle('Max File Size MB')
                ->setDescription("Note: Maximum php allowed size is {$this->getPHPMaxFileSizeMB()} MB")
        );

        $fields->addFieldToTab(
            'Root.Main',
            TextareaField::create('AllowedMimeTypes')
                ->setTitle('Accepted mime types allowed for uploads made via this field')
        );
        $fields->addFieldToTab(
            'Root.Main',
            CheckboxField::create('UseDateFolder')
                ->setTitle('Use a year/month/day upload folder format')
                ->setValue(1)
        );
        return $fields;
    }

    protected function getUploaderField() {
      $field = FineUploaderCoreField::create($this->Name, $this->Title ?: false)
          ->setFieldHolderTemplate(EditableFormField::class . '_holder')
          ->setTemplate(__CLASS__);
      return $field;
    }

    /**
     * Return the form field used for uploads
     */
    public function getFormField()  {
        $field = $this->getUploaderField();

        $controller = Controller::curr();

        $field->initFieldConfig();

        // set accepted types on the field e.g image/jpeg
        $types = $this->AllowedMimeTypes;
        $pattern = '/\s{1,}/';
        $types = preg_split($pattern, $types);
        $field->setAcceptedTypes($types);

        // max file size, handle in bytes, provided in MB
        $bytes = $this->MaxFileSizeMB * 1048576;
        if ($bytes > 0) {
            $field->setAllowedMaxFileSize($bytes);
        } else {
            $field->setAllowedMaxFileSize(parent::get_php_max_file_size());
        }

        if((int)$this->FileUploadLimit <= 0) {
          $this->FileUploadLimit = 3;
        }
        $field->setAllowedMaxItemLimit( $this->FileUploadLimit );

        $field->setUseDateFolder($this->UseDateFolder == 1);

        $this->doUpdateFormField($field);
        return $field;
    }


    public function getSubmittedFormField() {
        return SubmittedFineUploaderField::create();
    }

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

}
