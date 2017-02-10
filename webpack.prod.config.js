var path = require('path');
var webpack = require('webpack');

module.exports = function (entry, output) {
  var dirName = path.dirname(output)
  var fileName = path.basename(output)
  // console.log(entry)
  // console.log(outName)
  return {
    entry: [
      'bootstrap-loader',
      entry
    ],
    output: {
      filename: fileName,
      path: dirName,
    },
    devtool: 'cheap-module-source-map',
    module: {
      loaders: [
        {
          test: /\.jsx|\.js|\.es6?$/,
          exclude: /node_modules/,
          loaders: ['babel'],
        },
        {
          test: /\.eot(\?\S*)?$/,
          loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'
        },
        {
          test: /\.woff2(\?\S*)?$/,
          loader: 'url-loader?limit=100000&mimetype=application/font-woff2'
        },
        {
          test: /\.woff(\?\S*)?$/,
          loader: 'url-loader?limit=100000&mimetype=application/font-woff'
        },
        {
          test: /\.ttf(\?\S*)?$/,
          loader: 'url-loader?limit=100000&mimetype=application/font-ttf'
        },
        {
          test: /\.(png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url?limit=8192'
        }
      ]
    },

    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.UglifyJsPlugin({
        comments: false, // remove comments
        compress: {
          unused: true,
          dead_code: true, // big one--strip code that will never execute
          warnings: false, // good for prod apps so users can't peek behind curtain
          drop_debugger: true,
          conditionals: true,
          evaluate: true,
          drop_console: true, // strips console statements
          sequences: true,
          booleans: true,
        }
      }),
      new webpack.optimize.DedupePlugin()
    ],
    target: 'node',
    resolve: {
      extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".es6"]
    }
  }
};
