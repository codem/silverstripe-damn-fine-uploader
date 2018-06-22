'use strict';
const Path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PATHS = {
  // the root path, where your webpack.config.js is located.
  ROOT: Path.resolve(),
  // your node_modules folder name, or full path
  MODULES: Path.resolve('node_modules'),
  // relative path from your css files to your other files, such as images and fonts
  FILES_PATH: '../',
  // thirdparty folder containing copies of packages which wouldn't be available on NPM
  THIRDPARTY: 'thirdparty',
  // the root path to your javascript source files
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist')
};

module.exports = {
  mode : 'development',
  entry : PATHS.SRC + '/index.js',
  output: {
    path: PATHS.DIST,
    filename: 'js/[name]'
  },
  plugins: [
    new CopyWebpackPlugin([
      // Core
      {
        'from' : PATHS.MODULES + '/fine-uploader/fine-uploader/fine-uploader.core.js',
        'to' : PATHS.DIST + '/js/traditional.core.js',
      },
      {
        'from' : PATHS.SRC + '/js/dfu.core.js',
        'to' : PATHS.DIST + '/js/dfu.core.js',
      },
      {
        'from' : PATHS.SRC + '/styles/dfu.core.css',
        'to' : PATHS.DIST + '/styles/dfu.core.css',
      },
      // UI
      {
        'from' : PATHS.SRC + '/js/dfu.ui.js',
        'to' : PATHS.DIST + '/js/dfu.ui.js',
      },
      {
        'from' : PATHS.SRC + '/styles/dfu.ui.css',
        'to' : PATHS.DIST + '/styles/dfu.ui.css',
      },
      {
        'from' : PATHS.MODULES + '/fine-uploader/fine-uploader/fine-uploader.js',
        'to' : PATHS.DIST + '/js/traditional.ui.js',
      },
      {
        'from' : PATHS.MODULES + '/fine-uploader/fine-uploader/fine-uploader-gallery.css',
        'to' : PATHS.DIST + '/styles/traditional.ui.gallery.css',
      },
      // ASSETS (UI)
      {
        'from' : PATHS.MODULES + '/fine-uploader/fine-uploader/*.gif',
        'to' : PATHS.DIST + '/assets/[name].[ext]',
      },
      {
        'from' : PATHS.MODULES + '/fine-uploader/all.fine-uploader/placeholders/*.png',
        'to' : PATHS.DIST + '/assets/placeholders/[name].[ext]',
      }
    ])
  ]
};
