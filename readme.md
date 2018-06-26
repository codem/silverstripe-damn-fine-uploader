# FineUploader module for SilverStripe 4

This module provides two upload fields that can be used to upload files to a  Silverstripe website.

> It's not intended for use in the Silverstripe admin area or CMS, use UploadField for that.

## Installing

```composer require codem/silverstripe-damn-fine-uploader```

## Configuration

Have a look in ```_config/config.yml``` for various configuration options. The 'fineuploader' entry can be used to add any configuration [supported by FineUploader](https://docs.fineuploader.com/branch/master/api/options.html).

The Upload fields sets some configuration options:
+ 'messages'
+ 'form'
+ 'request' - specifically the method and the request endpoint
+ 'text'

## Fields

### FineUploaderCoreField
Provides a core upload field, with no UI.
```
$upload_field_core = FineUploaderCoreField::create('MyFieldName', 'Core Upload Field');
```

### FineUploaderField
Provides an upload field, with the standard FineUploader Gallery UI.
```
$upload_field = FineUploaderField::create('MyUploadField', 'Upload Field');
```

## Handling file submissions from forms
See [Handling Uploaded Files](./docs/en/001_handling_uploaded_files.md)

## Advanced
### Custom Request endpoint
You can override the request endpoint and options, e.g to direct uploads to another path or via another method
```
// pass an array $config matching request options
// https://docs.fineuploader.com/branch/master/api/options.html#request
$upload_field->setOptionRequest(
  $config
);
```

### Custom Delete endpoint
By default the field comes with no file delete handling. You can set a custom delete endpoint and it's up to you to handle the checks and balances around this (i.e roll your own).
```
// pass an array $config matching deleteFile options
// https://docs.fineuploader.com/branch/master/api/options.html#deleteFile
$upload_field->setOptionDelete(
  $config
);
```

## TODO
+ Basic demo with working callbacks
+ Progress bar
+ Locking submit button until all uploads have succeeded
+ Alerts when > max file uploads have been uploaded
