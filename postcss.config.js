/**
 * Created by yeanzhi on 17/1/13.
 */
'use strict';
module.exports = {
    plugins: [
        require('postcss-clearfix')(),
        require('autoprefixer')({ browsers: ['last 5 versions','Android >= 4.0', 'iOS >= 7'] })
    ]
};
