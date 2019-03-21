<?php
namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\Submission\SubmittedFormField;
use SilverStripe\Assets\File;

/**
 * Base Submitted Upload Field record
 * You should not instantiate this class
 */
class SubmittedUploadField extends SubmittedFormField
{
    use SubmittedDamnFineUploader;

    /**
     * Defines the database table name
     * @var string
     */
    private static $table_name = 'SubmittedUploadField';

    private static $many_many = [
        'Files' => File::class
    ];
}
