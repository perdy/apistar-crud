/* eslint-disable import/no-extraneous-dependencies */

const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [],
  optimization: {
    nodeEnv: "production",
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true }
        }
      }),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});
