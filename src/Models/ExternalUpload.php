<?php

namespace Codem\DamnFineUploader;

use SilverStripe\ORM\DataObject;

/**
 * Represents an external upload
 * @author James
 * @property ?string $ServiceName
 * @property ?string $ServiceTitle
 * @property string $Title
 * @property ?string $Description
 * @property bool $IsSuccess
 * @property int $UploadSize
 * @property ?string $UploadType
 * @property ?string $UploadHash
 * @property ?string $UploadUri
 * @property ?string $UploadSrc
 * @property ?string $UploadBatchId
 */
class ExternalUpload extends DataObject
{

    private static string $table_name = "ExternalUpload";

    private static string $singular_name = "An upload to an external service";

    private static string $plural_name = "Uploads to an external service";

    private static array $db = [
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

    private static array $indexes = [
        'ServiceName' => true,
        'ServiceUpload' => [
            'type' => 'unique',
            'columns' => [ 'UploadHash', 'ServiceName' ]
        ]
    ];

    private static array $summary_fields = [
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
        return $fields->makeReadonly();
    }

}
