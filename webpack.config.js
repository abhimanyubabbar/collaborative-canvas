var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './public/js/index.jsx',
  output: {
    path: path.resolve(__dirname, './public/build'),
      filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};

