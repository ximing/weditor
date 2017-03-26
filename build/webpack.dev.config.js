/**
 * Created by pomy on 07/02/2017.
 */

'use strict';

let path = require('path');
let webpack = require('webpack');

let devConfig = require('./webpack.base.config');
let config = require('../config');
let projectRoot = path.resolve(__dirname, '../');

devConfig.module.rules.unshift({
    test: /\.js?$/,
    exclude: /node_modules/,
    include: [
        path.join(projectRoot, 'src'),
        path.join(projectRoot, 'demo')
    ],
    use: ['react-hot-loader','babel-loader']
},{
    test:/\.css$/,
    use: ['style-loader','css-loader',{
        loader: 'postcss-loader',
        options:{
            plugins: [
                require('precss'),
                require('autoprefixer')({ browsers: ['last 5 versions','Android >= 4.0', 'iOS >= 7'] })
            ]
        }
    }]
});

devConfig.plugins = (devConfig.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
        'process.env': config.dev.env
    }),
    new webpack.NoEmitOnErrorsPlugin()
]);

// see https://webpack.github.io/docs/webpack-dev-server.html
devConfig.devServer = {
    hot: true,
    noInfo: false,
    quiet: false,
    port: config.dev.port,
    inline: true,
    compress: true,
    historyApiFallback: true,
    stats: 'normal',
    contentBase: './public',
    publicPath: config.dev.assetsPublicPath
};

module.exports = Object.assign({},devConfig,{
    entry: {
        app:[
            "webpack/hot/dev-server",
            `webpack-dev-server/client?http://localhost:${config.dev.port}/`,
            path.resolve(__dirname, '../demo/index.js')
        ]
    },
    output: {
        filename: '[name].js',
        path: config.dev.assetsRoot,
        publicPath: config.dev.assetsPublicPath,
        sourceMapFilename: '[file].map'
    },
    devtool:'cheap-module-eval-source-map'
});
