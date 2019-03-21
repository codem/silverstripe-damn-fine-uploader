# File upload module for SilverStripe 4

An upload field that can be used to upload files to a Silverstripe 4 website. Uses [Uppy](https://uppy.io/) to handle & submit client uploads.

> This module is not intended for use in the Silverstripe admin area or CMS, use UploadField for that.


## Browser support

The Uppy website provides [a list of supported browsers](https://uppy.io/docs/#Browser-Support)

## Installing

```
composer require codem/silverstripe-damn-fine-uploader
```

You will have to add  a ```repositories``` entry to your composer.json until the module makes its way into Packagist.

## Configuration

Have a look in ```_config/config.yml``` for various configuration options and see also [Default Configuration](./docs/en/003_configuration.md)

> Modify the ```signing_key``` value in your project configuration, along with anything else you like (e.g upload size limits)

The ```implementation``` entry can be used to add any configuration value supported by the field.

The Upload field itself sets some request-time configuration options, passed to the field.
+ 'messages'
+ 'form'
+ 'request' - specifically the method and the request endpoint
+ 'text'

## Fields

### UppyField

A file upload field can be created in the usual way within a Controller:

```
use Codem\DamnFineUploader\UppyField;
use Silverstripe\Forms\FieldList;
use Silverstripe\Forms\FormAction;
use Silverstripe\Forms\Form;
// ...

/**
 * In your template use $UploadForm to display this Form
 */
public function UploadForm()
{
    // create the field
    $upload_field = UppyField::create('MyUploadField', 'My Upload Field');
    $fields = FieldList::create(
        $upload_field
    );
    $actions = FieldList::create(
        FormAction::create('doAnUpload', 'Upload') // handle the form submission in doAnUpload()
    );
    $form = Form::create($this, 'UploadForm', $fields, $actions);
    return $form;
]

```

See [FineUploader Fields](./docs/en/004_fineuploader_fields.md) for documentation in regards to deprecated FineUploader fields.

### Editable fields for the silverstripe/userforms module

An ```EditableUppyField``` field is available for use in user generated forms. The field can be added in the usual userforms way and the following options are available:

+ Maximum file size (MB)
+ Upload folder target within the assets directory (default: Uploads)
+ Limit number of uploaded files
+ Option to use a year/month/day folder storage schema, under the selected folder

Submitted files are stored on submission and linked to a ```SubmittedUploadField``` record.

## TODO
+ Make the upload fields a bit nicer on the eye by default. You can use standard CSS to target the upload field elements and modify to your requirements.

## About FineUploader

This module was initially developed to use FineUploader as an upload solution. Unfortunately, during development the author of FineUploader abandoned that project.

Due to this, and rather than continue with a fork of FineUploader, the module switched to using [Uppy](https://uppy.io/) as an upload solution.

The originally developed FineUploader fields remain in this module but are considered deprecated and will be removed in an upcoming version.



Please add feature requests and bug reports to the Github issue tracker
