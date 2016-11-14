import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

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
    noParse: [path.join(__dirname, 'node_modules/openlayers/dist/ol.js')],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|examples)/,
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|examples)/,
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css?sourceMap', 'sass?sourceMap']),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=[name].[ext]',
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
    new ExtractTextPlugin('geo-dashboard.css'),
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
