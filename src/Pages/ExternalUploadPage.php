<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;

/**
 * A page that handles file uploads to an external service
 * @author James
 */
class ExternalUploadPage extends UploadPage
{

    /**
     * @var array
     */
    private static $db = [
        'ServiceName' => 'Varchar(255)',// const SERVICE_NAME in the field subclass
    ];

    /**
     * @var array
     */
    private static $has_many = [
        'ExternalUploads' => ExternalUploads::class,
    ];

    /**
     * Add default values to database
     * @var array
     */
    private static $defaults = [
        'MaxFileSizeMB' => 0,
        'UseDateFolder' => 1,
        'FileUploadLimit' => 3,
        'FormFieldTitle' => 'Upload',
    ];

    private static $table_name = 'ExternalUploadPage';

    /**
     * Singular name for CMS
     * @var string
     */
    private static $singular_name = 'A page handling file uploads to external services';

    /**
     * Plural name for CMS
     * @var string
     */
    private static $plural_name = 'Pages handling file uploads to an external service';

    /**
     * @var string
     */
    private static $description = 'After page creation, choose an upload service';

    public function getCMSFields() {
        $fields = parent::getCmsFields();
        $serviceClasses = AbstractUppyExternalUploadField::getUploadServices();
        $fields->insertBefore(
            'FormFieldTitle',
            DropdownField::create(
                'ServiceName',
                _t('DamnFineUploader.SERVICE_NAME', 'Choose an external service'),
                $serviceClasses
            )->setEmptyString('')
        );
        return $fields;
    }

    public function addSaveLocationFields(FieldList $fields, string $tab) {
        // NOOP
    }

    /**
     * Get the upload field for the current service
     * @param array $args for the AbstractUppyExternalUploadField
     * @return AbstractUppyExternalUploadField|null
     */
    public function getUploadField($args = []) : ?AbstractUppyExternalUploadField {
        $uploadField = null;
        if($this->ServiceName) {
            $uploadField = AbstractUppyExternalUploadField::getUploadField($this->ServiceName, $args);
        }
        return $uploadField;
    }

}
