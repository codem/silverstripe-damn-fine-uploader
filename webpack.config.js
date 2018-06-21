const Path = require('path');
const webpack = require('webpack');
// Import the core config
const webpackConfig = require('@silverstripe/webpack-config');
const {
  resolveJS,
  externalJS,
  moduleJS,
  pluginJS,
  moduleCSS,
  pluginCSS,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
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

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');

const config = [
  {
    name: 'js',
    entry: {
      traditionalcore: [
        `${PATHS.MODULES}/fine-uploader/fine-uploader/fine-uploader.core.js`,
        `${PATHS.SRC}/js/dfu.core.js`
      ],
      traditionalui: [
        `${PATHS.MODULES}/fine-uploader/fine-uploader/fine-uploader.js`,
        `${PATHS.SRC}/js/dfu.ui.js`
      ]
    },
    output: {
      path: PATHS.DIST,
      filename: 'js/[name].js'
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    resolve: Object.assign({}, resolveJS(ENV, PATHS), {extensions: ['.json', '.js', '.jsx']}),
    externals: externalJS(ENV, PATHS),
    module: moduleJS(ENV, PATHS),
    plugins: pluginJS(ENV, PATHS)
  },
  {
    name: 'css',
    entry: {
      traditionalcore: [
        `${PATHS.SRC}/styles/dfu.core.css`
      ],
      traditionalui: [
        `${PATHS.MODULES}/fine-uploader/fine-uploader/fine-uploader-gallery.css`,
        `${PATHS.SRC}/styles/dfu.ui.css`
      ]
    },
    output: {
      path: PATHS.DIST,
      filename: 'styles/[name].css',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                  url : false,
                  minimize: {
                      safe: true
                  },
                  sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                autoprefixer: {
                  browsers: [
                    ">0.25%"
                  ]
                },
                plugins: () => [
                  autoprefixer
                ],
                sourceMap: true
              },
            },
            'sass-loader',
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ]
  },
  {
    name: 'assets',
    entry: {
      traditionalui: [
        `${PATHS.MODULES}/fine-uploader/fine-uploader/loading.gif`,
        `${PATHS.MODULES}/fine-uploader/fine-uploader/processing.gif`,
        `${PATHS.MODULES}/fine-uploader/fine-uploader/continue.gif`,
        `${PATHS.MODULES}/fine-uploader/fine-uploader/edit.gif`,
        `${PATHS.MODULES}/fine-uploader/fine-uploader/pause.gif`,
        `${PATHS.MODULES}/fine-uploader/fine-uploader/retry.gif`,
        `${PATHS.MODULES}/fine-uploader/fine-uploader/trash.gif`,
        `${PATHS.MODULES}/fine-uploader/all.fine-uploader/placeholders/not_available-generic.png`,
        `${PATHS.MODULES}/fine-uploader/all.fine-uploader/placeholders/waiting-generic.png`
      ]
    },
    output: {
      path: `${PATHS.DIST}/assets/`,
    },
    module: {
      rules : [
        {
          test: /\.(gif|png|jpg|webp)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          }
        }
      ]
    }
  }
];

module.exports = config;
