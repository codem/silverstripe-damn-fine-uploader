# Handling uploaded files

Upon successful upload, a hidden input is added to the upload form via JavaScript with a value that identifies each uploaded file.

The hidden inputs have a name attribute matching the id attribute of the field, to allow for easy file retrieval upon submission:
```
<input type="text" name="Form_UploadForm_TestUploadField[$Ref]" value="$Identifier">
```
Where $Ref is a file reference set by the uploader (a number, a string) and the value is the token representing the file upload.

Upon submission to a controller, the submitted file identifies can be used to retrieve the uploaded files.
This is useful when a form submission accompanies a file upload.

## Example controller

```
use Codem\DamnFineUploader\UppyField;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\FormAction;
use Silverstripe\Forms\Form;
use SilverStripe\Assets\File;

class MyPageController extends PageController
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
     * Do something with the form data
     */
    public function doAnUpload(array $data, Form $form)
    {
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
        foreach ($file_ids as $uuid) {
            // returns a SilverStripe\Assets\File on success
            $record = $file->getByDfuToken($uuid, $token_value, true);
            if (!empty($record->ID)) {
                // file found
                // var_dump($record->ID . ":" . $record->Name);
            } else {
                // file not found
                // var_dump("File for {$uuid} not found");
            }
        }
    }
}

```

As can be seen, uploads are tied to the form CSRF token.

**Important**: the third parameter to ```getByDfuToken``` will cause the saved token to be removed from the file upon retrieval when 'true' (the default). This means that you will no longer be able to retrieve that file by the provided token again.

Once the file is retrieved, it can be used in your code (e.g link it to another relation).
