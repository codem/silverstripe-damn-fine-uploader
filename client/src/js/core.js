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

      // template setup
      var files_container = upload_element.getElementsByClassName('dfu-uploader-core-files')[0];
      var template = upload_element.getElementsByClassName('dfu-uploader-core-template')[0];
      var init_template = function(tmpl, files_container) {
        var tmpl_container = tmpl.querySelector('[data-use="container"]');
        var container = files_container.appendChild(tmpl_container.cloneNode(false));
        container.setAttribute('class', 'dfu-uploader-container ' + tmpl_container.getAttribute('class'));
        return container;
      };
      var append_container_element = function(tmpl, parent_element, use_name, elem_text, elem_id) {
        var tmpl_elem = tmpl.querySelector('[data-use="' + use_name + '"]');
        var elem = parent_element.appendChild(tmpl_elem.cloneNode(false));
        elem.setAttribute('class', 'dfu-uploader-' + use_name + ' ' + tmpl_elem.getAttribute('class'));
        if(elem_text !== '') {
          elem.textContent = elem_text;
        }
        if(elem_id) {
          elem.id = elem_id;
        }
        return elem;
      };
      var files = init_template(template, files_container);

      // Fineupload config
      var config = JSON.parse(upload_element.dataset.config);
      config.element = document.getElementById(upload_element.id);
      config.template = "qq-template-" + upload_element.id;

      var button_id = upload_element.id + '-button';
      config.button = document.getElementById(button_id);
      config.callbacks = {
        onStatusChange: function(id, oldStatus, newStatus) {
          dfu.handleStatusChange(upload_element, qq, id, oldStatus, newStatus);
          var file = dfu.getFileElement(upload_element, id);
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

          dfu.handleSubmit(upload_element);

          if('validation' in config
              && 'itemLimit' in config.validation
              && config.validation.itemLimit > 0) {

              var uploaded = this.getUploads({
                status: qq.status.UPLOAD_SUCCESSFUL
              });
              if(uploaded && uploaded.length > config.validation.itemLimit) {
                return false;
              }

          }

          // append the file record
          var file_record = append_container_element(template, files, 'file', '', upload_element.id + "-upload-" + id);
          // append each child
          // filename
          var fn = append_container_element(template, file_record, 'filename', file_name, upload_element.id + "-filename-" + id);
          // progress
          var prg = append_container_element(template, file_record, 'prg', '', upload_element.id + "-prg-" + id);
          // status messages
          var msg = append_container_element(template, file_record, 'msg', 'submitted', upload_element.id + "-status-" + id);
          // file operations
          var ops = append_container_element(template, file_record, 'ops', '', upload_element.id + "-ops-" + id);

          // append a remove button
          var remove_callback = function(btn) {
            // remove the file element this btn is in
            var r = btn.parentElement.parentElement;
            files.removeChild(r);
          };
          var remove_button = dfu.removeButton(upload_element, id, uploader, remove_callback);
          ops.appendChild(remove_button);
          return true;
        },
        onDeleteComplete : function(id) {
          var file = dfu.getFileElement(upload_element, id);
          if(file) {
            // remove the input
            dfu.removeField(upload_element, id);
            // remove
            files.removeChild(file);
          }
        },
        onUpload: function(id, file_name) {
          var progress = document.createElement('progress');
          progress.id = upload_element.id + "-progress-" + id;
          progress.setAttribute('max', 100);
          progress.setAttribute('value', 0);
          var file = dfu.getFileElement(upload_element, id);
          if(file) {
            // append progress bar to the relevant cell
            file.getElementsByClassName('dfu-uploader-prg')[0].appendChild(progress);
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
          var file = dfu.getFileElement(upload_element, id);
          if(file) {
            file.getElementsByClassName('dfu-uploader-msg')[0].textContent = 'uploading';
          }
          progress.setAttribute('value', pc);
          progress.textContent = pc;
        },
        onComplete: function(id, file_name, responseJSON, xhr) {
          // handle completion
          dfu.handleComplete(upload_element, id, name, responseJSON, xhr);
          // apply some status text
          var file = dfu.getFileElement(upload_element, id);
          if(file) {
            file.getElementsByClassName('dfu-uploader-msg')[0].textContent = 'complete';
          }
          var ops = document.getElementById(upload_element.id + "-ops-" + id);
          // remove button not needed
          var remove_button = document.getElementById(upload_element.id + "-remove-" + id);
          if(remove_button) {
            ops.removeChild(remove_button);
          }
          // apply a delete button
          var delete_button = dfu.deleteButton(upload_element, id, uploader);
          ops.appendChild(delete_button);
        },
        //ref: https://docs.fineuploader.com/branch/master/api/events.html#allComplete
        onAllComplete: function(succeeded, failed) {
          return dfu.handleAllComplete(upload_element, succeeded, failed);
        }
      };
      uploader = new qq.FineUploaderBasic(config);
      return uploader;
  }; //end function


  for(const elem of dfu_uploaders_core) {
    try {
      dfu_core_upload_handler(elem);
    } catch (e) {
      console.error(e);
    }
  }

}
