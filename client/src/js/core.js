'use strict';

import qq from 'fine-uploader/lib/core';
import DFU from '../js/common.js';
import dfu_core_css from '../styles/core.css';

const dfu_uploaders_core = Array.from(document.getElementsByClassName('dfu-uploader-core'));
if(dfu_uploaders_core) {
  var dfu = new DFU();
  dfu.init();
  for(const e of dfu_uploaders_core) {
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
      var uploader = new qq.FineUploaderBasic(config);
    } catch (e) {
      console.error(e);
    }
  }
}
