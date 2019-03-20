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

    var uploader;
    var config = JSON.parse(upload_element.dataset.config);
    var id = upload_element.id;
    var meta = {};
    if(typeof config.request.params == 'object') {
      meta = config.request.params;
    }

    var max_file_size = config.validation.sizeLimit ? config.validation.sizeLimit : null;
    var max_num_files = config.validation.itemLimit ? config.validation.itemLimit : null;
    var min_num_files = null;
    var allowed_file_types = config.validation.acceptFiles ? config.validation.acceptFiles.split(',') : ['image/*' ];// default to images

    var restrictions = {
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
                      proudlyDisplayPoweredByUppy: false
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
    });

    uppy.on('complete', (result) => {
      // all complete
    });

    uppy.on('file-added', (file) => {
      var meta = {};
      meta[ config.request.uuidName ] = file.id;
      uppy.setFileMeta( file.id, meta );
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
