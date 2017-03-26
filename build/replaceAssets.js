/**
 * Created by pomy on 08/02/2017.
 * 替换images 路径引用
 */

'use strict';

let fs = require('fs');
let path = require('path');


//docs:https://github.com/webpack/docs/wiki/how-to-write-a-plugin

function ReplaceAssert(options) {
    // Setup the plugin instance with options...
}


ReplaceAssert.prototype.apply = compiler => {
    compiler.plugin('emit', (compilation, callback) => {
        let reg = /\/assets\/(.*?\.(png|jpg|jpeg|gif|swf|eot|svg|ttf|woff|svg))/ig;
        let assetKeys = Object.keys(compilation.assets);

        let manifest = {};

        //读取manifest文件
        try{
            manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/dist', 'manifest.json'),'utf8'));
        }catch (err){
            console.error('error occurred when read manifest: ',err);
        }

        assetKeys.forEach(assetKey => {
            if(assetKey.split('.')[0] === 'app'){
                let appSource = compilation.assets[assetKey].source();
                let convertResult = appSource.replace(reg, (matchItem) => {
                    if (manifest[`${matchItem}`]) {
                        return matchItem;
                    } else {
                        return `/dist${matchItem}`
                    }
                });
                compilation.assets[assetKey] = {
                    source: function () {
                        return convertResult;
                    },
                    size: function () {
                        return convertResult.length;
                    }
                };
            }
        });

        callback();
    });
};

module.exports = ReplaceAssert;