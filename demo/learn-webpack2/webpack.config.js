const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('Clean-webpack-plugin');

module.exports = {
    mode: 'development',
    // 多页面配置
    entry: {
        app: './src/index.js',
        print: './src/print.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        // 对于 CleanWebpackPlugin 的 v2 versions 以下版本，使用 new CleanWebpackPlugin(['dist/*'])
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '开发环境',
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [

        ],
    },
};