# A file upload module for Silverstripe

An upload field that can be used to upload files to a Silverstripe website.

The frontend uses [Uppy](https://uppy.io/) to handle & submit client uploads.


## Features

+ a page model + controller allowing upload of one or more files to a chosen folder
+ support for userforms via an editable upload field
+ mime type validation via [silverstripe/mimevalidator](https://github.com/silverstripe/silverstripe-mimevalidator)
+ sub resource integrity (SRI) support for generated requirements
+ thumbnail generation of uploaded images for the silverstripe/asset-admin
+ min/max image dimension verification (via Uppy)
+ configurable file size restrictions
+ restrict uploads by one or more file types
+ restrict uploads by file size

> This module is not intended for use in the Silverstripe administration area, use the standard UploadField for that.

## Installing

```
composer require codem/silverstripe-damn-fine-uploader
```

[Use the latest version](https://github.com/codem/silverstripe-damn-fine-uploader/tags)

## Upload security

### In the module and administration area
+ Set asset folders chosen as upload targets to be restricted (i.e no public access)
+ Verify the above by attempting to access file URLs anonymously

### Generally
+ Use the `public` directory setup process available in more recent versions of Silverstripe
+ Ensure your web server is configured to not serve files that can be considered dangerous if they are served from an upload directory
+ Review upload fields periodically to ensure they are configured correctly

## Configuration

Have a look in ```_config/config.yml``` for various configuration options and see also [Default Configuration](./docs/en/003_configuration.md)

Modify the ```signing_key``` value in your project configuration, along with anything else you like (e.g upload size limits)

The ```implementation``` entry can be used to add any configuration value supported by the field.

## Fields

See [fields documentation](./docs/en/0001_fields.md) for examples.

## Browser support

All the good ones. The Uppy website provides [a list of supported browsers](https://uppy.io/docs/#Browser-Support)

Even though Uppy purports to support Internet Explorer, any bugs raised related to Internet Explorer will be closed.

## Issues

Please add feature requests and bug reports to the Github issue tracker

## Security

If you have found a security issue in this module, please email git {at} codem dot com dot au in the first instance.

## License

BSD-3-Clause

## Thanks

Thanks for reading, here's a silly meme:

<img src="./docs/screenshots/haha_fileuploads.jpg" height="200">
