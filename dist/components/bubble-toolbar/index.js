/**
 * Created by yeanzhi on 17/7/20.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./index.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _quillEditor = require('../../lib/quillEditor');

var _editor = require('../../model/editor');

var _editor2 = _interopRequireDefault(_editor);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.$;
var bubbleToolbarWidth = 206;

var BubbleToolbar = function (_Component) {
    _inherits(BubbleToolbar, _Component);

    function BubbleToolbar() {
        _classCallCheck(this, BubbleToolbar);

        var _this = _possibleConstructorReturn(this, (BubbleToolbar.__proto__ || Object.getPrototypeOf(BubbleToolbar)).call(this));

        _this.state = {
            show: true,
            bubbleStyle: {
                left: 0,
                top: 0,
                marginTop: 0,
                display: 'block'
            },
            arrowStyle: {
                marginLeft: 0
            },
            bubbleOpacity: false
        };

        _this.onTextChange = function () {
            if (_this.state.bubbleStyle.display !== 'none') {
                _this.setState({
                    bubbleStyle: Object.assign({}, _this.state.bubbleStyle, {
                        display: 'none'
                    })
                });
            }
        };

        _this.onSelectionChange = function (eventName) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (eventName === 'selection-change') {
                var range = args[0];

                if (!!(0, _quillEditor.getEditor)() && !!range && !!range.length && !!(0, _quillEditor.getEditor)().getText(range.index, range.length).trim()) {
                    var _getEditor$getBounds = (0, _quillEditor.getEditor)().getBounds(range.index + Math.floor(range.length / 2)),
                        left = _getEditor$getBounds.left,
                        top = _getEditor$getBounds.top,
                        height = _getEditor$getBounds.height,
                        width = _getEditor$getBounds.width,
                        right = _getEditor$getBounds.right;

                    var bubbleLeft = Math.max(0, left - bubbleToolbarWidth / 2),
                        marginLeft = 0;
                    if (bubbleLeft === 0) {
                        marginLeft = -(bubbleToolbarWidth / 2 - left + width);
                    } else {
                        var maxLeft = _this.$editor[0].getBoundingClientRect().width - bubbleToolbarWidth;
                        if (bubbleLeft > maxLeft) {
                            bubbleLeft = maxLeft;
                            marginLeft = left - maxLeft - bubbleToolbarWidth / 2;
                        }
                    }
                    _this.setState({
                        show: true,
                        bubbleStyle: {
                            left: bubbleLeft,
                            top: top,
                            marginTop: -(height + 20),
                            display: 'block'
                        },
                        arrowStyle: {
                            marginLeft: marginLeft
                        },
                        bubbleOpacity: true
                    });
                    _this.transition();
                } else {
                    _this.setState({
                        bubbleStyle: Object.assign({}, _this.state.bubbleStyle, {
                            display: 'none'
                        })
                    });
                    _this.clearTransition();
                }
            }
        };

        _this.clearTransition = function () {
            clearTimeout(_this.timer);
            clearTimeout(_this.bubbleOpacityTimer);
        };

        _this.transition = function () {
            _this.clearTransition();
            _this.timer = setTimeout(function () {
                _this.setState({
                    bubbleStyle: Object.assign({}, _this.state.bubbleStyle, {
                        display: 'none'
                    })
                });
            }, 4100);
            _this.bubbleOpacityTimer = setTimeout(function () {
                _this.setState({
                    bubbleOpacity: false
                });
            }, 1000);
        };

        _this.hasMark = function (type) {
            return _editor2.default.format[type];
        };

        _this.hasBlock = function (type, val) {
            if (val) {
                return _editor2.default.format[type] === val;
            } else {
                return _editor2.default.format[type];
            }
        };

        _this.renderMarkButton = function (type, icon) {
            var isActive = _this.hasMark(type);
            var onMouseDown = function onMouseDown(e) {
                return _this.onClickMark(e, type);
            };
            var classname = (0, _classnames2.default)({
                button: true,
                active: isActive
            });
            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: icon })
            );
        };

        _this.renderBlockButton = function (type, icon, val) {
            var isActive = _this.hasBlock(type, val);
            var onMouseDown = function onMouseDown(e) {
                return _this.onClickBlock(e, type, val);
            };
            var classname = (0, _classnames2.default)({
                button: true,
                active: isActive
            });
            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: icon })
            );
        };

        _this.onClickMark = function (e, type) {
            e.preventDefault();
            var quillEditor = (0, _quillEditor.getEditor)();
            if (quillEditor) {
                if (_this.hasMark(type)) {
                    quillEditor.format(type, false, 'user');
                } else {
                    quillEditor.format(type, true, 'user');
                }
            }
        };

        _this.onClickBlock = function (e, type, val) {
            e.preventDefault();
            var quillEditor = (0, _quillEditor.getEditor)();
            if (quillEditor) {
                if (_this.hasBlock(type)) {
                    if (_editor2.default.format[type] === val) {
                        quillEditor.format(type, false, 'user');
                    } else {
                        quillEditor.format(type, val, 'user');
                    }
                } else {
                    if (val) {
                        quillEditor.format(type, val, 'user');
                    } else {
                        quillEditor.format(type, true, 'user');
                    }
                }
            }
        };

        _this.renderLinkBtn = function () {
            var isActive = _this.hasMark('link');
            var onMouseDown = function onMouseDown(e) {
                if ((0, _quillEditor.getEditor)()) {
                    var toolbar = (0, _quillEditor.getEditor)().getModule('toolbar');
                    toolbar.handlers['link'].call(toolbar, !_editor2.default.format['link']);
                }
            };
            var classname = (0, _classnames2.default)({
                button: true,
                active: isActive
            });
            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: 'link' })
            );
        };

        _this.onSelectionChangeDebounce = (0, _lodash2.default)(_this.onSelectionChange, 150);
        return _this;
    }

    _createClass(BubbleToolbar, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().on('editor-change', this.onSelectionChangeDebounce);
                (0, _quillEditor.getEditor)().on('text-change', this.onTextChange);
            }
            this.$editor = $('.ql-editor');
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            (0, _quillEditor.getEditor)().off('editor-change', this.onSelectionChangeDebounce);
            (0, _quillEditor.getEditor)().off('text-change', this.onTextChange);
            this.clearTransition();
        }
    }, {
        key: 'render',
        value: function render() {
            var classname = (0, _classnames2.default)({
                'weditor-bubble-toolbar': true,
                'bubble-opacity': this.state.bubbleOpacity
            });
            return _react2.default.createElement(
                'div',
                { className: classname, style: this.state.bubbleStyle },
                _react2.default.createElement('span', { className: 'weditor-tooltip-arrow', style: this.state.arrowStyle }),
                _react2.default.createElement(
                    'div',
                    { className: 'weditor-bubble-toolbar-inner' },
                    this.renderMarkButton('bold', 'bold'),
                    this.renderMarkButton('italic', 'italic'),
                    this.renderLinkBtn(),
                    _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                    this.renderBlockButton('header', 'h1', 1),
                    this.renderBlockButton('header', 'h2', 2),
                    this.renderBlockButton('header', 'h3', 3)
                )
            );
        }
    }]);

    return BubbleToolbar;
}(_react.Component);

exports.default = BubbleToolbar;