# Configuration

See below for a sample configuration.

You should override the default configuration in your project's yml configuration

```yaml
---
Name: my-damnfineuploader
After:
    - '#damnfineuploader'
---
Codem\DamnFineUploader\DamnFineUploaderField:
  # Used to create a uuid for uploads
  # Do not use this value, override this in your project configuration
  signing_key : 'SAMPLEONLY'

  # Can turn off file delete
  allow_delete : false

  # config for the frontend lib
  implementation:
    validation:
      acceptFiles: 'image/jpg,image/jpeg,image/png,image/webp'
      itemLimit: 3
      sizeLimit: 5242880
      image:
        # set some image resolution constraints
        maxWidth : 2560
        maxHeight : 1440
        minWidth: 1920
        minHeight: 1080
    debug: false
    deleteFile:
      forceConfirm: true
      method: 'POST'
```
