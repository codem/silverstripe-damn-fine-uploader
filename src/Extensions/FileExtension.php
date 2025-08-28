<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Forms\FieldList;
use SilverStripe\ORM\DataExtension;
use SilverStripe\Assets\File;

/**
 * @property ?string $DFU
 * @property bool $IsDfuUpload
 * @property int $SubmittedUploadFieldID
 * @method \Codem\DamnFineUploader\SubmittedUploadField SubmittedUploadField()
 * @extends \SilverStripe\ORM\DataExtension<(\SilverStripe\Assets\File & static)>
 */
class FileExtension extends DataExtension
{
    private static array $db = [
        'DFU' => 'Varchar(255)',
        'IsDfuUpload' => 'Boolean',
    ];

    /**
     * Add default values to database
     */
    private static array $defaults = [
        'IsDfuUpload' => 0
    ];

    /**
     * If the file was submitted via a UserDefinedFormController
     * this field will contain the field ID
     */
    private static array $has_one = [
        'SubmittedUploadField' => SubmittedUploadField::class
    ];

    private static array $indexes = [
        'DFU' => ['type' => 'unique', 'columns' => ['DFU'] ]
    ];

    /**
     * Modify CMS fields for this file record
     */
    public function updateCMSFields(FieldList $fields)
    {
        $fields->removeByName('SubmittedUploadFieldID');
    }

}
