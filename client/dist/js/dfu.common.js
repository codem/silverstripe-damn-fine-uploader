// DFU: common methods
var DFU = function() {};
DFU.prototype = {
	init : function() {},
	files : {},// register of uploaded files per uploader element
	prefix : "dfufile",
	getFieldName : function(e, id) {
		return e.id + "[" + id + "]";
	},
	getClosest: function(el, s) {
		// Polyfill to get closest selector (IE9+)
		// Ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
		if (!document.documentElement.contains(el)) return null;
		do {
				if (el.matches(s)) return el;
				el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	},
	/**
	 * Get the form form the element
	 * @todo will lack of closest throw an exception in IE?
	 */
	getForm: function(e) {
		try {
			return e.closest('form');
		} catch (e) {
			return this.getClosest(e, 'form');
		}
	},
	/**
	 * Remove the hidden input representing an uploaded file
	 */
	removeField(e, id) {
		var f = this.getForm(e);
		if(!f) {
			return false;
		}
		var name = this.getFieldName(e, id);
		var field = f.elements[name];
		if(field) {
			oldField = f.removeChild(field);
		}
	},
	/**
	 * Append a hidden input containing the file upload uuid as a value
	 */
	appendField : function(e, id, uuid) {
		try {
			var f = this.getForm(e);
			if(!f) {
				throw 'cannot find form for element';
			}
			console.log(f);
			var name = this.getFieldName(e, id);
			console.log(name);
			var field = f.elements[name];
			console.log(field);
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
	},
	getFile : function(e, id) {
		if(typeof this.files[ e.id ] == 'undefined') {
			console.log('first');
			this.files[ e.id ] = [];
			this.files[ e.id ][ id ] = {};
		} else if(typeof this.files[ e.id ][ id ]  == 'undefined') {
			console.log('second');
			this.files[ e.id ][ id ] = {};
		} else {
			console.log('third');
		}
		return this.files[ e.id ][ id ];
	},
	/**
	 * Called on completion of a single file upload
	 */
	onComplete : function(e, id, name, responseJSON, xhr) {
		if(responseJSON && 'newUuid' in responseJSON) {
			var f = this.getFile(e, id);
			console.log('oncomplete:' + id);
			console.log(f);
			f.uuid = responseJSON.newUuid;
			return this.appendField(e, id, responseJSON.newUuid);
		}
	},
	onStatusChange: function(e, id, oldStatus, newStatus) {
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
				console.log('Hey', id, newStatus);
				break;
			case qq.status.UPLOAD_FAILED:
			case qq.status.CANCELED:
			case qq.status.REJECTED:
			case qq.status.DELETED:
				this.removeField(e);
				break;
		}
		console.log('File', f.uuid);
	}
};
