/**
 * DFU Loader applied to a single DOM Element representing an upload field
 */
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';
import DFU from '../js/common.js';
export default function DFULoader(opts) {

  this.uploadElement = opts.uploadElement;

  this.init = function() {};

  this.handle = function() {

    this.uploadElement.dfu = new DFU();
    this.uploadElement.dfu.init();

    const config = JSON.parse(this.uploadElement.dataset.config);
    const id = this.uploadElement.id;
    const uploadType = this.uploadElement.dataset.uploadType;
    // default httpMethod is post
    let httpMethod = config.request.method ? config.request.method : 'POST';
    let formData = true;
    let bundle = false;
    switch (httpMethod) {
      case 'PUT':
        formData = false;
        break;
    }

    let meta = {};
    if(typeof config.request.params == 'object') {
      meta = config.request.params;
    }

    const maxFileSize = config.validation.sizeLimit ? config.validation.sizeLimit : null;
    const maxNumFiles = config.validation.itemLimit ? config.validation.itemLimit : null;
    const minNumFiles = null;
    const allowedFileTypes = config.validation.acceptFiles ? config.validation.acceptFiles.split(',') : ['image/*' ];// default to images

    const maxImageWidth = config.validation.image.maxWidth ? config.validation.image.maxWidth : 0;
    const maxImageHeight = config.validation.image.maxHeight ? config.validation.image.maxHeight : 0;
    const minImageWidth = config.validation.image.minWidth ? config.validation.image.minWidth : 0;
    const minImageHeight = config.validation.image.minHeight ? config.validation.image.minHeight : 0;

    const restrictions = {
      maxFileSize: maxFileSize,
      maxNumberOfFiles: maxNumFiles,
      minNumberOfFiles: minNumFiles,
      allowedFileTypes: allowedFileTypes
    };

    const notificationUrl = config.urls.notificationUrl ? config.urls.notificationUrl : null;
    const preSignUrlForFile = config.urls.presignUrl ? config.urls.presignUrl : null;

    const uppy = new Uppy({
      id: 'uppy-' + id,
      autoProceed: false,
      allowMultipleUploadBatches: true,
      debug: false,
      meta: meta,
      restrictions: restrictions
    }).use(
      Dashboard, {
        id: 'dashboard-' + id,
        target: this.uploadElement.querySelector('.dashboard'),
        inline: true,
        width: '100%',
        height: '370px',
        waitForThumbnailsBeforeUpload: true,
        showLinkToFileUploadResult: false,
        proudlyDisplayPoweredByUppy: false,
        showProgressDetails: true,
        replaceTargetContent: true,
        hideProgressAfterFinish: true,
        note: '',
        doneButtonHandler: null
      }
    ).use(
      XHRUpload, {
        method: httpMethod,
        formData: formData,
        bundle: bundle,
        fieldName: this.uploadElement.dataset.name,
        endpoint: config.request.endpoint
      }
    );

    uppy.on('upload-success', (file, response) => {

      let uri = '';
      let endpoint = '';
      try {
        endpoint = file.xhrUpload.endpoint ? file.xhrUpload.endpoint : '';
      } catch (e) {
        // no endpoint
      }
      if(endpoint) {
        uri = endpoint;
      } else if(response.body.uuid) {
        uri = response.body.uuid;
      }
      if(notificationUrl) {
        // notify success
        this.uploadElement.dfu.notify(true, file, response, uri, notificationUrl);
      }
      // Append field when a uri is available
      if(uri) {
        this.uploadElement.dfu.appendField( this.uploadElement, file.id, uri );
      }
    });


    uppy.on('upload-error', (file, response) => {
      let uri = '';
      let endpoint = '';
      try {
        file.xhrUpload.endpoint ? file.xhrUpload.endpoint : '';
      } catch (e) {
        // no endpoint
      }
      if(endpoint) {
        uri = endpoint;
      } else if(response.body.uuid) {
        uri = response.body.uuid;
      }
      if(notificationUrl) {
        // notify error
        this.uploadElement.dfu.notify(false, file, response, uri, notificationUrl);
      }
      // Single upload error
      this.uploadElement.dfu.removeField( this.uploadElement, file.id );
    });

    uppy.on('error', (result) => {
      // all error
      this.uploadElement.dfu.handleUnblock(this.uploadElement);
    });

    uppy.on('complete', (result) => {
      if(notificationUrl) {
        // ping completion url
        this.uploadElement.dfu.notifyComplete(result, notificationUrl);
      }
      // all complete
      this.uploadElement.dfu.handleUnblock(this.uploadElement);
    });

    uppy.on('cancel-all', (result) => {
      // all cancelled
      this.uploadElement.dfu.handleUnblock(this.uploadElement);
    });

    uppy.on('file-removed', (file, reason) => {
      // a file was removed
      const items = uppy.getFiles();
      if(items.length == 0) {
        // all files removed
        this.uploadElement.dfu.handleUnblock(this.uploadElement);
      }
    });

    uppy.on('file-added', (file) => {

      // block submit
      this.uploadElement.dfu.handleSubmit(this.uploadElement);

      // update pre-signed URLs if required
      if(preSignUrlForFile) {

        // initially clear the endpoint for this file
        uppy.setFileState(file.id, {
          xhrUpload: {
            ...file.xhrUpload,
            endpoint: ''
          }
        });

        this.uploadElement.dfu.setPresignedUrl(
          // the file
          file,
          // URL to get presigned URLs from
          preSignUrlForFile,
          // callback to set pre-signed URL
          function(file, preSignedUrl) {
            if(preSignedUrl) {
              uppy.setFileState(file.id, {
                xhrUpload: {
                  ...file.xhrUpload,
                  endpoint: preSignedUrl
                }
              });
            } else {
              // failed to get a presigned URL
              uppy.removeFile(file.id);
              uppy.info({
                message: config.messages.fileCannotBeUploadedError,
                type: 'warning',
                duration: 7500
              });
            }
          }
        );
      }

      // set required file meta
      var meta = {};
      meta[ config.request.uuidName ] = file.id;
      uppy.setFileMeta( file.id, meta );

      if( this.uploadElement.dfu.isImage(file.data.type)) {

        // handle image dimension validation
        let data = file.data;
        let url = URL.createObjectURL(data);
        let image = new Image();
        image.src = url;
        image.onload = () => {

          let remove = false;
          let message = config.messages.dimensionsMismatchError;

          if(maxImageWidth > 0 && image.width > maxImageWidth) {
            message = config.messages.maxWidthImageError;
            remove = true;
          } else if(maxImageHeight > 0 && image.height > maxImageHeight) {
            message = config.messages.maxHeightImageError;
            remove = true;
          } else if(minImageWidth > 0 && image.width < minImageWidth) {
            message = config.messages.minWidthImageError;
            remove = true;
          } else if(minImageHeight > 0 && image.height < minImageHeight) {
            message = config.messages.minHeightImageError;
            remove = true;
          }

          if(remove) {
            uppy.removeFile(file.id);
            uppy.info({
              message: message,
              type: 'error',
              duration: 7500
            });
            URL.revokeObjectURL(url);
          }

        };
      }

    });

    let ev = new Event('uploaderReady');
    this.uploadElement.dispatchEvent(ev);

  };

}
