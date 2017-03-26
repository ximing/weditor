/**
 * Created by pomy on 09/03/2017.
 */

'use strict';

let gulp = require('gulp');
let del = require('del');
let gutil = require('gulp-util');
let opn = require('opn');
let rev = require('gulp-rev');
let webpack = require('webpack');
let express = require('express');
let WebpackDevServer = require('webpack-dev-server');

let webpackDevConfig = require('./build/webpack.dev.config.js');
let config = require('./config/index');

let env = process.env.NODE_ENV || 'development';
let url = `http://localhost:${config.dev.port}`;
let browserIsOpen = false;

gulp.task('assets', () =>
    gulp.src(['./src/assets/**/*'], {base: './src'})
        .pipe(gulp.dest('./public/'))
        .pipe(rev())
        .pipe(gulp.dest('./public/'))
        .pipe(rev.manifest('manifest.json',{
            base: './',
            merge: true  // merge with the existing manifest if one exists
        }))
        .pipe(gulp.dest('./public/'))
);

// 清空静态资源
gulp.task('clean', () =>
    del(['./public/**/*'],{read: false, force: true})
);

gulp.task('dev', ['assets'], () => {
    let compiler = webpack(webpackDevConfig);
    let server = new WebpackDevServer(compiler, webpackDevConfig.devServer);

    server.listen(config.dev.port, 'localhost', function(err) {
        if(err) {
            throw new gutil.PluginError('[webpack-dev-server err]', err)
        }
    });

    //编译完成
    compiler.plugin('done', (stats) => {

        // gutil.log('[webpack]',stats.toString({
        //     colors: true,
        //     modules: false,
        //     children: false,
        //     chunks: false,
        //     chunkModules: false
        // }) + '\n\n');

        if(!browserIsOpen && env === 'development'){
            browserIsOpen = true;
            opn(url);
        }
    });

    //编译失败
    compiler.plugin('failed', (err) => {
        throw new gutil.PluginError("[webpack build err]", err);
    });

    //监听文件修改
    compiler.plugin("compilation", function(compilation) {

    });
});