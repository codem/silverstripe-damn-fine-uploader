# Handling uploaded files

Upon successful upload, a hidden input is added to the upload form via JavaScript with a value that identifies each uploaded file.

The hidden inputs have a name attribute matching the id attribute of the field, to allow for easy file retrieval upon submission:
```
<input type="text" name="Form_UploadForm_TestUploadField[$Ref]" value="$Identifier">
```
Where $Ref is a file reference set by the uploader (a number, a string) and the value is the token representing the file upload.

Upon submission to a controller, the submitted file identifies can be used to retrieve the uploaded files.
This is useful when a form submission accompanies a file upload.

## Upload page

`src/Pages/UploadPage.php` and `src/Pages/UploadPageController.php` provide a CMS page that can be added by users with specific permissions.

There are three methods that Extensionss can use: `updateUploadForm` to modify the form, `handleUploadedFiles` to handle successfully uploaded files and `handleFailedUpload` to handle failed submissions.

As can be seen, uploads are tied to the form CSRF token.

**Important**: the third parameter to ```getByDfuToken``` will cause the saved token to be removed from the file upon retrieval when 'true' (the default). This means that you will no longer be able to retrieve that file by the provided token again.
