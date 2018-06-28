<?php
namespace Codem\DamnFineUploader;
use SilverStripe\Core\Extension;
use SilverStripe\Control\Controller;

class UserFormExtension extends Extension {

  public function updateForm($fields) {
    $fields = $this->owner->Fields()->dataFields();
    foreach($fields as $field) {
      if($field instanceof FineUploaderCoreField || $field instanceof FineUploaderField) {
        // ensure the field has the current form's SecurityToken
        $field->setSecurityToken( $this->owner->getSecurityToken() );
        // and the request endpoint, now that a Form is available on the field
        $link = Controller::join_links( $this->owner->getController()->Link('Form'), $field->UploadLink() );
        //https:\/\/www.nsw.gov.au\/your-government\/ministers\/minister-for-resources-minister-for-energy-and-utilities-minister-for-the-arts-and-vice-president-of-the-executive-council\/Form\/field\/EditableTextField_4e49d\/upload
        $field->setRequestEndpoint($link);
      }
    }
  }

}
