/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import Icon from './components/icon/index';
import printThis from './lib/printThis';
var $ = window.jQuery;
printThis($);
// import {inject,observer} from 'mobx-react'

var CommonEditor = function (_Component) {
    _inherits(CommonEditor, _Component);

    function CommonEditor() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CommonEditor);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommonEditor.__proto__ || Object.getPrototypeOf(CommonEditor)).call.apply(_ref, [this].concat(args))), _this), _this.print = function () {
            $('.ql-editor').printThis({
                pageTitle: '',
                header: null,
                footer: null
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CommonEditor, [{
        key: 'render',
        value: function render() {
            var style = this.props.style;

            return React.createElement(
                'span',
                { className: 'ql-formats file-header', style: style },
                React.createElement(
                    'button',
                    { className: 'ql-ordinaryprint ', onClick: this.print },
                    React.createElement(Icon, { type: 'ordinaryprint' })
                ),
                React.createElement(
                    'span',
                    { className: 'ql-pdf opver-area' },
                    React.createElement('span', { className: 'opver-icon  pdf-icon' }),
                    React.createElement(
                        'span',
                        null,
                        '\u5BFC\u51FApdf'
                    )
                ),
                React.createElement(
                    'span',
                    { className: 'ql-word opver-area' },
                    React.createElement('span', { className: 'opver-icon word-icon' }),
                    React.createElement(
                        'span',
                        null,
                        '\u5BFC\u51FAword'
                    )
                )
            );
        }
    }]);

    return CommonEditor;
}(Component);

export { CommonEditor as default };