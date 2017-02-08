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
    devtool: 'eval-cheap-module-source-map',
    module: {
      loaders: [
        {
          test: /\.jsx|\.js|\.es6?$/,
          exclude: /node_modules/,
          loaders: ['babel?presets[]=es2015&presets[]=react&presets[]=stage-0&plugins[]=lodash&sourceMap=inline'],
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
        jQuery: 'jquery',
        $: 'jquery'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
      extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".es6"]
    }
  }
};
