'use strict';
const dfu_uploaders_ui = Array.from(document.getElementsByClassName('dfu-uploader-ui'));
console.log('ui');
console.log(dfu_uploaders_ui);
if(dfu_uploaders_ui) {
  for(const e of dfu_uploaders_ui) {
    try {
      var config = JSON.parse(e.dataset.config);
      config.element = document.getElementById(e.id);
      config.template = "qq-template-" + e.id;
      console.log(config);
      var uploader = new qq.FineUploader(config);
    } catch (e) {
      console.error(e);
    }
  }
}
