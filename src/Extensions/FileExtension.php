<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Forms\FieldList;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\Assets\File;
use SilverStripe\Core\Config\Config;
use SilverStripe\Versioned\Versioned;

class FileExtension extends DataExtension
{
    private static $db = [
        'DFU' => 'Varchar(255)',
        'IsDfuUpload' => 'Boolean',
    ];

    /**
     * Add default values to database
     * @var array
     */
    private static $defaults = [
        'IsDfuUpload' => 0
    ];

    /**
     * If the file was submitted via a UserDefinedFormController
     * this field will contain the field ID
     */
    private static $has_one = [
        'SubmittedUploadField' => SubmittedUploadField::class
    ];

    private static $indexes = [
        'DFU' => ['type' => 'unique', 'columns' => ['DFU'] ]
    ];

    /**
     * Modify CMS fields for this file record
     */
    public function updateCMSFields(FieldList $fields)
    {
        $fields->removeByName('SubmittedUploadFieldID');
    }

    /**
     * @deprecated see FileRetriever::getUploadedFilesByKey() and FileRetriever::getFile()
     * This method will be removed in a future release
     * Given a uuid of a file and the form's security id, retrieve an uploaded file
     * Note that this retrieves a file from the DRAFT stage as it may not be public
     * @param string $uuid the file uuid sent by back on upload as newUuid and submitted with the form
     * @param string $form_security_token the Security Token value from the form, sent to the uploader with each upload
     * @param boolean $untrust when true (the default), the uploader token will be removed when the file is retrieved. Warning: this will mean you can no longer retrieve the file using this method again.
     */
    public function getByDfuToken($uuid, $form_security_token, $untrust = true)
    {
        $token = $uuid . "|" . $form_security_token;
        $file = Versioned::get_by_stage(File::class, Versioned::DRAFT)
              ->filter(["DFU" => $token])
              ->first();
        if (!empty($file->ID) && $untrust) {
            $file->DFU = null;
            $file->writeToStage(Versioned::DRAFT);
        }
        return $file;
    }
}
