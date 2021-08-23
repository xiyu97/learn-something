const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('Clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    plugins: [
      // 对于 CleanWebpackPlugin 的 v2 versions 以下版本，使用 new CleanWebpackPlugin(['dist/*'])
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: '代码分离',
      }),
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [

        ],
    },
};