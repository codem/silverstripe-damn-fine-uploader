<?php
namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\Submission\SubmittedFormField;
use SilverStripe\Assets\File;

/**
 * Submitted Field for FineUploader
 */
class SubmittedUppyField extends SubmittedFormField
{
    use SubmittedDamnFineUploader;

    /**
     * Defines the database table name
     * @var string
     */
    private static $table_name = 'SubmittedUppyField';

    private static $many_many = [
        'Files' => File::class
    ];
}
