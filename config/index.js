/**
 * Created by pomy on 07/02/2017.
 */

'use strict';

let path = require('path');

module.exports =  {
    dev:{
        env: require('./dev.env.js'),
        assetsRoot: path.resolve(__dirname, '../public/dist'),
        assetsPublicPath: '/',
        port: 3000
    },
    build:{
        env: require('./prod.env.js'),
        assetsRoot: path.resolve(__dirname, '../public/dist'),
        assetsPublicPath: '/',
    }
};