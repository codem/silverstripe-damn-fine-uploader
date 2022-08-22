<?php

namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\EditableFormField\EditableFileField;
use Symbiote\MultiValueField\ORM\FieldType\MultiValueField;

/**
 * @note provides an EditableUploadField for the userforms module
 * returns a field based on the implementation, currently Uppy
 */
class EditableUploadField extends EditableFileField
{
    use EditableDamnFineUploader;
    use Migrations;
    use CMSFieldConfigurator;
    use RestrictedUploadFolder;

    private static $table_name = 'EditableUploadField';

    private static $singular_name = 'File Upload Field - Drag and Drop';
    private static $plural_name = 'File Upload Fields - Drag and Drop';

    private static $run_migration_1 = true;
    private static $run_migration_manymanyhasmany = false;
    private static $run_migration_allowedmimetypedeprecation = false;

    private static $db = [
        'SelectedFileTypes' => 'Text',
        'FileUploadLimit' => 'Int',
        'UseDateFolder' => 'Boolean',
        'Implementation' => 'Varchar(16)'
    ];

    /**
     * Add default values to database
     * @var array
     */
    private static $defaults = [
        'UseDateFolder' => 1,
        'FileUploadLimit' => 3,
        'Implementation' => DamnFineUploaderField::IMPLEMENTATION_UPPY
    ];

    /**
     * Uppy is the only supported field implementation for now
     */
    public function onBeforeWrite()
    {
        // Ensure a folder is created
        $this->createProtectedFolder();
        // call parent write handling
        parent::onBeforeWrite();
        // set implementation on this field
        $this->Implementation = DamnFineUploaderField::IMPLEMENTATION_UPPY;
    }

    /**
     * Require default records / perform migration handling on dev/build
     */
    public function requireDefaultRecords()
    {
        if(get_class($this) == EditableUploadField::class) {
            // avoid child classes running this method
            if ($this->config()->get('run_migration_1')) {
                $this->migrationDeprecateFineUploader();
            }
            if ($this->config()->get('run_migration_manymanyhasmany')) {
                $this->migrationManyManyHasMany();
            }
            if ($this->config()->get('run_migration_allowedmimetypedeprecation')) {
                $this->migrateAllowedMimeTypes();
            }
        }
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $this->addGenericFields($fields, _t('DamnFineUploader.TAB_MAIN', 'Main'));
        return $fields;
    }

}
