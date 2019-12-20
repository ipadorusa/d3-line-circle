const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const appName = "d3-line-circle";

module.exports = (env, options) => {
    const config = {
        entry: {
            build: ['@babel/polyfill', `./${appName}/app.js`]
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, `./${appName}/sample/test/`),
            libraryTarget: 'var',
            library: 'UI'
        },
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        "style-loader",
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { sourceMap: true },
                        },
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.js$/,
                    use: {
                        loader : 'babel-loader',
                        options : {
                            presets : ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
        ],
        devtool: 'source-map'
    }

    if(options.mode === 'development') {
        config.devServer = {
            contentBase: path.join(__dirname, `${appName}`),
            port: 7777
        };
    } else {
        config.optimization = {
            minimizer: [
                new TerserPlugin()
            ],
        };
    }

    return config;
};
