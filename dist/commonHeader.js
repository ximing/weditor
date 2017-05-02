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
import { getEditor } from './lib/quillEditor';
import ToolTip from './components/tooltip';

var CommonEditor = function (_Component) {
    _inherits(CommonEditor, _Component);

    function CommonEditor() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CommonEditor);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommonEditor.__proto__ || Object.getPrototypeOf(CommonEditor)).call.apply(_ref, [this].concat(args))), _this), _this.clearFormat = function () {
            if (getEditor()) {
                var _getEditor$getSelecti = getEditor().getSelection(),
                    index = _getEditor$getSelecti.index,
                    length = _getEditor$getSelecti.length;

                if (index === 0 || !!index) {
                    getEditor().removeFormat(index, length, 'user');
                }
            }
        }, _this.undo = function () {
            if (getEditor()) {
                getEditor().history.undo();
            }
        }, _this.redo = function () {
            if (getEditor()) {
                getEditor().history.redo();
            }
        }, _this.format = function () {
            var _getEditor$getSelecti2 = getEditor().getSelection(),
                index = _getEditor$getSelecti2.index,
                length = _getEditor$getSelecti2.length;

            if (!!index) {
                format.currentFormat = getEditor().getFormat(index, length);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CommonEditor, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'span',
                { className: 'ql-formats common-header' },
                React.createElement(
                    ToolTip,
                    {
                        placement: 'bottom',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: React.createElement(
                            'div',
                            null,
                            '\u64A4\u9500(ctrl+Z)'
                        )
                    },
                    React.createElement(
                        'button',
                        { className: 'ql-undo', onClick: this.undo },
                        React.createElement(Icon, { type: 'undo' })
                    )
                ),
                React.createElement(
                    ToolTip,
                    {
                        placement: 'bottom',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: React.createElement(
                            'div',
                            null,
                            '\u91CD\u505A(ctrl+Y)'
                        )
                    },
                    React.createElement(
                        'button',
                        { className: 'ql-redo', onClick: this.redo },
                        React.createElement(Icon, { type: 'redo' })
                    )
                ),
                React.createElement(
                    ToolTip,
                    {
                        placement: 'bottom',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: React.createElement(
                            'div',
                            null,
                            '\u683C\u5F0F\u5237'
                        )
                    },
                    React.createElement(
                        'button',
                        { className: 'ql-format', onClick: this.format },
                        React.createElement(Icon, { type: 'geshishua' })
                    )
                ),
                React.createElement(
                    ToolTip,
                    {
                        placement: 'bottom',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: React.createElement(
                            'div',
                            null,
                            '\u6E05\u9664\u683C\u5F0F Ctrl+Shift+C'
                        )
                    },
                    React.createElement(
                        'button',
                        { className: 'ql-clear-format', onClick: this.clearFormat },
                        React.createElement(Icon, { type: 'qingchu' })
                    )
                )
            );
        }
    }]);

    return CommonEditor;
}(Component);

export { CommonEditor as default };