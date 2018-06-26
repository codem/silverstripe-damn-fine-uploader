'use strict';

import qq from 'fine-uploader';
import fineuploadergallery_css from 'fine-uploader/fine-uploader/fine-uploader-gallery.min.css';
import DFU from '../js/common.js';
import dfu_ui_css from '../styles/ui.css';

const dfu_uploaders_ui = Array.from(document.getElementsByClassName('dfu-uploader-ui'));

if(dfu_uploaders_ui) {
  var dfu = new DFU();
  dfu.init();
  for(const e of dfu_uploaders_ui) {
    try {
      var config = JSON.parse(e.dataset.config);
      config.element = document.getElementById(e.id);
      config.template = "qq-template-" + e.id;
      config.callbacks = {
        onComplete: function(id, name, responseJSON, xhr) {
          dfu.onComplete(e, id, name, responseJSON, xhr);
        },
        onStatusChange: function(id, oldStatus, newStatus) {
          dfu.onStatusChange(e, id, oldStatus, newStatus);
        }
      };
      var uploader = new qq.FineUploader(config);
    } catch (e) {
      console.error(e);
    }
  }
}
