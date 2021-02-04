<?php

namespace Codem\DamnFineUploader;

use SilverStripe\Assets\File;
use SilverStripe\Core\Convert;
use SilverStripe\ORM\DB;
use SilverStripe\Versioned\Versioned;

/**
 * Handle migrations due to obsoletions, deprecations or API changes
 */
trait Migrations
{
    protected function migrationDeprecateFineUploader() {
        $tables = [
            'EditableFineUploaderCoreField',
            'EditableFineUploaderCoreField_Live',
            'EditableFineUploaderCoreField_Versions',
            'SubmittedFineUploaderField_Files'
        ];
        DB::alteration_message("Executing migrationDeprecateFineUploader (turn this off in config if you no longer need it)", "changed");
        foreach ($tables as $table) {
            try {
                // obsolete deprecated/removed/unused FineUploader support
                DB::alteration_message("dont_require_table {$table}", "changed");
                DB::dont_require_table($table);
            } catch (\Exception $e) {
                DB::alteration_message($e->getMessage(), "error");
            }
        }
    }

    protected function migrationManyManyHasMany() {
        try {
            DB::alteration_message("Executing migrationManyManyHasMany (turn this off in config if you no longer need it)", "changed");
            /**
             * Handle API change in SubmittedUploadField from many_many to has_many
             * Updates each file found in SubmittedUploadField_Files to link the File to the Field
             */
            $records = DB::Query("SELECT ID, SubmittedUploadFieldID, FileID FROM SubmittedUploadField_Files");
            if(!$records) {
                throw new \Exception("No records found or query failed.");
            }
            foreach($records as $record) {
                if(empty($record['FileID'])) {
                    DB::alteration_message("FileID for record {$record['ID']} is empty, ignoring", "error");
                    continue;
                }
                if(empty($record['SubmittedUploadFieldID'])) {
                    DB::alteration_message("SubmittedUploadFieldID for record {$record['ID']} is empty, ignoring", "error");
                    continue;
                }
                $file = File::get()->ById($record['FileID']);
                if(!$file) {
                    DB::alteration_message("Ignoring file #{$record['FileID']} not found", "error");
                    continue;
                }
                if(!$file->IsDfuUpload) {
                    DB::alteration_message("File #{$file->ID} is not an upload, ignoring", "error");
                    continue;
                }

                if($file->SubmittedUploadFieldID) {
                    DB::alteration_message("File #{$file->ID} already linked to a SubmittedUploadField, ignoring", "error");
                    continue;
                }

                $file->SubmittedUploadFieldID = $record['SubmittedUploadFieldID'];
                $file->writeToStage(Versioned::DRAFT);
                DB::alteration_message("Marked File #{$file->ID} belonging to SubmittedUploadField #{$record['SubmittedUploadFieldID']}", "change");
            }
            DB::alteration_message("Renaming table to mark obsolete", "change");
            DB::query("RENAME TABLE `SubmittedUploadField_Files` TO `__obsolete_SubmittedUploadField_Files`");
        } catch (\Exception $e) {
            DB::alteration_message("Error running run_migration_manymany_to_hasmany: " . $e->getMessage(), "error");
        }
    }

    /*
     * Migrate mimetype selection to file type selection field
     * these are processed into mimetypes when the field is created
     * AllowedMimeType expected format:
        image/jpg
        image/jpeg
        image/gif
        image/png
        image/webp
    */
    protected function migrateAllowedMimeTypes() {

        $process_list = function($list, $table) {
            if(!$list) {
                DB::alteration_message("List is not a valid result set", "error");
            }
            $field = UppyField::create('migrateAllowedMimeTypes');
            foreach($list as $record) {
                if(!empty($record['AllowedMimeTypes']) && empty($record['SelectedFileTypes'])) {
                    // get extensions from these types
                    $pattern = '/\s{1,}/';
                    $types = preg_split($pattern, $record['AllowedMimeTypes']);
                    $exts = $field->getExtensionsForTypes($types);
                    DB::alteration_message("Migrating #{$record['ID']} AllowedMimeTypes to  SelectedFileTypes", "changed");
                    $new = json_encode($exts);
                    $sql = "UPDATE `" . Convert::raw2sql($table) . "` SET AllowedMimeTypes = NULL, SelectedFileTypes = '" . Convert::raw2sql($new) . "' WHERE ID = {$record['ID']}";
                    DB::alteration_message("Runnign sql {$sql}", "changed");
                    DB::query($sql);
                } else {
                    DB::alteration_message("Ignoring #{$record['ID']} AllowedMimeTypes to SelectedFileTypes, possibly already migrated", "info");
                }
            }
        };

        $list = DB::query("SELECT ID, AllowedMimeTypes, SelectedFileTypes FROM EditableUploadField");
        DB::alteration_message("Attempting to migrate EditableUploadField records", "changed");
        $process_list($list, "EditableUploadField");
        $list = DB::query("SELECT ID, AllowedMimeTypes, SelectedFileTypes FROM DamnFineUploaderPage");
        DB::alteration_message("Attempting to migrate UploadPage records", "changed");
        $process_list($list, "UploadPage");

    }

}
