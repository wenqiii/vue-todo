const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');   //把非js代码单独打包成一个文件

const isDev = process.env.NODE_ENV === "development";

const config = {
    target: 'web',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader', //写到HTML里
            //         'css-loader'    //取出css
            //     ]
            // },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',   //图片<1024，则把图片转化成base64代码写到文件中去，
                        options: {
                            limit: 1024,
                            name: '[name]-bb.[ext]'
                        }
                    }
                ] 
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
    ]
}


if(isDev) {
    config.module.rules.push({
        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,    //直接使用之前生成的sourceMap
                }
            },
            'stylus-loader'
        ]
    });
    config.devtool = '#cheap-module-eval-source-map';
    config.devServer = {
        port: '8000',
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        // historyFallback: {

        // }
        // open: true
        hot: true   //改了组件代码，改动部分刷新，不刷新整个页面
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push({
        test: /\.styl/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',   //style-loader是用来把css文件写成js代码写入html文件中去，所以上线阶段不需要
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,    //直接使用之前生成的sourceMap
                    }
                },
                'stylus-loader'    
            ]
        })
    })
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        })
    )
}

module.exports = config