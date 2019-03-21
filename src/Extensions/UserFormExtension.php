<?php
namespace Codem\DamnFineUploader;

use SilverStripe\Core\Extension;
use SilverStripe\Control\Controller;

/**
 * Handle field modifications in a UserForm context
 * In a userform context, the controller request endpoint is 'Form' rather than the Form ID/Name
 * $form->setFormAction is called after this is run, so 'Form' is required here to correctly reference the form
 */
class UserFormExtension extends Extension
{
    public function updateForm($fields)
    {
        $fields = $this->owner->Fields()->dataFields();
        foreach ($fields as $field) {
            if ($field instanceof DamnFineUploaderField) {
                // ensure the field has the current form's SecurityToken
                $field->setSecurityToken($this->owner->getSecurityToken());
                // and the request endpoint, now that a Form is available on the field
                $link = Controller::join_links($this->owner->getController()->Link('Form'), $field->UploadLink());
                $field->setRequestEndpoint($link);
            }
        }
    }
}
