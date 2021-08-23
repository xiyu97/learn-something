const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css到单独文件的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件

module.exports = {
    mode: 'development', // production | development
    //配置多入口,既然打包多页面那也要配置多入口
    entry: {
        app: './app.js',
        index: ['./pages/index/index.js', './pages/index/index.scss'],
        product: ['./pages/product/product.js', './pages/product/product.scss'],
        about: ['./pages/about/about.js', './pages/about/about.scss'],
    },
    //出口路径配置
    output: {
        filename: 'js/[name].[hash].js', //这个主要作用是将打包后的js已hash值的编码方式来生成出来
        path: path.resolve(__dirname, './dist'),
        publicPath: './'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [
            {
                // 它会应用到 .css  .scss  .sass 后缀的文件,
                // use数组loader的名字是有顺序的（从后往前链式调用），
                // 即先由sass-loader，再由css-loader处理，最后由MiniCssExtractPlugin.loader处理
                test: /\.(sc|c|sa)ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // 当前的css所在的文件相对于打包后的根路径dist的相对路径
                        publicPath: '../'
                    }
                }, 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            // list: [
                            //     {
                            //         tag: 'link',
                            //         attribute: 'href',
                            //         type: 'src',
                            //     },
                            // ]
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|ico)$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        name: '[name].[ext]',   //设置抽离打包图片的名称--[ext]用来获取图片的后缀
                        limit: false,  //指定文件的最大体积（以字节为单位）。 如果文件体积等于或大于限制，默认情况下将使用 file-loader 并将所有参数传递给它
                        outputPath: 'images' //设置输出文件夹名称，这个文件夹会与主入口文件在同一路径下
                    }
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts'
                    }
                },
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader',
                ],
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader',
                ],
            },
        ]
    },
    plugins: [
        //在每一次编译前都清除output输出的路径  CleanWebpackPlugin的主要作用
        new CleanWebpackPlugin(),
        //HtmlWebpackPlugin配置
        new HtmlWebpackPlugin({
            title: '首页',
            template: './pages/index/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,//删除空格、换行
            }
        }),
        new HtmlWebpackPlugin({
            title: '产品',
            template: './pages/product/product.html',
            filename: 'product.html',
            minify: {
                collapseWhitespace: true,//删除空格、换行
            }
        }),
        new HtmlWebpackPlugin({
            title: '关于我们',
            template: './pages/about/about.html',
            filename: 'about.html',
            minify: {
                collapseWhitespace: true,//删除空格、换行
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name]_[hash].css"//输出目录与文件
        }),
        new OptimizeCssAssetsPlugin()
    ]
}