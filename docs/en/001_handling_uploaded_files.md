# Handling uploaded files

Upon successful file upload from Uppy, a hidden input is added per upload with a unique one-time value that identifies each uploaded file.

The hidden inputs have a name attribute matching the id attribute of the field, to allow for easy file retrieval upon submission:
```
<input type="text" name="UploadFieldName[key]" value="value">
```

In the above example `UploadFieldName` is the name of the field, 'key' is an Uppy-generated index for each file uploaded and 'value' is the unique reference for the file uploaded.

When the form is submitted, the field value sent can be used to retrieve and manage the uploaded files on the backend using `FileRetriever`.

For an example of this see UploadPageController::handleUpload()

## Upload page

`src/Pages/UploadPage.php` and `src/Controllers/UploadPageController.php` provide a CMS page that can be added by users with specific permissions.

There are three methods that extensions can use:

1. `updateUploadForm` to modify the form
1. `handleUploadedFiles` to handle successfully uploaded files and
1. `handleFailedUpload` to handle failed submissions.

If the latter two extension methods return a HTTPResponse, that response will be returned from the controller. If not, the controller will complete the form submission and return a response based on the number of succcessful uploads matching the number of expected uploads.

### Extending

You can use the Injector API to provide your own controller handling, or create a subclass of UploadPage / UploadPageControllers to provide custom behaviour.
