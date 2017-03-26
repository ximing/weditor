/**
 * Created by pomy on 09/03/2017.
 */

'use strict';

let gulp = require('gulp');
let del = require('del');
let gutil = require('gulp-util');
let chalk = require('chalk');
let rev = require('gulp-rev');
let webpack = require('webpack');

let webpackProdConfig = require('./build/webpack.prod.config.js');

let env = process.env.NODE_ENV || 'production';

console.log(chalk.cyan('   building for production...\n'));

gulp.task('assets',['clean'], () =>
    gulp.src(['./src/assets/**/*'], {base: './src'})
        .pipe(gulp.dest('./public/dist'))
        .pipe(rev())
        .pipe(gulp.dest('./public/dist'))
        .pipe(rev.manifest('manifest.json',{
            base: './',
            merge: true  // merge with the existing manifest if one exists
        }))
        .pipe(gulp.dest('./public/dist'))
);

// 清空静态资源
gulp.task('clean', () =>
    del(['./public/**/*'],{read: false, force: true})
);

gulp.task('build', ['assets'], (cb) => {

    let compiler = webpack(webpackProdConfig);

    compiler.run(function (err, stats) {
        console.log(chalk.cyan('\n   Build complete.\n'));
        if (err) {
            throw new gutil.PluginError('[webpack build err]', err);
        }

        gutil.log('[webpack]',stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n');

        cb();
    });
});