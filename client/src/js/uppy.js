import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import DFULoader from '../js/loader.js';
import dfuUppyCss from '../styles/uppy.css';

const dfuXHRUploaders = document.querySelectorAll('.dfu-uploader-uppy');
dfuXHRUploaders.forEach( (dfuXHRUploaderElement) => {
    try {
      var dfuLoader = new DFULoader({
        uploadElement: dfuXHRUploaderElement
      });
      dfuLoader.init();
      dfuLoader.handle();
    } catch (e) {
      console.error('Caught uploader error:' + e);
    }
});
