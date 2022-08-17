const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

const processEnv = new webpack.DefinePlugin({ 'process.env.ENV_NAME': JSON.stringify('dev') });

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
  },
  plugins: [
    processEnv,
  ],
});
