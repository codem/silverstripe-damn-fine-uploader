<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\TextareaField;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\FormAction;
use Silverstripe\Forms\Form;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Core\Convert;
use SilverStripe\UserForms\Model\EditableFormField\EditableFileField;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Permission;
use SilverStripe\Security\Member;
use Symbiote\MultiValueField\ORM\FieldType\MultiValueField;

/**
 * A page that handles file uploads
 * This page requires extension in code to handle file upload response to the user
 * as such it can only be created, edit and published by those with allowed permissions
 * @author James
 */
class UploadPage extends \Page implements PermissionProvider
{

    use CMSFieldConfigurator;
    use RestrictedUploadFolder;

    private static $db = [
        'MaxFileSizeMB' => 'Float',
        'SelectedFileTypes' => 'Text',
        'FileUploadLimit' => 'Int',
        'UseDateFolder' => 'Boolean',
        'FormFieldTitle' => 'Varchar(255)',
        'FormFieldDescription' => 'Text',
        'FormFieldRightTitle' => 'Varchar(255)',
        'FormUploadButtonTitle' => 'Varchar(255)',
    ];

    private static $has_one = [
        'Folder' => Folder::class,
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

    private static $table_name = 'DamnFineUploaderPage';

    /**
     * Singular name for CMS
     * @var string
     */
    private static $singular_name = 'A page that handles file uploads';

    /**
     * Plural name for CMS
     * @var string
     */
    private static $plural_name = 'Pages that handle file uploads';

    /**
     * @var string
     */
    private static $description = 'Allows multiple uploads, requires customisation in code.';

    /**
     * Check if this page can be published
     * Member needs the UPLOAD_PAGE_PUBLISH to create this page
     *
     * @param Member $member
     * @return bool
     */
    public function canPublish($member = null)
    {
        $can = parent::canPublish($member);
        if(!$can) {
            return $can;
        }
        return Permission::checkMember($member, "UPLOAD_PAGE_PUBLISH");
    }

    /**
     * Check if this page can be edited
     * Member needs the UPLOAD_PAGE_EDIT to create this page
     *
     * @param Member $member
     * @return bool
     */
    public function canEdit($member = null)
    {
        $can = parent::canEdit($member);
        if(!$can) {
            return $can;
        }
        return Permission::checkMember($member, "UPLOAD_PAGE_EDIT");
    }

    /**
     * Check if this page can be created
     * Member needs the UPLOAD_PAGE_CREATE to create this page
     *
     * @param Member $member
     * @param array $context
     * @return bool
     */
    public function canCreate($member = null, $context = [])
    {
        $can = parent::canCreate($member, $context);
        if(!$can) {
            return $can;
        }
        return Permission::checkMember($member, "UPLOAD_PAGE_CREATE");
    }

    /**
     * Return permissions this page provides
     */
    public function providePermissions()
    {
        return [
            'UPLOAD_PAGE_CREATE' => [
                'name' => _t('DamnFineUploader.PERMISSION_CREATE_UPLOAD_PAGE', 'Create upload pages'),
                'category' => _t('DamnFineUploader.PERMISSIONS_CATEGORY', 'Upload page'),
                'sort' => 100
            ],
            'UPLOAD_PAGE_EDIT' => [
                'name' => _t('DamnFineUploader.PERMISSION_EDIT_UPLOAD_PAGE', 'Edit upload pages'),
                'category' => _t('DamnFineUploader.PERMISSIONS_CATEGORY', 'Upload page'),
                'sort' => 100
            ],
            'UPLOAD_PAGE_PUBLISH' => [
                'name' => _t('DamnFineUploader.PERMISSION_PUBLISH_UPLOAD_PAGE', 'Publish upload pages'),
                'category' => _t('DamnFineUploader.PERMISSIONS_CATEGORY', 'Upload page'),
                'sort' => 100
            ],
        ];
    }

    /**
     * Uppy is the only supported field implementation for now
     */
    public function onBeforeWrite()
    {
        // Ensure a folder is created
        $this->createProtectedFolder();
        // call parent write handling
        parent::onBeforeWrite();
    }

    /**
     * CMS editing fields for configuration
     */
    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->addFieldToTab(
            'Root.Uploads',
            CompositeField::create(
                TextField::create(
                    'FormFieldTitle',
                    _t('DamnFineUploader.FORM_FIELD_TITLE', 'Form field title')
                ),
                TextareaField::create(
                    'FormFieldDescription',
                    _t('DamnFineUploader.FORM_FIELD_DESCRIPTION', 'Form field description')
                ),
                TextField::create(
                    'FormFieldRightTitle',
                    _t('DamnFineUploader.FORM_FIELD_RIGHT_TITLE', 'Form field right title')
                ),
                TextField::create(
                    'FormUploadButtonTitle',
                    _t('DamnFineUploader.FORM_FIELD_BUTTON_TITLE', 'Form upload button text')
                )
            )->setTitle(_t('DamnFineUploader.FIELD', 'Field text'))
        );

        $this->addGenericFields(
            $fields,
            _t('DamnFineUploader.TAB_UPLOADS', 'Uploads')
        );

        return $fields;
    }
}
