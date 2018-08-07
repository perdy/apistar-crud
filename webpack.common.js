/* eslint-disable import/no-extraneous-dependencies */

const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PostcssPresetEnv = require("postcss-preset-env");
const PostcssIcssValues = require("postcss-icss-values");
const Autoprefixer = require("autoprefixer");

module.exports = {
  entry: {
    index: "./admin/index.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, "admin/")],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]__[local]--[hash:base64:5]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("postcss-preset-env"), require("postcss-icss-values"), require("autoprefixer")]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=8192"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    modules: ["node_modules", path.resolve(__dirname, "admin")]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        styles: {
          name: "styles.react",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /lodash$/), // ignore moment js locales for now
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css"
      // chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(["apistar_crud/static"])
  ],
  output: {
    path: path.resolve(__dirname, "apistar_crud/static"),
    publicPath: "/static/apistar_crud/"
  }
};
