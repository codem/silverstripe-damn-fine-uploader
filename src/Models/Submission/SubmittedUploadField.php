<?php

namespace Codem\DamnFineUploader;

use SilverStripe\UserForms\Model\Submission\SubmittedFormField;
use SilverStripe\Assets\File;

/**
 * Base Submitted Upload Field record
 * You should not instantiate this class
 * @method \SilverStripe\ORM\HasManyList<\SilverStripe\Assets\File> Files()
 */
class SubmittedUploadField extends SubmittedFormField
{
    use SubmittedDamnFineUploader;

    private static string $singular_name = 'Submitted drag & drop file upload field';

    private static string $plural_names = 'Submitted drag & drop file upload fields';

    /**
     * Defines the database table name
     */
    private static string $table_name = 'SubmittedUploadField';

    private static array $has_many = [
        'Files' => File::class
    ];

    private static array $owns = [
        'Files'
    ];

    private static array $cascade_deletes = [
        'Files'
    ];
}
