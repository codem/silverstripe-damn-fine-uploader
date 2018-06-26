'use strict';
const Path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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

const build_for = (process.env.NODE_ENV !== 'production' ? 'development' : 'production');

module.exports = {
  mode : build_for,
  entry : {
    core: PATHS.SRC + '/js/core.js',
    ui: PATHS.SRC + '/js/ui.js'
  },
  output: {
    path: PATHS.DIST,
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
         test: /\.css$/,
         use: [
           {
               loader: MiniCssExtractPlugin.loader,
               options: {
                 publicPath: '../'
               }
            },
           'css-loader'
         ]
      },
      {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options : {
                emitFile: true,
                name: 'assets/[name].[ext]'
              }
            }
          ]
      }
    ]
  },

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyjsWebpackPlugin({

      })
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
      chunkFilename: "styles/[name].css"
    }),
    new CopyWebpackPlugin([
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
