var path = require('path');
var webpack = require('webpack');

module.exports = function (entry, outName, listenPort) {
  return {
    entry: [
      'bootstrap-loader',
      'webpack-dev-server/client?http://0.0.0.0:' + listenPort,
      'webpack/hot/only-dev-server',
      entry
    ],
    output: {
      filename: outName,
      path: path.join(__dirname),
      publicPath: 'http://localhost:' + listenPort + '/'
    },
    devtool: '#inline-source-map',
    cache: true,
    debug: true,
    stats: {
      colors: true,
      reasons: true
    },
    module: {
      loaders: [
        {
          test: /\.jsx|\.js|\.es6?$/,
          exclude: /node_modules/,
          loaders: ['react-hot', 'babel'],
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
      new webpack.HotModuleReplacementPlugin()
    ]
  }
};
