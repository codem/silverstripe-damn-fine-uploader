'use strict';
const Path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const PATHS = {
  // the root path, where your webpack.config.js is located.
  ROOT: Path.resolve(),
  // your node_modules folder name, or full path
  MODULES: Path.resolve('node_modules'),
  // relative path from your css files to your other files, such as images and fonts
  FILES_PATH: '../',
  // thirdparty folder containing copies of packages which wouldn't be available on NPM
  THIRDPARTY: 'thirdparty',
  // SRC files
  SRC: Path.resolve('client/src'),
  // DIST file location
  DIST: Path.resolve('client/dist')
};

const build_for = (process.env.NODE_ENV !== 'production' ? 'development' : 'production');

module.exports = (env, argv) => {

  const config = {

    mode : build_for,
    devtool : build_for == 'production' ? 'source-map' : 'eval',
    entry : {
      'uppy': [ PATHS.SRC + '/js/uppy.js', PATHS.SRC + '/styles/uppy.css' ],
      'uppy.min': [ PATHS.SRC + '/js/uppy.js', PATHS.SRC + '/styles/uppy.css' ]
    },
    output: {
      path: PATHS.DIST,
      filename: 'js/[name].js',
      crossOriginLoading: 'anonymous'
    },
    module: {
      rules: [
        {
          test:    /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
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
        }
      ]
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          include: /\.min\.js$/,
          extractComments: false
        }),
        new CssMinimizerPlugin({
          include: /\.min\.css$/
        })
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles/[name].css",
        chunkFilename: "styles/[name].css"
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        reportFilename: "bundle-report.html",
        analyzerMode: "static"
      }),
      new SubresourceIntegrityPlugin(),
      new WebpackAssetsManifest({
        enabled: true,
        integrity: true,
        integrityHashes: ['sha384']
      })
    ]

  };

  console.log('Environment=production', build_for == 'production');

  return config;
};
