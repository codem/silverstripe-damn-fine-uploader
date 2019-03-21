<?php
namespace Codem\DamnFineUploader;

use SilverStripe\Assets\Folder;
use SilverStripe\UserForms\Model\EditableFormField;

/**
 * @note provides the Uppy editable field implementation for the User Defined Forms module
 */
class EditableUppyField extends EditableUploadField
{

    private static $singular_name = 'File Upload Field (Uppy)';
    private static $plural_names = 'File Upload Fields (Uppy)';

    protected function getUploaderField()
    {
        $field = UppyField::create($this->Name, $this->Title ?: false, null, null)
                    ->setFieldHolderTemplate(EditableFormField::class . '_holder')
                    ->setTemplate(__CLASS__);
        return $field;
    }

    public function getSubmittedFormField()
    {
        return SubmittedUppyField::create();
    }
}
