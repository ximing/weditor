/**
 * Created by yeanzhi on 17/2/26.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _timeRelated = require("./lib/timeRelated");

var _commonHeader = require("./commonHeader");

var _commonHeader2 = _interopRequireDefault(_commonHeader);

var _fileHeader = require("./fileHeader");

var _fileHeader2 = _interopRequireDefault(_fileHeader);

var _startHeader = require("./startHeader");

var _startHeader2 = _interopRequireDefault(_startHeader);

var _insertHeader = require("./insertHeader");

var _insertHeader2 = _interopRequireDefault(_insertHeader);

var _viewHeader = require("./viewHeader");

var _viewHeader2 = _interopRequireDefault(_viewHeader);

var _quillEditor = require("./lib/quillEditor");

var _toast = require("./components/toast");

var _rcDropdown = require("rc-dropdown");

var _rcDropdown2 = _interopRequireDefault(_rcDropdown);

var _rcMenu = require("rc-menu");

var _rcMenu2 = _interopRequireDefault(_rcMenu);

require("rc-dropdown/assets/index.css");

var _help = require("./model/help");

var _help2 = _interopRequireDefault(_help);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EditorHeader = function (_Component) {
    _inherits(EditorHeader, _Component);

    function EditorHeader() {
        var _this2 = this;

        _classCallCheck(this, EditorHeader);

        var _this = _possibleConstructorReturn(this, (EditorHeader.__proto__ || Object.getPrototypeOf(EditorHeader)).call(this));

        _this.HelpMenuClick = function (_ref) {
            var key = _ref.key;

            if (key === '0') {
                _help2.default.hotKeysDialog = true;
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
                            if ((0, _quillEditor.getEditor)()) {
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

            return _react2.default.createElement(
                "div",
                { className: "toolbar-opver", id: "toolbarOpver" },
                _react2.default.createElement(_commonHeader2.default, null),
                _react2.default.createElement(_fileHeader2.default, { style: { display: panel === 0 ? 'inline-block' : 'none' } }),
                _react2.default.createElement(_startHeader2.default, { style: { display: panel === 1 ? 'inline-block' : 'none' } }),
                _react2.default.createElement(_insertHeader2.default, { style: { display: panel === 2 ? 'inline-block' : 'none' } }),
                _react2.default.createElement(_viewHeader2.default, { style: { display: panel === 3 ? 'inline-block' : 'none' } })
            );
        }
    }, {
        key: "changePanel",
        value: function changePanel(panel) {
            var _this3 = this;

            return function () {
                if (panel === 4 || panel === 5) {
                    (0, _toast.info)('稍后开放，敬请期待');
                    return;
                }
                _this3.setState({ panel: panel });
            };
        }
    }, {
        key: "renderToolbar",
        value: function renderToolbar() {
            var menu = _react2.default.createElement(
                _rcMenu2.default,
                { selectable: false, onClick: this.HelpMenuClick },
                _react2.default.createElement(
                    _rcMenu.Item,
                    { key: "0" },
                    "\u952E\u76D8\u5FEB\u6377\u952E"
                ),
                _react2.default.createElement(_rcMenu.Divider, null),
                this.props.helpOptions.map(function (item) {
                    return _react2.default.createElement(
                        _rcMenu.Item,
                        { key: item.key },
                        item.content
                    );
                })
            );
            var panel = this.state.panel;

            return _react2.default.createElement(
                "div",
                { className: "toolbar-tab" },
                _react2.default.createElement(
                    "span",
                    { className: "file-tab " + (panel === 0 ? 'active' : ''), onClick: this.changePanel(0) },
                    "\u6587\u4EF6"
                ),
                _react2.default.createElement(
                    "span",
                    { className: "start-tab " + (panel === 1 ? 'active' : ''), onClick: this.changePanel(1) },
                    "\u5F00\u59CB"
                ),
                _react2.default.createElement(
                    "span",
                    { className: "insert-tab " + (panel === 2 ? 'active' : ''), onClick: this.changePanel(2) },
                    "\u63D2\u5165"
                ),
                _react2.default.createElement(
                    "span",
                    { className: "view-tab " + (panel === 3 ? 'active' : ''), onClick: this.changePanel(3) },
                    "\u89C6\u56FE"
                ),
                _react2.default.createElement(
                    "span",
                    { className: "history-tab", onClick: this.changePanel(4) },
                    "\u4FEE\u8BA2\u5386\u53F2"
                ),
                _react2.default.createElement(
                    _rcDropdown2.default,
                    {
                        trigger: ['click'],
                        overlay: menu,
                        animation: "slide-up"
                    },
                    _react2.default.createElement(
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
            return _react2.default.createElement(
                "div",
                { className: "weditor-header" },
                _react2.default.createElement(
                    "div",
                    { className: "header-left-box list-header" },
                    _react2.default.createElement(
                        "div",
                        { className: "s-header" },
                        _react2.default.createElement(
                            "a",
                            { className: "header-back-up", onClick: this.backList },
                            _react2.default.createElement("span", { className: "header-back-icon" })
                        ),
                        _react2.default.createElement(
                            "span",
                            { className: "s-header-text" },
                            _react2.default.createElement(
                                "div",
                                { className: "span-input-wrap" },
                                _react2.default.createElement("input", { className: "title-input span-input", defaultValue: 'ceshi.doc', maxLength: "100",
                                    style: {
                                        display: 'none'
                                    } }),
                                _react2.default.createElement(
                                    "span",
                                    { className: "title-input-pre span-input-pre" },
                                    this.props.doc.name || '未命名'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "span",
                            { className: "s-header-time",
                                id: "save-status" },
                            this.props.doc.status
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "header-right-box" },
                    this.props.rightContent
                ),
                _react2.default.createElement(
                    "div",
                    { className: "editor-toolbar", id: "toolbar" },
                    this.renderToolbar(),
                    this.renderOpverHeader()
                )
            );
        }
    }]);

    return EditorHeader;
}(_react.Component);

exports.default = EditorHeader;