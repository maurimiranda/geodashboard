import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  entry: {
    'geo-dashboard': path.join(__dirname, '/src/scripts/geo-dashboard.js'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    library: 'GeoDashboard',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
  module: {
    noParse: /openlayers/,
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|examples|dist)/,
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|examples|dist)/,
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        exclude: /(node_modules|dist)/,
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|examples|dist)/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'src/images/') },
      { from: path.join(__dirname, 'src/examples/') },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/templates/examples/fullscreen.hbs'),
      inject: 'head',
      script: 'index.js',
      filename: 'index.html',
    }),
  ],
  node: {
    fs: 'empty',
    dns: 'empty',
    net: 'empty',
  },
  devServer: {
    port: 9000,
    stats: {
      colors: true,
    },
  },
};
