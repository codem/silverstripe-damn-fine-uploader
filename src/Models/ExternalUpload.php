<?php

namespace Codem\DamnFineUploader;

use SilverStripe\ORM\DataObject;

/**
 * Represents an external upload
 * @author James
 */
class ExternalUpload extends DataObject
{

    /**
     * @var string
     */
    private static $table_name = "ExternalUpload";

    /**
     * @var string
     */
    private static $singular_name = "An upload to an external service";

    /**
     * @var string
     */
    private static $plural_name = "Uploads to an external service";

    /**
     * @var array
     */
    private static $db = [
        'ServiceName' => 'Varchar(255)',
        'ServiceTitle' => 'Varchar(255)',
        'Title' => 'Varchar(255)',
        'Description' => 'Text',
        'IsSuccess' => 'Boolean',
        'UploadSize' => 'Int',
        'UploadType' => 'Varchar(255)',
        'UploadHash' => 'Varchar(255)',
        'UploadUri' => 'Text',
        'UploadSrc' => 'Text',
        'UploadBatchId' => 'Varchar(255)'
    ];

    /**
     * @var array
     */
    private static $indexes = [
        'ServiceName' => true,
        'ServiceUpload' => [
            'type' => 'unique',
            'columns' => [ 'UploadHash', 'ServiceName' ]
        ]
    ];

    /**
     * @var array
     */
    private static $summary_fields = [
        'Title' => 'Title',
        'Created.Nice' => 'Created',
        'UploadHash' => 'Upload code',
        'UploadUri' => 'Upload URL'
    ];

    /**
     * @inheritdoc
     * All fields in this record are readonly
     */
    public function getCMSFields() {
        $fields = parent::getCMSFields();
        $fields = $fields->makeReadonly();
        return $fields;
    }

}
