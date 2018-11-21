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
			oldField = f.removeChild(field);
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
				f.appendChild(field);
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

	/**
	 * Called on completion of a single file upload
	 * @param DOMElement upload_element
	 * @param int id the file id
	 * @param string name the file name
	 * @param object responseJSON response from upload server
	 * @param object xhr response from upload server
	 */
	this.handleComplete = function(upload_element, id, name, responseJSON, xhr) {
		if(responseJSON && 'newUuid' in responseJSON) {
			var f = this.getFile(upload_element, id);
			f.uuid = responseJSON.newUuid;
			return this.appendField(upload_element, id, responseJSON.newUuid);
		}
	};

	/**
	 * Called on completion of a file delete request
	 * @param DOMElement upload_element
	 * @param int id the file id
	 */
	this.handleDeleteComplete = function(upload_element, id, callback) {
		this.removeField(upload_element, id);
		return true;
	};

	/**
	 * Called when all uploads have reached a point of termination
	 * @see https://docs.fineuploader.com/branch/master/api/events.html#allComplete
	 * @param DOMElement upload_element
	 * @param array succeeded array of file ids uploaded successfully
	 * @param array failed array of file ids not uploaded successfully
	 */
	this.handleAllComplete = function(upload_element, succeeded, failed) {
		var f = this.getForm(upload_element);
		if(f) {
			if(failed.length == 0 || succeeded.length == 0) {
				// unblock form if none failed or none succeeded
				this.toggleSubmitButtons(f, false);
				f.onsubmit = function() { return true; };
			} else {
				// retain disabled form
				this.toggleSubmitButtons(f, true);
				f.onsubmit = function() { return false; };
			}
		}
	};

  /**
   * When an upload is cancelled..
   */
  this.handleCancel = function(upload_element, qq, id, name, uploader) {
    var uploading = uploader.getUploads({status: qq.status.UPLOADING});
    if(uploading && uploading.length == 0) {
      var f = this.getForm(upload_element);
      if(f) {
        // unblock the form if none uploading
        this.toggleSubmitButtons(f, false);
        f.onsubmit = function() { return true; };
      }
    }
  };

  /**
   * Whenever an error occurs
   */
  this.handleError = function(upload_element, qq, id, name, errorReason, xhr) {
    var f = this.getForm(upload_element);
    if(f) {
      // unblock the form on any error
      this.toggleSubmitButtons(f, false);
      f.onsubmit = function() { return true; };
    }
  }

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
				if(disable) {
					d.setAttribute('disabled','disabled');
				} else {
					d.removeAttribute('disabled');
				}
			}
		}
	};

	/**
	* core: remove the row representing this upload (no delete action)
	* @param upload_element DOMElement
	* @param FineUploader qq
	* @param int id the file id (from Fine Uploader)
	* @param string oldStatus
	* @param string newStatus
	 */
	this.handleStatusChange = function(upload_element, qq, id, oldStatus, newStatus) {
		var f = this.getFile(upload_element, id);
		f.status = newStatus;
		switch(newStatus) {
			case qq.status.UPLOAD_SUCCESSFUL:
			case qq.status.SUBMITTED:
			case qq.status.QUEUED:
			case qq.status.UPLOADING:
			case qq.status.UPLOAD_RETRYING:
			case qq.status.DELETING:
			case qq.status.DELETE_FAILED:
			case qq.status.PAUSED:
				// OK
				break;
			case qq.status.UPLOAD_FAILED:
			case qq.status.CANCELED:
			case qq.status.REJECTED:
			case qq.status.DELETED:
				// remove field on this event
				this.removeField(upload_element, id);
				break;
		}
	};

	/**
	 * core: remove the row representing this upload (no delete action)
	 * @param upload_element DOMElement
	 * @param int id the file id (from Fine Uploader)
	 * @param uploader qq.FineUploaderBasic
	 * @param function remove_callback a callback function triggered when the button is clicked
	 */
	this.removeButton = function(upload_element, id, uploader, remove_callback) {
		// append a remove button to the ops
		var _self = this;
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.setAttribute('class','remove');
		btn.setAttribute('data-id', id);
		btn.id = upload_element.id + '-remove-' + id;
		btn.textContent = 'remove';
		btn.onclick = function(evt) {
			// remove the input representing the file upload
			var id = this.getAttribute('data-id');
			if(uploader) {
				uploader.cancel(id);
			}
			_self.removeField(upload_element, id);
			if(remove_callback && typeof remove_callback == 'function') {
				remove_callback(this);
			}
			return false;
		};
		return btn;
	};

	/**
	 * core: delete the row representing this upload (deletes file from server)
	 * @param upload_element DOMElement
	 * @param int id the file id (from Fine Uploader)
	 * @param uploader qq.FineUploaderBasic
	 */
	this.deleteButton = function(upload_element, id, uploader) {
		// append a remove button to the ops
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.setAttribute('class','delete');
		btn.setAttribute('data-id', id);
		btn.textContent = 'delete';
		btn.onclick = function(evt) {
			// trigger a delete of this upload
			// this will trigger the onDeleteComplete callback
			var id = this.getAttribute('data-id');
			if(uploader && id) {
				// this will call the configured onDeleteComplete function on the uploader
				uploader.deleteFile(id);
			}
			return false;
		};
		return btn;
	};

	/**
	 * For non-UI uploader, this returns the DOMElement representing a file upload
	 * @param upload_element DOMElement
	 * @param int id the file id (from Fine Uploader)
	 */
	this.getFileElement = function(upload_element, id) {
		var file = document.getElementById(upload_element.id + "-upload-" + id);
		return file;
	};

}
