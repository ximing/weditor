/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import SizeDropDown from "./components/sizeDropDown/index";
import HeaderDropDown from "./components/headerDropDown/index";
import ColorPicker from "./components/color-picker";
import { getEditor } from './lib/quillEditor';
import ToolTip from './components/tooltip';
import { inject, observer } from 'mobx-react';
import Icon from './components/icon';
import HightLight from './components/hightLight';
import InsertHeader from './insertHeader';
var StartHeader = (_dec = inject(function (state) {
    return {
        rangeFormat: state.editor.format
    };
}), _dec(_class = observer(_class = function (_Component) {
    _inherits(StartHeader, _Component);

    function StartHeader() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, StartHeader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StartHeader.__proto__ || Object.getPrototypeOf(StartHeader)).call.apply(_ref, [this].concat(args))), _this), _this.setColor = function (color) {
            if (getEditor()) {
                getEditor().focus();
                getEditor().format('color', color, 'user');
            }
        }, _this.setBackgroundColor = function (color) {
            if (getEditor()) {
                getEditor().format('background', color, 'user');
            }
        }, _this.align = function (align) {
            return function () {
                var quillEditor = getEditor();
                if (quillEditor) {
                    // const {index,length} = editor.range;
                    // if(index===0 || !!index){
                    //     quillEditor.formatLine(index,length,'align',align);
                    // }
                    quillEditor.format('align', align, 'user');
                }
            };
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    //行高
    // quill.addStyles({
    //     'div': { 'line-height': '24px' }
    // });

    _createClass(StartHeader, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                rangeFormat = _props.rangeFormat,
                style = _props.style;
            var color = rangeFormat.color,
                background = rangeFormat.background,
                size = rangeFormat.size,
                header = rangeFormat.header;

            if (Array.isArray(color)) {
                color = '#FFFFFF';
            }
            if (Array.isArray(background)) {
                background = '#FFFFFF';
            }
            // if(!!header){
            //     header = `h${header}`
            // }else{
            //     header = 'normal';
            // }
            return React.createElement(
                "span",
                { className: "ql-formats start-header", style: style },
                React.createElement(
                    "span",
                    { className: "ql-formats" },
                    React.createElement(HeaderDropDown, { val: header })
                ),
                React.createElement(
                    "span",
                    { className: "ql-formats" },
                    React.createElement(SizeDropDown, { size: size })
                ),
                React.createElement(
                    "span",
                    { className: "ql-formats" },
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u52A0\u7C97 ctrl+b"
                            )
                        },
                        React.createElement("button", { className: "ql-bold" })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u659C\u4F53 ctrl+i"
                            )
                        },
                        React.createElement("button", { className: "ql-italic" })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u5220\u9664\u7EBF ctrl+shift+s"
                            )
                        },
                        React.createElement("button", { className: "ql-strike" })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u4E0B\u5212\u7EBF ctrl+u"
                            )
                        },
                        React.createElement("button", { className: "ql-underline" })
                    )
                ),
                React.createElement(
                    "span",
                    { className: "ql-formats" },
                    React.createElement(HightLight, null),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u5B57\u4F53\u989C\u8272"
                            )
                        },
                        React.createElement(ColorPicker, { onChangeComplete: this.setColor, defaultColor: color, icon: React.createElement(
                                "span",
                                { className: "ql-defalut-color" },
                                React.createElement(
                                    "svg",
                                    { viewBox: "0 0 18 18" },
                                    React.createElement("line", { className: "ql-color-label ql-stroke", x1: "3", x2: "15", y1: "15", y2: "15",
                                        style: { stroke: color } }),
                                    React.createElement("polyline", { className: "ql-stroke", points: "5.5 11 9 3 12.5 11",
                                        style: { stroke: color === '#FFFFFF' ? '#000000' : color } }),
                                    React.createElement("line", { className: "ql-stroke", x1: "11.63", x2: "6.38", y1: "9", y2: "9",
                                        style: { stroke: color === '#FFFFFF' ? '#000000' : color } })
                                )
                            ) })
                    )
                ),
                React.createElement(
                    "span",
                    { className: "ql-formats" },
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u6709\u5E8F\u5217\u8868 ctrl+Option+L"
                            )
                        },
                        React.createElement("button", { className: "ql-list", value: "ordered" })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u65E0\u5E8F\u5217\u8868 ctrl+Option+U"
                            )
                        },
                        React.createElement("button", { className: "ql-list", value: "bullet" })
                    )
                ),
                React.createElement(
                    "span",
                    { className: "ql-formats" },
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u5DE6\u5BF9\u9F50 Ctrl+Shift+L"
                            )
                        },
                        React.createElement(Icon, { type: "zuoduiqi", onClick: this.align('left') })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u5C45\u4E2D\u5BF9\u9F50 Ctrl+Shift+E"
                            )
                        },
                        React.createElement(Icon, { type: "juzhongduiqi", onClick: this.align('center') })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u53F3\u5BF9\u9F50 Ctrl+Shift+R"
                            )
                        },
                        React.createElement(Icon, { type: "youduiqi", onClick: this.align('right') })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u4E24\u7AEF\u5BF9\u9F50 Ctrl+Shift+J"
                            )
                        },
                        React.createElement(Icon, { type: "liangduanduiqi", onClick: this.align('justify') })
                    )
                ),
                React.createElement(
                    "span",
                    { className: "ql-formats" },
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u51CF\u5C11\u7F29\u8FDB"
                            )
                        },
                        React.createElement("button", { className: "ql-indent", value: "-1" })
                    ),
                    React.createElement(
                        ToolTip,
                        {
                            placement: "bottom",
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: React.createElement(
                                "div",
                                null,
                                "\u589E\u52A0\u7F29\u8FDB"
                            )
                        },
                        React.createElement("button", { className: "ql-indent", value: "+1" })
                    )
                ),
                React.createElement(InsertHeader, null)
            );
        }
    }]);

    return StartHeader;
}(Component)) || _class) || _class);
export { StartHeader as default };