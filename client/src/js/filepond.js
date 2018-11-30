'use strict';

import * as FilePond from 'filepond';
import 'filepond/dist/filepond.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';

// Specific CSS
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Common
import DFU from '../js/common.js';
import dfu_filepond_css from '../styles/filepond.css';

if(FilePond.supported) {

  const dfu_uploaders_fp = Array.from(document.getElementsByClassName('dfu-uploader-fp'));

  if(dfu_uploaders_fp) {

    // Register plugins used
    FilePond.registerPlugin(
      FilePondPluginFileValidateSize,
      FilePondPluginFileValidateType,
      FilePondPluginImageExifOrientation,
      FilePondPluginImagePreview,
      FilePondPluginImageValidateSize,
      FilePondPluginFileMetadata
    );

    var dfu_fp_upload_handler = function(upload_element) {

      var dfu = new DFU();
      dfu.init();

      var uploader;
      var config = JSON.parse(upload_element.dataset.config);
      console.log(config);
      console.log('name:' + upload_element.dataset.name);

      // add initial metadata
      if(typeof config.request.params == 'object') {
        console.log('setting', config.request.params);
        const params = config.request.params;
        FilePond.setOptions({
            fileMetadataObject: params
        });
      }

      // instance options
      var opts = {
        name: upload_element.dataset.name + '_File',
        allowFileMetadata: true,
        allowDrop: true,
        allowBrowse: true,
        allowPaste: true,
        allowMultiple: (config.validation.itemLimit > 1),
        allowReplace: false,
        allowRevert: true,
        dropOnPage: false,
        dropOnElement: true,
        dropValidation: true,
        ignoredFiles: ['.ds_store','thumbs.db','desktop.ini','.directory'],
        server: config.request.endpoint,
        instantUpload: true,
        files: [],
        maxFiles: config.validation.itemLimit
      };
      //maxFileSize
      opts.maxFileSize - config.validation.sizeLimit;
      //acceptedFileTypes array
      opts.allowFileTypeValidation = true;
      opts.acceptedFileTypes = config.validation.acceptFiles.split(',');

      console.log('creating', opts);

      const input = upload_element.querySelector('input[type="file"]');
      const uploader = FilePond.create( input , opts );

      uploader.on('addfile', function(error, file) {
        if (error) {
            return;
        }
        file.setMetadata( config.request.uuidName, dfu.getFileIndentifier( file.filename ) );
      });

      console.log('returning');
      return uploader;

    };

    for(const elem of dfu_uploaders_fp) {
      try {
        dfu_fp_upload_handler(elem);
      } catch (e) {
        console.error(e);
      }
    }


  }

}
