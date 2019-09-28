const path = require('path');
const webpack = require('webpack');
module.exports = {
    mode: "development",
    devtool: "inline-source-map",

    entry: {
        content: './src/app/content.ts',
        background: './src/app/background.ts',
        popup: './src/ui/popup.tsx',
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
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.css$/, use: ['style-loader', {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName:'[name]__[local]___[hash:base64:5]'
                }
            }] },
            { test: /\.less$/, use: ['style-loader', {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName:'[name]__[local]___[hash:base64:5]'
                }
            }, 'less-loader'] }
        ]
    },
    plugins: [
        
      ],
};
