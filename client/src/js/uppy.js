const Uppy = require('@uppy/core');
const XHRUpload = require('@uppy/xhr-upload');
const Dashboard = require('@uppy/dashboard');

require('@uppy/core/dist/style.css');
require('@uppy/dashboard/dist/style.css');

// Common
import DFU from '../js/common.js';
import dfu_uppy_css from '../styles/uppy.css';

const dfu_uploaders_uppy = Array.from(document.getElementsByClassName('dfu-uploader-uppy'));

if(dfu_uploaders_uppy) {

  var dfu_uppy_upload_handler = function(upload_element) {

    var dfu = new DFU();
    dfu.init();

    const config = JSON.parse(upload_element.dataset.config);
    const id = upload_element.id;
    var meta = {};
    if(typeof config.request.params == 'object') {
      meta = config.request.params;
    }

    const max_file_size = config.validation.sizeLimit ? config.validation.sizeLimit : null;
    const max_num_files = config.validation.itemLimit ? config.validation.itemLimit : null;
    const min_num_files = null;
    const allowed_file_types = config.validation.acceptFiles ? config.validation.acceptFiles.split(',') : ['image/*' ];// default to images

    const max_image_width = config.validation.image.maxWidth ? config.validation.image.maxWidth : 0;
    const max_image_height = config.validation.image.maxHeight ? config.validation.image.maxHeight : 0;
    const min_image_width = config.validation.image.minWidth ? config.validation.image.minWidth : 0;
    const min_image_height = config.validation.image.minHeight ? config.validation.image.minHeight : 0;

    const restrictions = {
      maxFileSize: max_file_size,
      maxNumberOfFiles: max_num_files,
      minNumberOfFiles: min_num_files,
      allowedFileTypes: allowed_file_types
    };

    const uppy = Uppy({
                      id: 'uppy-' + id,
                      autoProceed: false,
                      allowMultipleUploads: true,
                      debug: true,
                      meta: meta,
                      restrictions: restrictions
                  })
                  .use(
                    Dashboard, {
                      id: 'dashboard-' + id,
                      target: upload_element.querySelector('.dashboard'),
                      inline: true,
                      showLinkToFileUploadResult: false,
                      proudlyDisplayPoweredByUppy: false,
                      note: '' // TODO
                    }
                  )
                  .use(
                    XHRUpload, {
                      method: 'post',
                      formData: true,
                      bundle: false,// max allowed files here ?
                      fieldName: upload_element.dataset.name,
                      endpoint: config.request.endpoint
                    }
                  );

    uppy.on('upload-success', (file, response) => {
      // Single upload success
      if(response.body.uuid) {
        dfu.appendField( upload_element, file.id, response.body.uuid );
      }
    });


    uppy.on('upload-error', (file, response) => {
      // Single upload error
      dfu.removeField( upload_element, file.id );
    });

    uppy.on('error', (result) => {
      // all error
      dfu.handleUnblock(upload_element);
    });

    uppy.on('complete', (result) => {
      // all complete
      dfu.handleUnblock(upload_element);
    });

    uppy.on('cancel-all', (result) => {
      // all error
      dfu.handleUnblock(upload_element);
    });

    uppy.on('file-added', (file) => {

      // block submit
      dfu.handleSubmit(upload_element);

      // set required file meta
      var meta = {};
      meta[ config.request.uuidName ] = file.id;
      uppy.setFileMeta( file.id, meta );

      if( dfu.isImage(file.data.type)) {

        // handle image dimension validation
        const data = file.data;
        const url = URL.createObjectURL(data);
        const image = new Image();
        image.src = url;
        image.onload = () => {

          var remove = false;
          var message = '';

          if(max_image_width > 0 && image.width > max_image_width) {
            message = config.messages.maxWidthImageError;
            remove = true;
          } else if(max_image_height > 0 && image.height > max_image_height) {
            message = config.messages.maxHeightImageError;
            remove = true;
          } else if(min_image_width > 0 && image.width < min_image_width) {
            message = config.messages.minWidthImageError;
            remove = true;
          } else if(min_image_height > 0 && image.height < min_image_height) {
            message = config.messages.minHeightImageError;
            remove = true;
          }

          if(remove) {
            if(!message) {
              message = 'The image does not match the allowed dimensions';
            }
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

  };

  for(const elem of dfu_uploaders_uppy) {
    try {
      dfu_uppy_upload_handler(elem);
    } catch (e) {
      console.error(e);
    }
  }

}
