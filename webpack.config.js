/* eslint-disable */

const webpack = require('webpack');
const yargs = require('yargs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = yargs.argv.mode;
const libraryName = 'GeoDashboard';
const outputFile = 'geo-dashboard.js';
const plugins = [
  new ExtractTextPlugin('geo-dashboard.css')
];

if (env === 'build') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}

module.exports = {
  entry: path.join(__dirname, '/src/scripts/main.js'),
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css?sourceMap', 'sass?sourceMap'])
      }
    ],
  },
  plugins,
  node: {
    fs: 'empty',
    dns: 'empty',
    net: 'empty',
  },
};
