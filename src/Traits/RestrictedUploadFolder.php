<?php

namespace Codem\DamnFineUploader;

use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\UserForms\Control\UserDefinedFormAdmin;

/**
 * Apply folder restrictions to the upload field
 */
trait RestrictedUploadFolder {

    /**
     * Create the default upload folder and apply restrictions
     * @note when applied to EditableUploadField, this overrides {@link SilverStripe\UserForms\Model\EditableFormField\EditableFileField::createdProtectedFolder()}
     * and is called during field/page write (so no write called here)
     */
    public function createProtectedFolder(): void
    {
        $folder = $this->Folder();
        if(!$folder->exists()) {
            $suffix = bin2hex( random_bytes(4) );
            if($this instanceof SiteTree) {
                $folderName = "page-{$suffix}/uploads";
            } else if( $this instanceof EditableUploadField ) {
                $folderName = "form-{$suffix}/uploads";
            } else {
                $folderName = "uploads-{$suffix}";
            }
            $folder = UserDefinedFormAdmin::getFormSubmissionFolder($folderName);
            $this->FolderID = $folder->ID;
        }
    }

}
