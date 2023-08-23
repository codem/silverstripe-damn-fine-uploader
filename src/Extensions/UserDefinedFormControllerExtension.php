<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Core\Extension;

class UserDefinedFormControllerExtension extends Extension
{
    /**
     * Ensure files attached to a SubmittedUploadField are applied to the attachments array
     * for inclusion in the email
     * @return void
     */
    public function updateEmailData($emailData, &$attachments) {
        $fields = isset($emailData['Fields']) ? $emailData['Fields'] : false;
        if($fields) {
            foreach($fields as $field) {
                if(!($field instanceof SubmittedUploadField)) {
                    continue;
                }
                /** @var \SilverStripe\ORM\HasManyList */
                $files = $field->getSubmittedFiles();
                foreach($files as $file) {
                    $attachments[] = $file;
                }
            }
        }
    }
}
