/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import './catalogue.scss';
import React, { Component } from "react";
import Icon from './components/icon/index';
import { observer, inject } from "mobx-react";

var CommonEditor = (_dec = inject("catalogue"), _dec(_class = observer(_class = function (_Component) {
    _inherits(CommonEditor, _Component);

    function CommonEditor() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CommonEditor);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommonEditor.__proto__ || Object.getPrototypeOf(CommonEditor)).call.apply(_ref, [this].concat(args))), _this), _this.closeCatalogue = function () {
            _this.props.catalogue.open = false;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CommonEditor, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                style = _props.style,
                catalogue = _props.catalogue;
            var open = catalogue.open;

            return React.createElement(
                'div',
                { className: 'catalogue-container', style: { display: open ? 'block' : 'none' } },
                React.createElement(
                    'div',
                    { className: 'catalogue-header' },
                    React.createElement(
                        'span',
                        null,
                        '\u76EE\u5F55'
                    ),
                    React.createElement(Icon, { type: 'close', onClick: this.closeCatalogue })
                ),
                React.createElement(
                    'div',
                    { className: 'catalogue-body' },
                    this.props.catalogue.list.map(function (_, i) {
                        return React.createElement(
                            'p',
                            { key: i, className: 'catalogue-h' + _.h },
                            _.content
                        );
                    })
                )
            );
        }
    }]);

    return CommonEditor;
}(Component)) || _class) || _class);
export { CommonEditor as default };