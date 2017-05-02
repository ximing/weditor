/**
 * Created by yeanzhi on 17/2/26.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import { formatDate } from "./lib/timeRelated";
import CommonHeader from './commonHeader';
import FileHeader from './fileHeader';
import StartHeader from './startHeader';
import InsertHeader from './insertHeader';
import ViewHeader from './viewHeader';
import { getEditor } from './lib/quillEditor';
import { info } from './components/toast';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem, Divider } from 'rc-menu';
import 'rc-dropdown/assets/index.css';
import help from './model/help';

var EditorHeader = function (_Component) {
    _inherits(EditorHeader, _Component);

    function EditorHeader() {
        var _this2 = this;

        _classCallCheck(this, EditorHeader);

        var _this = _possibleConstructorReturn(this, (EditorHeader.__proto__ || Object.getPrototypeOf(EditorHeader)).call(this));

        _this.HelpMenuClick = function (_ref) {
            var key = _ref.key;

            if (key === '0') {
                help.hotKeysDialog = true;
            } else {
                _this.props.helpOptions.forEach(function (item) {
                    if (item.key === key) {
                        item.onClick(key);
                    }
                });
            }
        };

        _this.export = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (getEditor()) {
                                // let res = await api.getExportUrl(window.quillEditor.getContents());
                                document.getElementById('gf_down_file').src = res.url;
                            }

                        case 1:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, _this2);
        }));

        _this.backList = _this.backList.bind(_this);
        _this.state = {
            panel: 1
        };
        return _this;
    }

    _createClass(EditorHeader, [{
        key: "componentDidMount",
        value: function componentDidMount() {}
    }, {
        key: "backList",
        value: function backList() {
            // this.props.dispatch(push('/xnote/index'));
        }
    }, {
        key: "renderOpverHeader",
        value: function renderOpverHeader() {
            var panel = this.state.panel;

            return React.createElement(
                "div",
                { className: "toolbar-opver", id: "toolbarOpver" },
                React.createElement(CommonHeader, null),
                React.createElement(FileHeader, { style: { display: panel === 0 ? 'inline-block' : 'none' } }),
                React.createElement(StartHeader, { style: { display: panel === 1 ? 'inline-block' : 'none' } }),
                React.createElement(InsertHeader, { style: { display: panel === 2 ? 'inline-block' : 'none' } }),
                React.createElement(ViewHeader, { style: { display: panel === 3 ? 'inline-block' : 'none' } })
            );
        }
    }, {
        key: "changePanel",
        value: function changePanel(panel) {
            var _this3 = this;

            return function () {
                if (panel === 4 || panel === 5) {
                    info('稍后开放，敬请期待');
                    return;
                }
                _this3.setState({ panel: panel });
            };
        }
    }, {
        key: "renderToolbar",
        value: function renderToolbar() {
            var menu = React.createElement(
                Menu,
                { selectable: false, onClick: this.HelpMenuClick },
                React.createElement(
                    MenuItem,
                    { key: "0" },
                    "\u952E\u76D8\u5FEB\u6377\u952E"
                ),
                React.createElement(Divider, null),
                this.props.helpOptions.map(function (item) {
                    return React.createElement(
                        MenuItem,
                        { key: item.key },
                        item.content
                    );
                })
            );
            var panel = this.state.panel;

            return React.createElement(
                "div",
                { className: "toolbar-tab" },
                React.createElement(
                    "span",
                    { className: "file-tab " + (panel === 0 ? 'active' : ''), onClick: this.changePanel(0) },
                    "\u6587\u4EF6"
                ),
                React.createElement(
                    "span",
                    { className: "start-tab " + (panel === 1 ? 'active' : ''), onClick: this.changePanel(1) },
                    "\u5F00\u59CB"
                ),
                React.createElement(
                    "span",
                    { className: "insert-tab " + (panel === 2 ? 'active' : ''), onClick: this.changePanel(2) },
                    "\u63D2\u5165"
                ),
                React.createElement(
                    "span",
                    { className: "view-tab " + (panel === 3 ? 'active' : ''), onClick: this.changePanel(3) },
                    "\u89C6\u56FE"
                ),
                React.createElement(
                    "span",
                    { className: "history-tab", onClick: this.changePanel(4) },
                    "\u4FEE\u8BA2\u5386\u53F2"
                ),
                React.createElement(
                    Dropdown,
                    {
                        trigger: ['click'],
                        overlay: menu,
                        animation: "slide-up"
                    },
                    React.createElement(
                        "span",
                        { className: "help-tab" },
                        "\u5E2E\u52A9"
                    )
                )
            );
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "weditor-header" },
                React.createElement(
                    "div",
                    { className: "header-left-box list-header" },
                    React.createElement(
                        "div",
                        { className: "s-header" },
                        React.createElement(
                            "a",
                            { className: "header-back-up", onClick: this.backList },
                            React.createElement("span", { className: "header-back-icon" })
                        ),
                        React.createElement(
                            "span",
                            { className: "s-header-text" },
                            React.createElement(
                                "div",
                                { className: "span-input-wrap" },
                                React.createElement("input", { className: "title-input span-input", defaultValue: 'ceshi.doc', maxLength: "100",
                                    style: {
                                        display: 'none'
                                    } }),
                                React.createElement(
                                    "span",
                                    { className: "title-input-pre span-input-pre" },
                                    this.props.doc.name || '未命名'
                                )
                            )
                        ),
                        React.createElement(
                            "span",
                            { className: "s-header-time",
                                id: "save-status" },
                            this.props.doc.status
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "header-right-box" },
                    this.props.rightContent
                ),
                React.createElement(
                    "div",
                    { className: "editor-toolbar", id: "toolbar" },
                    this.renderToolbar(),
                    this.renderOpverHeader()
                )
            );
        }
    }]);

    return EditorHeader;
}(Component);

export { EditorHeader as default };