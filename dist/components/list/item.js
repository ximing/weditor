/**
 * Created by yeanzhi on 17/2/22.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { formatDate } from '../../lib/timeRelated';
import { fileBigIconJudge } from '../../lib/filejudge';
import { isImg } from '../../lib/fileTypeJudge.js';

var sizeConvert = function sizeConvert(size) {
    return size / 1000 > 1000 ? (size / 1000 / 1000).toFixed(2) + 'M' : (size / 1000).toFixed(1) + 'K';
};

var _default = function (_Component) {
    _inherits(_default, _Component);

    function _default() {
        _classCallCheck(this, _default);

        return _possibleConstructorReturn(this, (_default.__proto__ || Object.getPrototypeOf(_default)).apply(this, arguments));
    }

    _createClass(_default, [{
        key: 'render',
        value: function render() {
            try {
                var _props = this.props,
                    item = _props.item,
                    clickItem = _props.clickItem;

                return React.createElement(
                    'div',
                    { className: 'yp-file-list-item',
                        onDoubleClick: clickItem },
                    React.createElement('span', { className: 'list-item-checkbox-container' }),
                    React.createElement(
                        'span',
                        { className: 'list-item-icon ' + (isImg(item.name) && item.thumbUrl && !item.isDir && 'list-item-icon-border') },
                        isImg(item.name) && item.thumbUrl ? React.createElement(ImgLoader, { src: item.thumbUrl }) : React.createElement('span', { className: fileBigIconJudge(item.isDir, item.name) })
                    ),
                    React.createElement(
                        'div',
                        { className: 'list-item-title' },
                        React.createElement(
                            'span',
                            { title: item.name, className: 'list-item-title-name',
                                onClick: clickItem },
                            item.name
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'list-item-right' },
                        React.createElement(
                            'span',
                            { className: 'list-item-size' },
                            item.isDir ? '-' : sizeConvert(item.size)
                        ),
                        React.createElement(
                            'span',
                            { className: 'list-item-uts' },
                            formatDate('yyyy/MM/dd HH:mm', item.uts)
                        )
                    )
                );
            } catch (err) {
                console.log(err);
            }
        }
    }]);

    return _default;
}(Component);

export { _default as default };