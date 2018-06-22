'use strict';
const dfu_uploaders_core = Array.from(document.getElementsByClassName('dfu-uploader-core'));
console.log('core');
console.log(dfu_uploaders_core);
if(dfu_uploaders_core) {
  for(const e of dfu_uploaders_core) {
    try {
      var config = JSON.parse(e.dataset.config);
      config.element = document.getElementById(e.id);
      config.template = "qq-template-" + e.id;
      console.log(config);
      var uploader = new qq.FineUploaderBasic(config);
    } catch (e) {
      console.error(e);
    }
  }
}
