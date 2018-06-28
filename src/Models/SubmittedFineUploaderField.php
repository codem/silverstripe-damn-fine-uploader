<?php
namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\Submission\SubmittedFormField;
use SilverStripe\Assets\File;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\Control\Controller;

class SubmittedFineUploaderField extends SubmittedFormField {

    private static $many_many = array(
        'Files' => File::class
    );

    private static $security_token_name = "SecurityID";

    /**
     * Defines the database table name
     * @var string
     */
    private static $table_name = 'SubmittedFineUploaderField';

    protected function getSecurityTokenValue() {
      $controller = Controller::curr();
      $request = $controller->getRequest();
      $token_name = $this->config()->get('security_token_name');
      $token_value = $request->postVar($token_name);
      return $token_value;
    }

    /**
     * Handle incoming uuids from the form, use the uuid and the form security token to retrieve the file
     * Note that this does not publish the file
     *
     * @return SubmittedFineUploaderField
     */
    public function setValue($uuids) {
      if(!empty($uuids) && is_array($uuids) && ($token_value = $this->getSecurityTokenValue())) {
        foreach($uuids as $uuid) {
          $file = File::create()->getByDfuToken($uuid, $token_value);
          if(!empty($file->ID)) {
            $this->Files()->add($file);
            $file->protectFile();
          }
        }
      }
      return $this;
    }

    /**
     * Return the value of this field for inclusion into things such as
     * reports.
     *
     * @return string
     */
    public function getFormattedValue() {
        $title = _t('DamnFineUploader.DOWNLOAD_FILE', 'Download file');
        $files = array();
        foreach ($this->Files() as $i => $file) {
            $files[] = sprintf(
                '%s - <a href="%s" target="_blank">%s</a>',
                $file->Name, $file->URL, $title
            );
        }
        return DBField::create_field('HTMLText', implode('<br/>', $files));
    }

    /**
     * Return the value for this field in the CSV export.
     *
     * @return string
     */
    public function getExportValue() {
        $links = array();
        foreach ($this->Files() as $file) {
            $links[] = $file->getAbsoluteURL();
        }
        return implode('|', $links);
    }
}
