<?php
namespace Codem\DamnFineUploader;

use SilverStripe\Assets\Folder;
use SilverStripe\UserForms\Model\EditableFormField;

/**
 * @note provides an EditableUploadField for the userforms module
 * You should not instantiate this class
 */
class EditableUploadField extends EditableFormField
{
    use EditableDamnFineUploader;

    private static $table_name = 'EditableUploadField';

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

}
