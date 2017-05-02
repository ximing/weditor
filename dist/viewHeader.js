/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import Icon from './components/icon/index';
import { getEditor } from './lib/quillEditor';

import { observer, inject } from 'mobx-react';
import { is } from './lib/util';
var CommonEditor = (_dec = inject('catalogue'), _dec(_class = observer(_class = function (_Component) {
    _inherits(CommonEditor, _Component);

    function CommonEditor() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CommonEditor);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommonEditor.__proto__ || Object.getPrototypeOf(CommonEditor)).call.apply(_ref, [this].concat(args))), _this), _this.toggleCatalogue = function () {
            if (getEditor()) {
                var ops = getEditor().getContents().ops;
                var _ops = [];
                ops = ops.forEach(function (item, i) {
                    if (ops[i + 1] && ops[i + 1].attributes && ops[i + 1].attributes.header && is('String', item.insert)) {
                        _ops.push({
                            h: ops[i + 1].attributes.header,
                            content: item.insert
                        });
                    }
                });
                console.log(_ops);
                _this.props.catalogue.open = true;
                _this.props.catalogue.list = _ops;
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CommonEditor, [{
        key: 'render',
        value: function render() {
            var style = this.props.style;

            return React.createElement(
                'span',
                { className: 'ql-formats view-header', style: style },
                React.createElement(
                    'span',
                    { className: 'ql-catalogue opver-area', onClick: this.toggleCatalogue },
                    React.createElement('span', { className: 'opver-icon catalogue-icon' }),
                    React.createElement(
                        'span',
                        null,
                        '\u663E\u793A\u76EE\u5F55'
                    )
                )
            );
        }
    }]);

    return CommonEditor;
}(Component)) || _class) || _class);
export { CommonEditor as default };