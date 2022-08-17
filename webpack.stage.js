const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const common = require('./webpack.common.js');

const processEnv = new webpack.DefinePlugin({ 'process.env.ENV_NAME': JSON.stringify('stage') });

const optimizeCssAssetsPlugin = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /styles.css$/,
  cssProcessor: cssnano,
  cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
  canPrint: true,
});

const removeDist = new CleanWebpackPlugin();

module.exports = merge(common, {
  mode: 'production',
  performance: {
    hints: false
  },
  plugins: [
    optimizeCssAssetsPlugin,
    processEnv,
    removeDist,
  ],
});
