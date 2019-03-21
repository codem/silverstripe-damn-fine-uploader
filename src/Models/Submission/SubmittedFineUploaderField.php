<?php
namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\Submission\SubmittedFormField;
use SilverStripe\Assets\File;

/**
 * Submitted Field for FineUploader
 * @deprecated see readme.md
 */
class SubmittedFineUploaderField extends SubmittedFormField
{
    use SubmittedDamnFineUploader;

    /**
     * Defines the database table name
     * @var string
     */
    private static $table_name = 'SubmittedFineUploaderField';

    private static $many_many = [
        'Files' => File::class
    ];
}
