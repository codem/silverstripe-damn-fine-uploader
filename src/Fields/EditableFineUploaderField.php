<?php
namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\EditableFormField;

/**
 * @note provides an EditableUploadField for the userforms module
 */
class EditableFineUploaderField extends EditableFineUploaderCoreField {

  private static $singular_name = 'File Upload Field (Fine Uploader)';
  private static $plural_names = 'File Fields (Fine Uploader)';

  private static $table_name = 'EditableFineUploaderField';


  protected function getUploaderField() {
    $field = FineUploaderField::create($this->Name, $this->Title ?: false)
        ->setFieldHolderTemplate(EditableFormField::class . '_holder')
        ->setTemplate(__CLASS__);
    return $field;
  }

}
