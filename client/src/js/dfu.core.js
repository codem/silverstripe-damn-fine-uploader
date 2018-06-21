var dfu_uploaders = document.getElementsByClassName('dfu-uploader');
if(dfu_uploaders) {
  df_uploaders.forEach( function(e) {
    var config = e.dataset.config;
    config.element = document.getElementById(e.id);
    var uploader = new qq.FineUploaderBasic(config);
  } );
}
