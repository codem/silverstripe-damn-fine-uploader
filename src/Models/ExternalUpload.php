<?php

namespace Codem\DamnFineUploader;

use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;

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
class ExternalUpload extends DataObject implements PermissionProvider
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
        'UploadBatchId' => 'Varchar(255)',
        'UploadSrcRecordId' => 'Int'
    ];

    private static array $indexes = [
        'ServiceName' => true,
        'ServiceUpload' => [
            'type' => 'unique',
            'columns' => [ 'UploadHash', 'ServiceName' ]
        ],
        'UploadSrcRecordId' => true,
        'IsSuccess' => true
    ];

    private static array $summary_fields = [
        'Title' => 'Name of upload',
        'Created.Nice' => 'Created',
        'UploadType' => 'File type of upload',
        'UploadHash' => 'Hash/token for the upload',
        'UploadSrc' => 'Source URL where upload took place'
    ];

    private static array $field_labels = [
        'ServiceName' => 'Service name',
        'ServiceTitle' => 'Service title',
        'Title' => 'Name of upload',
        'Description' => 'Description of upload',
        'IsSuccess' => 'Success?',
        'UploadSize' => 'Size in bytes',
        'UploadType' => 'File type of upload',
        'UploadHash' => 'Hash/token for the upload',
        'UploadUri' => 'Destination of upload',
        'UploadSrc' => 'Source URL where upload took place',
        'UploadBatchId' => 'Upload batch identifier',
        'UploadSrcRecordId' => 'Upload page (if applicable)'
    ];


    private static string $default_sort = "Created DESC";

    /**
     * @inheritdoc
     * All fields in this record are readonly
     */
    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        return $fields->makeReadonly();
    }

    /**
     * @inheritdoc
     */
    public function canDelete($member = null)
    {
        return Permission::checkMember($member, "EXTERNAL_UPLOAD_DELETE");
    }

    /**
     * @inheritdoc
     */
    public function canEdit($member = null)
    {
        return Permission::checkMember($member, "EXTERNAL_UPLOAD_VIEW");
    }

    /**
     * @inheritdoc
     */
    public function canCreate($member = null, $context = [])
    {
        return false;
    }

    /**
     * Return permissions this record provides
     */
    public function providePermissions()
    {
        return [
            'EXTERNAL_UPLOAD_VIEW' => [
                'name' => _t('DamnFineUploader.PERMISSION_EDIT_UPLOAD_PAGE', 'View external upload records'),
                'category' => _t('DamnFineUploader.PERMISSIONS_CATEGORY', 'Upload page'),
                'sort' => 100
            ],
            'EXTERNAL_UPLOAD_DELETE' => [
                'name' => _t('DamnFineUploader.PERMISSION_EDIT_UPLOAD_PAGE', 'Delete external upload records'),
                'category' => _t('DamnFineUploader.PERMISSIONS_CATEGORY', 'Upload page'),
                'sort' => 100
            ],
        ];
    }

}
