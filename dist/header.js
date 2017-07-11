/**
 * Created by yeanzhi on 17/2/26.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _timeRelated = require('./lib/timeRelated');

var _quillEditor = require('./lib/quillEditor');

var _toast = require('./components/toast');

var _rcDropdown = require('rc-dropdown');

var _rcDropdown2 = _interopRequireDefault(_rcDropdown);

var _rcMenu = require('rc-menu');

var _rcMenu2 = _interopRequireDefault(_rcMenu);

require('rc-dropdown/assets/index.css');

var _util = require('./lib/util');

var _printThis = require('./lib/printThis');

var _printThis2 = _interopRequireDefault(_printThis);

var _help = require('./model/help');

var _help2 = _interopRequireDefault(_help);

var _insert = require('./model/insert');

var _insert2 = _interopRequireDefault(_insert);

var _editor = require('./model/editor');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;
(0, _printThis2.default)($);

var EditorHeader = (_temp = _class = function (_Component) {
    _inherits(EditorHeader, _Component);

    function EditorHeader() {
        var _this2 = this;

        _classCallCheck(this, EditorHeader);

        var _this = _possibleConstructorReturn(this, (EditorHeader.__proto__ || Object.getPrototypeOf(EditorHeader)).call(this));

        _this.toggleCatalogue = function () {
            if ((0, _quillEditor.getEditor)()) {
                var ops = (0, _quillEditor.getEditor)().getContents().ops;
                var _ops = [];
                ops = ops.forEach(function (item, i) {
                    if (ops[i + 1] && ops[i + 1].attributes && ops[i + 1].attributes.header && (0, _util.is)('String', item.insert)) {
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
        };

        _this.print = function () {
            $('.ql-editor').printThis({
                pageTitle: '',
                header: null,
                footer: null
            });
        };

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

        _this.fileMenuClick = function (_ref2) {
            var key = _ref2.key;

            if (key === '0') {
                $('.ql-editor').printThis({
                    pageTitle: '',
                    header: null,
                    footer: null
                });
            } else {
                _this.props.fileOptions.forEach(function (item) {
                    if (item.key === key) {
                        item.onClick(key);
                    }
                });
            }
        };

        _this.insertMenuClick = function (_ref3) {
            var key = _ref3.key;

            if (key === '0') {
                _insert2.default.imageSelection = (0, _quillEditor.getEditor)().getSelection();
                _insert2.default.openImageDialog = true;
            } else if ((0, _quillEditor.getEditor)()) {
                var toolbar = (0, _quillEditor.getEditor)().getModule('toolbar');
                toolbar.handlers['link'].call(toolbar, !(_editor2.default.format && _editor2.default.format.link));
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
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this2);
        }));

        _this.backList = _this.backList.bind(_this);
        _this.state = {
            panel: 1,
            panelType: ''
        };
        return _this;
    }

    _createClass(EditorHeader, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'backList',
        value: function backList() {
            // this.props.dispatch(push('/xnote/index'));
        }
    }, {
        key: 'changePanel',
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
        key: 'dropdownChange',
        value: function dropdownChange(type) {
            var _this4 = this;

            return function (visible) {
                if (visible) {
                    _this4.setState({
                        panelType: type
                    });
                } else {
                    _this4.setState({
                        panelType: ''
                    });
                }
            };
        }
    }, {
        key: 'renderMenubar',
        value: function renderMenubar() {
            var menu = _react2.default.createElement(
                _rcMenu2.default,
                { selectable: false, onClick: this.HelpMenuClick },
                _react2.default.createElement(
                    _rcMenu.Item,
                    { key: '0' },
                    '\u952E\u76D8\u5FEB\u6377\u952E'
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

            var fileMenu = _react2.default.createElement(
                _rcMenu2.default,
                { selectable: false, onClick: this.fileMenuClick },
                this.props.fileOptions.map(function (item) {
                    return _react2.default.createElement(
                        _rcMenu.Item,
                        { key: item.key },
                        item.content
                    );
                }),
                _react2.default.createElement(_rcMenu.Divider, null),
                _react2.default.createElement(
                    _rcMenu.Item,
                    { key: '0' },
                    '\u6253\u5370'
                )
            );

            var _state = this.state,
                panel = _state.panel,
                panelType = _state.panelType;

            return _react2.default.createElement(
                'div',
                { className: 'menu-bar' },
                _react2.default.createElement(
                    _rcDropdown2.default,
                    {
                        trigger: ['click'],
                        overlay: fileMenu,
                        animation: '',
                        onVisibleChange: this.dropdownChange('file')
                    },
                    _react2.default.createElement(
                        'span',
                        { className: 'file-tab ' + (panelType === 'file' && 'active') },
                        '\u6587\u4EF6'
                    )
                ),
                _react2.default.createElement(
                    _rcDropdown2.default,
                    {
                        trigger: ['click'],
                        overlay: _react2.default.createElement(
                            _rcMenu2.default,
                            { selectable: false, onClick: this.insertMenuClick },
                            _react2.default.createElement(
                                _rcMenu.Item,
                                { key: '0' },
                                '\u63D2\u5165\u56FE\u7247'
                            ),
                            _react2.default.createElement(
                                _rcMenu.Item,
                                { key: '1' },
                                '\u63D2\u5165\u94FE\u63A5'
                            )
                        ),
                        onVisibleChange: this.dropdownChange('insert'),
                        animation: ''
                    },
                    _react2.default.createElement(
                        'span',
                        { className: 'insert-tab ' + (panelType === 'insert' && 'active') },
                        '\u63D2\u5165'
                    )
                ),
                _react2.default.createElement(
                    _rcDropdown2.default,
                    {
                        trigger: ['click'],
                        overlay: menu,
                        animation: '',
                        onVisibleChange: this.dropdownChange('help')
                    },
                    _react2.default.createElement(
                        'span',
                        { className: 'help-tab ' + (panelType === 'help' && 'active') },
                        '\u5E2E\u52A9'
                    )
                )
            );
        }

        /*
         <div className="header-left-box list-header">
         <div className="s-header">
         <span className="s-header-text">
         <div className="span-input-wrap">
         <input className="title-input span-input" defaultValue={'ceshi.doc'} maxLength="100"
         style={{
         display: 'none'
         }}/>
         <span className="title-input-pre span-input-pre">{this.props.doc.name || '未命名'}</span>
         </div>
         </span>
         </div>
         </div>
         <div className="header-right-box">
         {this.props.rightContent}
         </div>
        * */

    }, {
        key: 'render',
        value: function render() {
            //this.props.doc.status
            return _react2.default.createElement(
                'div',
                { className: 'weditor-header' },
                this.renderMenubar()
            );
        }
    }]);

    return EditorHeader;
}(_react.Component), _class.defaultProps = {
    fileOptions: [],
    helpOptions: []
}, _temp);
exports.default = EditorHeader;