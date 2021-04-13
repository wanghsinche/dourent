const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "production",
    entry: {
        content: './src/app/content.ts',
        background: './src/app/background.ts',
        popup: './src/ui/popup.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name]-[contenthash].js'
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
        new HtmlWebpackPlugin({
            filename: '../index.html',
            // template: 'src/index.ejs',
            chunks: ['popup'],
            publicPath: 'js/'
        }),
    ],
};
