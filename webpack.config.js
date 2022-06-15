
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './dev/js/App.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name]-bundle.js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'index.html',
      filename: 'index.html',
      template: './dev/index.html',
      inject: 'body',
      publicPath: '/',
      minify: {
        removeRedundantAttributes: false,
        useShortDoctype: true,
        collapseWhitespace: true,
        keepClosingSlash: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
    new HtmlWebpackInjectPreload({
      files: [
        {
          match: /.*\.woff2$/,
          attributes: { as: 'font', type: 'font/woff2', crossorigin: true },
        },
        {
          match: /vendors\.[a-z-0-9]*.css$/,
          attributes: { as: 'style' },
        },
      ],
    }),
    new ResourceHintWebpackPlugin(),
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                  ],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(?:|gif|png|jpg|svg)$/,
        generator: {
          filename: () => {
            return 'img/[name][ext]';
          },
        },
      },
      {
        test: /\.(?:eot|ttf|woff|woff2|otf)$/,
        generator: {
          filename: () => {
            return 'fonts/[name][ext]';
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
  },
};