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

There are three methods that Extensions can use:

1. `updateUploadForm` to modify the form
1. `handleUploadedFiles` to handle successfully uploaded files and
1. `handleFailedUpload` to handle failed submissions.

As can be seen, uploads are tied to the form `SecurityToken` value
