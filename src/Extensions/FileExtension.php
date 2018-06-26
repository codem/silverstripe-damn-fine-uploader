<?php
namespace Codem\DamnFineUploader;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\Assets\File;
use SilverStripe\Forms\Fieldlist;
use SilverStripe\Core\Config\Config;

class FileExtension extends DataExtension {

  private static $db = [
    'DFU' => 'Varchar(255)',
  ];

  private static $indexes = [
    'DFU' => ['type' => 'unique', 'columns' => ['DFU'] ]
  ];

  /**
   * Given a uuid of a file and the form's security id, retrieve an uploaded file
   * @param string $uuid the file uuid sent by back on upload as newUuid and submitted with the form
   * @param string $form_security_token the Security Token value from the form, sent to the uploader with each upload
   * @param boolean $unstrust when true (the default), the uploader token will be removed when the file is retrieved. Warning: this will mean you can no longer retrieve the file using this method again.
   */
  public function getByDfuToken($uuid, $form_security_token, $untrust = true) {
    $token = $uuid . "|" . $form_security_token;
    $file = File::get()->filter(["DFU" => $token])->first();
    if(!empty($file->ID) && $untrust) {
      $file->DFU = null;
      $file->write();
    }
    return $file;
  }

}
