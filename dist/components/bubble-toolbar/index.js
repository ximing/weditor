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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _quillEditor = require('../../lib/quillEditor');

var _editor = require('../../model/editor');

var _editor2 = _interopRequireDefault(_editor);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BubbleToolbar = function (_Component) {
    _inherits(BubbleToolbar, _Component);

    function BubbleToolbar() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, BubbleToolbar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BubbleToolbar.__proto__ || Object.getPrototypeOf(BubbleToolbar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            show: true,
            left: 0,
            top: 0,
            marginTop: 0,
            display: 'block',
            bubbleOpacity: false
        }, _this.onSelectionChange = function (range) {
            if (range && range.length) {
                var _getEditor$getBounds = (0, _quillEditor.getEditor)().getBounds(range.index + Math.floor(range.length / 2)),
                    left = _getEditor$getBounds.left,
                    top = _getEditor$getBounds.top,
                    height = _getEditor$getBounds.height,
                    width = _getEditor$getBounds.width;

                _this.setState({
                    show: true,
                    left: left - 105, //105 is bubble width/2
                    top: top,
                    marginTop: -(height + 20),
                    display: 'block',
                    bubbleOpacity: true
                });
                _this.transition();
            } else {
                _this.setState({
                    display: 'none'
                });
                _this.clearTransition();
            }
        }, _this.clearTransition = function () {
            clearTimeout(_this.timer);
            clearTimeout(_this.bubbleOpacityTimer);
        }, _this.transition = function () {
            _this.clearTransition();
            _this.timer = setTimeout(function () {
                _this.setState({
                    display: 'none'
                });
            }, 4100);
            _this.bubbleOpacityTimer = setTimeout(function () {
                _this.setState({
                    bubbleOpacity: false
                });
            }, 1000);
        }, _this.hasMark = function (type) {
            return _editor2.default.format[type];
        }, _this.hasBlock = function (type, val) {
            if (val) {
                return _editor2.default.format[type] === val;
            } else {
                return _editor2.default.format[type];
            }
        }, _this.renderMarkButton = function (type, icon) {
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
        }, _this.renderBlockButton = function (type, icon, val) {
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
        }, _this.onClickMark = function (e, type) {
            e.preventDefault();
            var quillEditor = (0, _quillEditor.getEditor)();
            console.log('mark click', quillEditor, type);
            if (quillEditor) {
                if (_this.hasMark(type)) {
                    quillEditor.format(type, false, 'user');
                } else {
                    quillEditor.format(type, true, 'user');
                }
            }
        }, _this.onClickBlock = function (e, type, val) {
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
        }, _this.renderLinkBtn = function () {
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
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(BubbleToolbar, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().on('selection-change', this.onSelectionChange);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            (0, _quillEditor.getEditor)().off('selection-change', this.onSelectionChange);
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
                { className: classname, style: this.state },
                _react2.default.createElement('span', { className: 'weditor-tooltip-arrow' }),
                _react2.default.createElement(
                    'div',
                    { className: 'weditor-bubble-toolbar-inner' },
                    this.renderMarkButton('bold', 'bold'),
                    this.renderMarkButton('italic', 'italic'),
                    this.renderLinkBtn(),
                    _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                    this.renderBlockButton('header', 'h1', '1'),
                    this.renderBlockButton('header', 'h2', '2'),
                    this.renderBlockButton('header', 'h3', '3')
                )
            );
        }
    }]);

    return BubbleToolbar;
}(_react.Component);

exports.default = BubbleToolbar;