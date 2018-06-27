'use strict';

import qq from 'fine-uploader/lib/core';
import DFU from '../js/common.js';
import dfu_core_css from '../styles/core.css';

const dfu_uploaders_core = Array.from(document.getElementsByClassName('dfu-uploader-core'));
if(dfu_uploaders_core) {

  var dfu_core_upload_handler = function(upload_element) {

      var dfu = new DFU();
      dfu.init();

      var uploader;
      var button_id = upload_element.id + '-button';
      var config = JSON.parse(upload_element.dataset.config);
      var files = upload_element.getElementsByClassName('dfu-uploader-core-files')[0];
      config.element = document.getElementById(upload_element.id);
      config.button = document.getElementById(button_id);
      config.template = '';
      config.callbacks = {
        onStatusChange: function(id, oldStatus, newStatus) {
          dfu.onStatusChange(upload_element, qq, id, oldStatus, newStatus);
          var file = document.getElementById(upload_element.id + "-upload-" + id);
          if(file) {
            // some status changes can occur prior to onSubmit
            var msg = '';
            switch(newStatus) {
              case qq.status.UPLOAD_FAILED:
                msg = 'failed';
              case qq.status.CANCELED:
                msg = 'canceled';
              case qq.status.REJECTED:
                msg = 'rejected';
              case qq.status.DELETED:
                msg = 'deleted';
                break;
              default:
                // we don't care about these other status
                msg = '';
            }
            if(msg) {
              file.getElementsByClassName('msg')[0].textContent = msg;
            }
          }
        },
        // onError can be fired prior to onSubmit
        onError : function(id, name, errorReason, xhr) {
          window.alert(errorReason);
        },
        onValidate : function(data, button) {},
        onSubmit: function(id, file_name) {
          var fn = document.createElement('th');
          fn.setAttribute('class','filename');
          fn.textContent = file_name;

          var prg = document.createElement('td');
          prg.setAttribute('class','prg');
          var msg = document.createElement('td');
          msg.setAttribute('class','msg');
          msg.textContent = 'submitted';
          var ops = document.createElement('td');
          ops.setAttribute('class','ops');
          var file = document.createElement('tr');

          file.appendChild(fn);
          file.appendChild(prg);
          file.appendChild(msg);
          file.appendChild(ops);

          file.id = upload_element.id + "-upload-" + id;//tr
          files.appendChild(file);

          // append a remove button to the ops
          var rmv = document.createElement('button');
          rmv.type = 'button';
          rmv.setAttribute('class','remove');
          rmv.setAttribute('data-id', id);
          rmv.textContent = 'remove';
          rmv.onclick = function(evt) {
            // remove the input representing the file upload
            var id = this.getAttribute('data-id');
            if(uploader) {
              uploader.cancel(id);
            }
            dfu.removeField(upload_element, id);
            // remove the file element this is in
            var r = this.parentElement.parentElement;
            files.removeChild(r);
            return false;
          };
          ops.appendChild(rmv);

        },
        onSubmitDelete : function(id) {
          var file = document.getElementById(upload_element.id + "-upload-" + id);
          if(file) {
            files.removeChild(file);
          }
        },
        onUpload: function(id, file_name) {
          var progress = document.createElement('progress');
          progress.id = upload_element.id + "-progress-" + id;
          progress.setAttribute('max', 100);
          progress.setAttribute('value', 0);
          var file = document.getElementById(upload_element.id + "-upload-" + id);
          if(file) {
            // append progress bar to the relevant cell
            file.getElementsByClassName('prg')[0].appendChild(progress);
          }
        },
        onProgress: function(id, file_name, uploaded_bytes, total_bytes) {
          var progress = document.getElementById(upload_element.id + "-progress-" + id);
          var pc =  0;
          if (uploaded_bytes < total_bytes) {
            // in progress
            pc = (uploaded_bytes / total_bytes) * 100;
          } else {
            pc = 100;
          }
          var file = document.getElementById(upload_element.id + "-upload-" + id);
          if(file) {
            file.getElementsByClassName('msg')[0].textContent = 'uploading';
          }
          progress.setAttribute('value', pc);
          progress.textContent = pc;
        },
        onComplete: function(id, file_name, responseJSON, xhr) {
          dfu.onComplete(upload_element, id, name, responseJSON, xhr);
          var file = document.getElementById(upload_element.id + "-upload-" + id);
          if(file) {
            file.getElementsByClassName('msg')[0].textContent = 'complete';
          }
        }
      };
      uploader = new qq.FineUploaderBasic(config);
      return uploader;
  } //end function


  for(const e of dfu_uploaders_core) {
    try {
      dfu_core_upload_handler(e);
    } catch (e) {
      console.error(e);
    }
  }
}
