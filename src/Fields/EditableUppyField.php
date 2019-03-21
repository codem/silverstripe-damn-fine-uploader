<?php
namespace Codem\DamnFineUploader;

use SilverStripe\Assets\Folder;
use SilverStripe\UserForms\Model\EditableFormField;

/**
 * @note provides an EditableUploadField for the userforms module
 */
class EditableUppyField extends EditableFormField
{
    use EditableDamnFineUploader;

    private static $singular_name = 'File Upload Field (Uppy)';
    private static $plural_names = 'File Upload Fields (Uppy)';

    private static $db = [
        'MaxFileSizeMB' => 'Float',
        'AllowedMimeTypes' => 'Text',
        'FileUploadLimit' => 'Int',
        'UseDateFolder' => 'Boolean'
    ];

    private static $has_one = [
        'Folder' => Folder::class // From CustomFields
    ];

    /**
     * Add default values to database
     * @var array
     */
    private static $defaults = [
        'UseDateFolder' => 1,
        'FileUploadLimit' => 3,
    ];

    private static $table_name = 'EditableUppyField';

    protected function getUploaderField()
    {
        $field = UppyField::create($this->Name, $this->Title ?: false, null, null)
                    ->setFieldHolderTemplate(EditableFormField::class . '_holder')
                    ->setTemplate(__CLASS__);
        return $field;
    }

    public function getSubmittedFormField()
    {
        return SubmittedFineUploaderField::create();
    }
}
