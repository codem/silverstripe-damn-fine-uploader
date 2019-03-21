## Fineuploader fields

This section documents the Fineuploader fields. You should consider these fields deprecated due to the Fineuploader project becoming abandoned, they will be removed in a future revision. Use the UppyField instead.

### FineUploaderCoreField
Provides a core upload field, with no UI.
```
use Codem\DamnFineUploader\FineUploaderCoreField;
//...
$upload_field_core = FineUploaderCoreField::create('MyFieldName', 'Core Upload Field');
```

### FineUploaderField
Provides an upload field, with the standard FineUploader Gallery UI.
```
use Codem\DamnFineUploader\FineUploaderField;
//...
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

### Field templates/layout/colours

Field templates look like this at the moment. Feel free to apply your own styling.

![UI Field](../screenshots/ui-field.png "The basic UI field")

The core field is an upload field that does not use the UI variant of FineUploader

![Core Field](../screenshots/core-field.png "The basic Core field")

## Thanks
Many thanks to the [FineUploader team](https://fineuploader.com) for developing and supporting Fineuploader over its lifetime.
