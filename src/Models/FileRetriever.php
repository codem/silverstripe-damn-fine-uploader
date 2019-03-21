<?php
namespace Codem\DamnFineUploader;

use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\Assets\File;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\Fieldlist;
use SilverStripe\Core\Config\Config;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Control\Controller;

class FileRetriever
{
    /**
      * Retrieves a list of all uploaded files by key provided, in the context of the current form/request
      * Given a uuid of a file and the form's security id, retrieve an uploaded file
      * Note that this retrieves a file from the DRAFT stage as it may not be public
      * @param string $key the upload field input name
      * @param Form $form
      * @param boolean $unstrust when true (the default), the uploader token will be removed when the file is retrieved. Warning: this will mean you can no longer retrieve the file using this method again.
      */
    public static function getUploadedFilesByKey($key, Form $form, $untrust = true)
    {
        $controller = Controller::curr();
        if (!$controller) {
            return false;
        }
        $request = $controller->getRequest();
        $posted_uuids = $request->postVar($key);
        if (!is_array($posted_uuids)) {
            return false;
        }

        $form_security_token = $form->getSecurityToken();
        if (!$form_security_token) {
            return false;
        }
        $token_value = $form_security_token->getValue();

        $list = [];
        foreach ($posted_uuids as $uuid) {
            // the token is the uuid concat'd with the form security token
            $upload_token = $uuid . "|" . $token_value;
            $file = Versioned::get_by_stage(File::class, Versioned::DRAFT)
              ->filter(["DFU" => $upload_token])
              ->first();
            if (!empty($file->ID)) {
                $list[] = $file;
                if ($untrust) {
                    $file->DFU = null;
                    $file->writeToStage(Versioned::DRAFT);
                }
            }
        }

        return $list;
    }
}
