<?php
/**
 * This is the test page for UppField acceptance tests
 * @author James
 */
use Codem\DamnFineUploader\UppyField;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\FormAction;
use Silverstripe\Forms\Form;
use SilverStripe\Assets\File;

/**
 * Test Page for inclusion in the CMS
 */
class UppyTestPage extends Page
{
    /**
     * Singular name for CMS
     * @var string
     */
    private static $singular_name = 'Test page for Uppy file upload testing';

    /**
     * Plural name for CMS
     * @var string
     */
    private static $plural_name = 'Test pages for Uppy file upload testing';
}

/**
 * Test Controller for handling acceptance test requests
 */
class UppyTestPageController extends PageController
{
    private static $allowed_actions = [
        'UploadForm',
        'doAnUpload'
    ];

    /**
     * A file upload form
     */
    public function UploadForm()
    {
        $upload_field = UppyField::create('UppyTestUploadField', 'Uppy Upload Field');
        $fields = FieldList::create(
            $upload_field
        );
        $actions = FieldList::create(
            FormAction::create('doAnUpload', 'Upload')
        );
        $form = Form::create($this, 'UploadForm', $fields, $actions);
        return $form;
    }


    /**
     * Handle the file upload
     * This simply returns the hash as found and a count of records so the test can pick these up
     */
    public function doAnUpload(array $data, Form $form)
    {
        try {
            header('Content-Type: text/plain');
            // get all the form fields
            $fields = $form->Fields();
            // get our upload field
            $upload_field = $fields->dataFieldByName('UppyTestUploadField');
            // get the field ID
            $name = $upload_field->getName();
            // uploaded file ids will be submitted in an array of values, the key being the field id.
            $file_ids = isset($data[$name]) ? $data[$name] : [];
            $file = singleton(File::class);
            // file uploads are tied to the form CSRF token
            $token = $form->getSecurityToken();
            // use the submitted file id and token to retrieve the file
            $token_value = $token->getValue();
            $found = 0;
            foreach ($file_ids as $uuid) {
                $record = $file->getByDfuToken($uuid, $token_value, true);
                if (!empty($record->ID)) {
                    // file found
                    print $uuid . "|" . $token_value . "\n";
                    $found++;
                }
            }
            print "Count:{$found}\n";
        } catch (Exception $e) {
        }
        exit;
    }
}
