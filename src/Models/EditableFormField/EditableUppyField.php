<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\Folder;
use SilverStripe\UserForms\Model\EditableFormField;

/**
 * This class is retained for backwards compatibility
 */
class EditableUppyField extends EditableUploadField
{
    private static $hidden = true;
    private static $abstract = true;
    public function requireDefaultRecords()
    {
    }
}
