const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        content: './src/app/content.ts',
        background: './src/app/background.ts',
        popup: './src/ui/popup.tsx',
    },
    devServer: {
        proxy: {
            '/proxy/qtrade': {
                target: 'https://qtrade.xyz',
                pathRewrite: { '^/proxy/qtrade': '' },
                changeOrigin: true
            },
            '/proxy/jisilu': {
                target: 'https://www.jisilu.cn',
                pathRewrite: { '^/proxy/jisilu': '' },
                changeOrigin: true
            },
            '/proxy/raw.githubusercontent.com': {
                target: 'https://raw.githubusercontent.com',
                pathRewrite: { '^/proxy/raw.githubusercontent.com': '' },
                changeOrigin: true
            },
            '/proxy/money.finance.sina.com.cn': {
                target: 'http://money.finance.sina.com.cn',
                pathRewrite: { '^/proxy/money.finance.sina.com.cn': '' },
                changeOrigin: true
            },
        },
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".less"]
    },

    module: {
        rules: [
            {
                test: /\.(jpg|svg|png|gif)?$/, loader: "file-loader", options: {
                    name: '[name].[ext]',
                }
            },
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.css$/, use: ['style-loader', {
                    loader: 'css-loader',
                }]
            },
            {
                test: /\.module.less$/, use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                }, 'less-loader']
            },
            {
                test: /\.less$/, use: ['style-loader', 'css-loader', {
                    loader: 'less-loader',
                    options: {
                        modifyVars: {
                        },
                        javascriptEnabled: true,
                    },

                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'ENV': JSON.stringify(process.env.ENV),
        }),
    ],
};
