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
     */
    public function createProtectedFolder(): void
    {
        if($this->exists()) {
            if($this instanceof SiteTree) {
                $folderName = "page-{$this->ID}/uploads";
            } else if( $this instanceof EditableUploadField ) {
                $folderName = "form-{$this->ParentID}/uploads-{$this->ID}";
            } else {
                $folderName = "uploads-{$this->ID}";
            }
            $folder = UserDefinedFormAdmin::getFormSubmissionFolder($folderName);
            $this->FolderID = $folder->ID;
        }
    }

}
