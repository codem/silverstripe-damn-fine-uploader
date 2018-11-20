'use strict';

import qq from 'fine-uploader';
import fineuploadergallery_css from 'fine-uploader/fine-uploader/fine-uploader-gallery.min.css';
import DFU from '../js/common.js';
import dfu_ui_css from '../styles/ui.css';

const dfu_uploaders_ui = Array.from(document.getElementsByClassName('dfu-uploader-ui'));

if(dfu_uploaders_ui) {

  var dfu_ui_upload_handler = function(upload_element) {

    var dfu = new DFU();
    dfu.init();

    var uploader;
    var config = JSON.parse(upload_element.dataset.config);
    config.element = document.getElementById(upload_element.id);
    config.template = "qq-template-" + upload_element.id;
    config.callbacks = {
      onSubmit: function(id, file_name) {
        dfu.handleSubmit(upload_element);
      },
      onComplete: function(id, name, responseJSON, xhr) {
        dfu.handleComplete(upload_element, id, name, responseJSON, xhr);
      },
      onStatusChange: function(id, oldStatus, newStatus) {
        dfu.handleStatusChange(upload_element, qq, id, oldStatus, newStatus);
      },
      //ref: https://docs.fineuploader.com/branch/master/api/events.html#allComplete
      onAllComplete: function(succeeded, failed) {
        return dfu.handleAllComplete(upload_element, succeeded, failed);
      },
      onDeleteComplete : function(id) {
        dfu.handleDeleteComplete(upload_element, id);
      },
      onCancel : function(id, name) {
        return dfu.handleCancel(upload_element, qq, id, name, this);
      },
      onError: function(id, name, errorReason, xhr) {
        dfu.handleError(upload_element, qq, id, name, errorReason, xhr);
      }
    };

    uploader = new qq.FineUploader(config);
    return uploader;

  };

  for(const elem of dfu_uploaders_ui) {
    try {
      dfu_ui_upload_handler(elem);
    } catch (e) {
      console.error(e);
    }
  }


}
