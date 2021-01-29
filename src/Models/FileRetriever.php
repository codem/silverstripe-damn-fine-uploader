<?php

namespace Codem\DamnFineUploader;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\Fieldlist;
use SilverStripe\Versioned\Versioned;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;

class FileRetriever
{
    /**
      * Retrieves a list of all uploaded files based on the form input name ($key) provided, in the context of the current form/request
      * @param string $key the upload field input name
      * @param Form $form the form containing the upload field used to upload the forms
      * @param boolean $untrust when true (the default), the uploader token will be removed when the file is retrieved. Warning: this will mean you can no longer retrieve the file using this method again.
      * @return array
      * @throws \Exception
      */
    public static function getUploadedFilesByKey(string $key, Form $form, $untrust = true)
    {
        $controller = Controller::curr();
        if (!$controller) {
            throw new \Exception("No controller found");
        }
        $request = $controller->getRequest();
        $posted_uuids = $request->postVar($key);
        if (!is_array($posted_uuids)) {
            throw new \Exception("No file tokens were found in the request");
        }
        if(empty($posted_uuids)) {
            // not posted, possibly no file uploads made
            return [];
        }

        $form_security_token = $form->getSecurityToken();
        if (!$form_security_token) {
            throw new \Exception("The form does not have a token");
        }
        $token_value = $form_security_token->getValue();
        if(!$token_value) {
            throw new \Exception("The form does not contain a valid token");
        }

        $upload_tokens = [];
        foreach ($posted_uuids as $uuid) {
            // the token is the uuid concat'd with the form security token
            $upload_tokens[] = $uuid . "|" . $token_value;
        }

        // get all files with matching tokens
        $files = Versioned::get_by_stage(File::class, Versioned::DRAFT)
                    ->filter(
                        [
                            "DFU" => $upload_tokens,
                            "IsDfuUpload" => 1
                        ]
                    );

        $file_count = 0;
        if($files) {
            $file_count = $files->count();
        }

        if($file_count != count($upload_tokens)) {
            // ensure that all files in the request are found
            throw new \Exception("Some files could not be found");
        }

        $list = [];
        foreach($files as $file) {
            if ($untrust) {
                $file->DFU = null;
                $file->write();
            }
            // uploaded files should remain protected
            $file->protectFile();
            // Generate thumbnails, if possible
            if (class_exists(AssetAdmin::class)) {
                AssetAdmin::singleton()->generateThumbnails($file);
            }
            $list[] = $file;
        }

        return $list;
    }

    /**
     * Get a single file based on its generated uuid and the form security token used during the upload
     * @return mixed a SilverStripe\Assets\File or null, if the file could not be found
     */
    public static function getFile(string $uuid, string $token_value) {
        $upload_token = $uuid . "|" . $token_value;
        $file = Versioned::get_by_stage(File::class, Versioned::DRAFT)
                    ->filter(
                        [
                            "DFU" => $upload_token,
                            "IsDfuUpload" => 1
                        ]
                    )->first();
        return $file;
    }
}
