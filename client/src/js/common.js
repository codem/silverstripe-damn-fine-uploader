/**
 * DFU: common methods
 */
export default function DFU() {
  this.init = function() {};
  this.files = {};// register of uploaded files per uploader element
  this.prefix = "dfufile";

  this.getFieldName = function(upload_element, id) {
    return upload_element.getAttribute('data-name') + "[" + id + "]";
  };

  this.getClosest = function(elem, s) {
    try {
      return elem.closest(s);
    } catch(e) {
      // Polyfill to get closest selector (IE9+)
      // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
      if (!document.documentElement.contains(elem)) return null;
      do {
          if (elem.matches(s)) return elem;
          elem = elem.parentElement || elem.parentNode;
      } while (elem !== null && elem.nodeType === 1);
      return null;
    }
  };

  /**
   * Get the form for the element provided
   */
  this.getForm = function(elem) {
    return this.getClosest(elem, 'form');
  };
  /**
   * Remove the hidden input representing an uploaded file
   * @param upload_element DOMElement
   * @param int id the file id (from Fine Uploader)
   */
  this.removeField = function(upload_element, id) {
    var f = this.getForm(upload_element);
    if(!f) {
      return false;
    }
    var name = this.getFieldName(upload_element, id);
    var field = f.elements[name];
    if(field) {
      oldField = upload_element.removeChild(field);
    }
  };
  /**
   * Append a hidden input containing the file upload uuid as a value
   * @param upload_element DOMElement
   * @param int id the file id (from Fine Uploader)
   * @param string uuid returned from the upload server
   */
  this.appendField = function(upload_element, id, uuid) {
    try {
      var f = this.getForm(upload_element);
      if(!f) {
        throw 'cannot find form for element';
      }
      var name = this.getFieldName(upload_element, id);
      var field = f.elements[name];
      if(field) {
        // ensure field value is the uuid provided
        field.value = uuid;
      } else {
        var field = document.createElement('input');
        field.type = 'hidden';
        field.value = uuid;
        field.name = name;
        field.classList.add('dfu_uploaded_file');
        upload_element.appendChild(field);
      }
      return field;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  /**
   * Return internal data for file
   * @param upload_element DOMElement
   * @param int id the file id (from Fine Uploader)
   */
  this.getFile = function(upload_element, id) {
    if(typeof this.files[ upload_element.id ] == 'undefined') {
      this.files[ upload_element.id ] = [];
      this.files[ upload_element.id ][ id ] = {};
    } else if(typeof this.files[ upload_element.id ][ id ]  == 'undefined') {
      this.files[ upload_element.id ][ id ] = {};
    }
    return this.files[ upload_element.id ][ id ];
  };

  this.handleUnblock = function(upload_element) {
    var f = this.getForm(upload_element);
    if(f) {
      // unblock the form if none uploading
      this.toggleSubmitButtons(f, false);
      f.onsubmit = function() { return true; };
    }
  };

  this.handleSubmit = function( upload_element ) {
    var f = this.getForm(upload_element);
    if(f) {
      this.toggleSubmitButtons(f, true);
      f.onsubmit = function() { return false; };
    }
  };

  /**
   * @param DOMElement frm a form
   */
  this.toggleSubmitButtons = function(frm, disable) {
    var submit_elements = frm.querySelectorAll('[type="submit"]');
    if(submit_elements) {
      var submits = Array.from(submit_elements);
      for(var d of submits) {
        if(disable && !d.disabled) {
          // if disable and button is enabled
          d.setAttribute('disabled','disabled');
          if(d.dataset.uploadsPending) {
            if(d.nodeName == 'BUTTON') {
              d.dataset.uploadsNotPending = d.textContent;
              d.textContent = d.dataset.uploadsPending;
            } else {
              d.dataset.uploadsNotPending = d.value;
              d.value = d.dataset.uploadsPending;
            }
          }
        } else if(!disable && d.disabled) {
          // if enable and button is disabled
          d.removeAttribute('disabled');
          if(d.dataset.uploadsNotPending) {
            if(d.nodeName == 'BUTTON') {
              d.textContent = d.dataset.uploadsNotPending;
            } else {
              d.value = d.dataset.uploadsNotPending;
            }
          }
        }
      }
    }
  };

  /**
   * For non-UI uploader, this returns the DOMElement representing a file upload
   * @param DOMElement upload_element
   * @param int id the file id (from Fine Uploader)
   */
  this.getFileElement = function(upload_element, id) {
    var file = document.getElementById(upload_element.id + "-upload-" + id);
    return file;
  };

  /**
   * Simple match on mimetype to test if a file might be an image based on its mimetype
   * @param string mimetype e.g image/jpg
   */
  this.isImage = function(mimetype) {
    var pattern = /^image\//;
    var result = mimetype.match(pattern);
    return result != null;
  };

  /**
   * Notify the configured notification URL
   * @param bool whether upload success or error
   * @param object file the Uppy file object (https://uppy.io/docs/uppy/#File-Objects)
   * @param object  the uppy response with response data from the remote endpoint
   * @param string uri a URN or URL representing the file
   * @param string notificationUrl
   */
  this.notify = function(result, uppyFile, uppyResponse, uri, notificationUrl) {
    try {

      let formData = {
        uploaded: 1,
        result: result ? 1 : 0,
        id: uppyFile.id,
        name: uppyFile.name ? uppyFile.name : '',
        size: uppyFile.size ? uppyFile.size : '',
        type: uppyFile.type ? uppyFile.type : '',
        uri: uri,
        src: window.location.href,
        meta: JSON.stringify(uppyFile.meta)
      };

      let xhr = new XMLHttpRequest();
      xhr.open( 'POST', notificationUrl );
      xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      xhr.send( new URLSearchParams(formData).toString() );
    } catch (e) {
      console.error('Could not notify (' + (result ? 1 : 0) + ') - ' + e);
    }
  };

  /**
   * Notify completion to the configured notify URL
   * @param object 'The result parameter is an object with arrays of successful and failed files'
   * @param string notification URL
   */
  this.notifyComplete = function(result, notificationUrl) {
    try {
      let formData = {
        uploaded: 1,
        completed: 1,
        successful: result.successful.length,
        failed: result.failed.length,
        uploadId: result.uploadID,
        src: window.location.href
      };
      let xhr = new XMLHttpRequest();
      xhr.open( 'POST', notificationUrl );
      xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      xhr.send( new URLSearchParams(formData).toString() );
    } catch (e) {
      console.error('Could not notify completion: ' +  e);
    }
  };

  /**
   * Get a pre-signed URL for a file
   * @param File the file needing a pre signed URL
   * @param string presign URL (the service that does the presigning)
   */
  this.setPresignedUrl = function(file, presignUrl, callback) {
    try {

      let formData = {
        'id': file.id,
        'name': file.name
      };

      let xhrSuccess = function() {
        if(xhr.status != 200) {
          callback(file, false);
        } else if(xhr.readyState == 4) {
          let response = JSON.parse(xhr.responseText);
          let preSignedUrl = response.presignedurl ? response.presignedurl : false;
          callback(file, preSignedUrl);
        }
      };

      let xhrError = function() {
        callback(file, false);
      };

      let xhr = new XMLHttpRequest();
      xhr.open( 'POST', presignUrl );
      xhr.addEventListener('load', xhrSuccess);
      xhr.addEventListener('error', xhrError);
      xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
      xhr.send( new URLSearchParams(formData).toString() );
    } catch (e) {
      console.error('Could not get presigned url: ' +  e);
    }
  }

}
