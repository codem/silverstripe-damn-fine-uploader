/**
 * DFU: common methods
 */
function DFU() {
	this.init = function() {};
	this.files = {};// register of uploaded files per uploader element
	this.prefix = "dfufile";
	this.getFieldName = function(e, id) {
		return e.id + "[" + id + "]";
	};

	this.getClosest = function(el, s) {
		// Polyfill to get closest selector (IE9+)
		// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
		if (!document.documentElement.contains(el)) return null;
		do {
				if (el.matches(s)) return el;
				el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
	/**
	 * Get the form form the element
	 * @todo will lack of closest throw an exception in IE?
	 */
	this.getForm = function(e) {
		try {
			return e.closest('form');
		} catch (e) {
			return this.getClosest(e, 'form');
		}
	};
	/**
	 * Remove the hidden input representing an uploaded file
	 */
	this.removeField = function(e, id) {
		var f = this.getForm(e);
		if(!f) {
			return false;
		}
		var name = this.getFieldName(e, id);
		var field = f.elements[name];
		if(field) {
			oldField = f.removeChild(field);
		}
	};
	/**
	 * Append a hidden input containing the file upload uuid as a value
	 */
	this.appendField = function(e, id, uuid) {
		try {
			var f = this.getForm(e);
			if(!f) {
				throw 'cannot find form for element';
			}
			var name = this.getFieldName(e, id);
			var field = f.elements[name];
			if(field) {
				// ensure field value is the uuid provided
				field.value = uuid;
			} else {
				var field = document.createElement('input');
				field.type = 'text';
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
	this.getFile = function(e, id) {
		if(typeof this.files[ e.id ] == 'undefined') {
			this.files[ e.id ] = [];
			this.files[ e.id ][ id ] = {};
		} else if(typeof this.files[ e.id ][ id ]  == 'undefined') {
			this.files[ e.id ][ id ] = {};
		}
		return this.files[ e.id ][ id ];
	};
	/**
	 * Called on completion of a single file upload
	 */
	this.onComplete = function(e, id, name, responseJSON, xhr) {
		if(responseJSON && 'newUuid' in responseJSON) {
			var f = this.getFile(e, id);
			f.uuid = responseJSON.newUuid;
			return this.appendField(e, id, responseJSON.newUuid);
		}
	};
	this.onStatusChange = function(e, qq, id, oldStatus, newStatus) {
		var f = this.getFile(e, id);
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
				this.removeField(e);
				break;
		}
	};
}
module.exports = DFU;
