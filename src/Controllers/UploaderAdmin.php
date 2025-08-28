<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Forms\GridField\GridFieldConfig;
use SilverStripe\Forms\LiteralField;

class UploaderAdmin extends ModelAdmin
{
    private static array $managed_models = [
        ExternalUpload::class
    ];

    private static string $menu_title = 'External Uploads';

    private static string $url_segment = 'external-uploads';

    private static string $menu_icon_class = 'font-icon-upload';

    public function getEditForm($id = null, $fields = null)
    {
        $form = parent::getEditForm($id, $fields);
        if($this->modelClass == ExternalUpload::class) {
            $form->Fields()->unshift(
                LiteralField::create(
                    'ExternalUploadDeleteNote',
                    '<p class="message warning">'
                    . htmlspecialchars(_t('DamnFineUploader.DELETE_NOT_REMOTE', 'Deleting a record here will not remove it from the external destination where it is hosted.'))
                    . '</p>'
                )
            );
        }

        return $form;
    }

    protected function getGridFieldConfig(): GridFieldConfig
    {
        $config = parent::getGridFieldConfig();
        $config->removeComponentsByType([
            \SilverStripe\Forms\GridField\GridFieldPrintButton::class,
            \SilverStripe\Forms\GridField\GridFieldExportButton::class,
            \SilverStripe\Forms\GridField\GridFieldImportButton::class
        ]);
        return $config;
    }

}
