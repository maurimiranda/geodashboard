/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
const webpack = require('webpack');

const env = process.env.WEBPACK_ENV;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const plugins = [];
let outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = 'geo-dashboard.min.js';
} else {
  outputFile = 'geo-dashboard.js';
}

module.exports = {
  entry: {
    library: './src/index',
  },
  devtool: 'source-map',
  output: {
    path: './dist',
    filename: outputFile,
    library: 'GeoDashboard',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins,
  devServer: {
    inline: true,
    port: 9000,
    contentBase: './dist',
  },
};
