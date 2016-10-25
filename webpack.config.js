/* eslint-disable */

const webpack = require('webpack');
const yargs = require('yargs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const env = yargs.argv.mode;
const libraryName = 'GeoDashboard';
const plugins = [
  new ExtractTextPlugin('geo-dashboard.css')
];

let outputFile;

if (env === 'build') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  outputFile = `${toDash(libraryName)}.min.js`;
} else {
  outputFile = `${toDash(libraryName)}.js`;
}

module.exports = {
  entry: path.join(__dirname, '/src/scripts/geo-dashboard.js'),
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
  devServer: {
    colors: true,
    inline: true,
    hot: true,
    port: 9000,
    contentBase: './dist/examples'
  }
};

function toDash(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
