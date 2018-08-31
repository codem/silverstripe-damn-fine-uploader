# Default configuration

See below for a sample configuration.

You should override this configuration in your project's yml configuration.

```
---
Name: damnfineuploader
---
Codem\DamnFineUploader\FineUploaderCoreField:
  # Used to create a uuid for uploads
  # Do not use this value, override this in your project configuration
  signing_key : 'SAMPLEONLY'

  # Deletion of uploads is allowed by default
  allow_delete : true

  # When true, unpublish uploaded files post-upload
  unpublish_after_upload : true

  # config for fineuploader
  # the key/values here match FineUploader documentation
  fineuploader:
    autoUpload: true
    maxConnections: 3
    multiple: true
    warnBeforeUnload: true
    form:
      interceptSubmit: false
    validation:
      itemLimit: 3
      sizeLimit: 5242880
      image:
        maxWidth : 2560
        maxHeight : 1440
    debug: true
    retry:
      enableAuto: false
    deleteFile:
      forceConfirm: true
      method: 'POST'
    scaling:
      defaultQuality: 90
```
