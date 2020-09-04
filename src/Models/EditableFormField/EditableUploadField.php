<?php
namespace Codem\DamnFineUploader;

use SilverStripe\Core\Convert;
use SilverStripe\Assets\Folder;
use SilverStripe\UserForms\Model\EditableFormField\EditableFileField;
use SilverStripe\ORM\DB;
use SilverStripe\Forms\HeaderField;

/**
 * @note provides an EditableUploadField for the userforms module
 * returns a field based on the implementation, currently Uppy
 */
class EditableUploadField extends EditableFileField
{
    use EditableDamnFineUploader;
    use CMSFieldConfigurator;

    private static $table_name = 'EditableUploadField';

    private static $singular_name = 'File Upload Field - Drag and Drop';
    private static $plural_name = 'File Upload Fields - Drag and Drop';

    private static $db = [
        'AllowedMimeTypes' => 'Text',
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
        parent::onBeforeWrite();
        $this->Implementation = DamnFineUploaderField::IMPLEMENTATION_UPPY;
    }

    /**
     * Perform migration handling on dev/build
     */
    public function requireDefaultRecords() {
        if($this->config()->get('run_migration_1')) {
            $tables = [
                'EditableFineUploaderCoreField',
                'EditableFineUploaderCoreField_Live',
                'EditableFineUploaderCoreField_Versions',
                'SubmittedFineUploaderField_Files'
            ];
            DB::alteration_message("Executing run_migration_1 (turn this off in config if you no longer need it)", "changed");
            foreach($tables as $table) {
                try {
                    // obsolete deprecated/removed/unused FineUploader support
                    DB::alteration_message("dont_require_table {$table}", "changed");
                    DB::dont_require_table($table);
                } catch(\Exception $e) {
                    DB::alteration_message($e->getMessage(), "error");
                }
            }
        }
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $this->addGenericFields($fields);
        $fields->insertBefore('FolderID', $fields->dataFieldByName('UseDateFolder'));
        $fields->addFieldToTab(
            'Root.Main',
            HeaderField::create(
                'UploadFieldSavingHeader',
                _t('DamnFineUploader.SAVING', 'Saving')
            ),
            'UseDateFolder'
        );

        return $fields;
    }

}
