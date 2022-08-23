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
     * @var string
     */
    private static $singular_name = 'Submitted drag & drop file upload field';

    /**
     * @var string
     */
    private static $plural_names = 'Submitted drag & drop file upload fields';

    /**
     * Defines the database table name
     * @var string
     */
    private static $table_name = 'SubmittedUploadField';

    /**
     * @var array
     */
    private static $has_many = [
        'Files' => File::class
    ];

    /**
     * @var array
     */
    private static $owns = [
        'Files'
    ];

    /**
     * @var array
     */
    private static $cascade_deletes = [
        'Files'
    ];
}
