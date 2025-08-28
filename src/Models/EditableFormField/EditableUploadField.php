<?php

namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\EditableFormField\EditableFileField;

/**
 * @note provides an EditableUploadField for the userforms module
 * returns a field based on the implementation, currently Uppy
 * @property int $FileUploadLimit
 * @property bool $UseDateFolder
 * @property ?string $Implementation
 * @mixin \NSWDPC\FileTypeManagement\Extensions\EditableFileFieldExtension
 */
class EditableUploadField extends EditableFileField
{
    use EditableDamnFineUploader;
    use CMSFieldConfigurator;
    use RestrictedUploadFolder;

    private static string $table_name = 'EditableUploadField';

    private static string $singular_name = 'File Upload Field - Drag and Drop';

    private static string $plural_name = 'File Upload Fields - Drag and Drop';

    private static array $db = [
        'FileUploadLimit' => 'Int',
        'UseDateFolder' => 'Boolean',
        'Implementation' => 'Varchar(16)'
    ];

    /**
     * Add default values to database
     */
    private static array $defaults = [
        'UseDateFolder' => 1,
        'FileUploadLimit' => 3,
        'Implementation' => DamnFineUploaderField::IMPLEMENTATION_UPPY
    ];

    /**
     * Uppy is the only supported field implementation for now
     */
    public function onBeforeWrite()
    {
        // RestrictedUploadFolder: ensure a folder is created
        $this->createProtectedFolder();
        // call parent write handling
        parent::onBeforeWrite();
        // set implementation on this field
        $this->Implementation = DamnFineUploaderField::IMPLEMENTATION_UPPY;
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $this->addGenericFields($fields, _t('DamnFineUploader.TAB_MAIN', 'Main'));
        return $fields;
    }

    /**
     * This method is retained for backwards compatibility
     * Use the \NSWDPC\FileTypeManagement\Extensions\FileTypeHandlingExtension::getFilteredAllowedExtensions() method. The extension is applied to this model via configuration.
     */
    public function getAllowedTypes(): array {
        return $this->getExtensionsForValidator();
    }

}
