# Handling uploaded files
By default the upload fields will create a hidden input via JavaScript with a value that identifies each uploaded file.
The hidden inputs have a name attribute matching the id attribute of the field, to allow for easy file retrieval upon submission:
```
<input type="text" name="Form_UploadForm_TestUploadField[0]" value="$Identifier">
```

Upon submission to a controller, the submitted file identifies can be used to retrieve the uploaded files.
This is useful when a form submission accompanies a file upload.

```
use Codem\DamnFineUploader\FineUploaderField;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\FormAction;
use Silverstripe\Forms\Form;
use SilverStripe\Assets\File;

class MyPageController extends PageController {

  private static $allowed_actions = [
    'UploadForm',
    'doAnUpload'
  ];

  /**
   * A file upload form
   */
  public function UploadForm() {
    $upload_field = FineUploaderField::create('TestUploadField', 'Upload Field');
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
   * doAnUpload
   */
  public function doAnUpload(array $data, Form $form) {
    // get all the form fields
    $fields = $form->Fields();
    // get our upload field
    $upload_field = $fields->dataFieldByName('TestUploadField');
    // get the field ID
    $id = $upload_field->ID();
    // uploaded file ids will be submitted in an array of values, the key being the field id.
    $file_ids = isset($data[$id]) ? $data[$id] : [];
    $file = singleton(File::class);
    // file uploads are tied to the form CSRF token
    $token = $form->getSecurityToken();
    // use the submitted file id and token to retrieve the file
    $token_value = $token->getValue();
    foreach($file_ids as $uuid) {
      $record = $file->getByDfuToken($uuid, $token_value, true);
      if(!empty($record->ID)) {
        // file found
      } else {
        // file not found
      }
    }
  }

}

```

As can be seen, uploads are tied to the form CSRF token.

**Important**: the third parameter to ```getByDfuToken``` will cause the saved token to be removed from the file upon retrieval when 'true' (the default). This means that you will no longer be able to retrieve that file by the provided token again. Use the retrieved File ID in your code (e.g link it to another relation).
