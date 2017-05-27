/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

require('./index.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _index = require('../input/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../button/index');

var _index4 = _interopRequireDefault(_index3);

var _util = require('../../lib/util');

var _insert = require('../../model/insert');

var _insert2 = _interopRequireDefault(_insert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LinkBubble = (_temp2 = _class = function (_Component) {
    _inherits(LinkBubble, _Component);

    function LinkBubble() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, LinkBubble);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LinkBubble.__proto__ || Object.getPrototypeOf(LinkBubble)).call.apply(_ref, [this].concat(args))), _this), _this.closeBubble = function (e) {
            _insert2.default.openLinkDialog = false;
        }, _this.otherDOMClick = function (e) {
            var node = e.target;
            if (!_insert2.default.openLinkDialog) {
                return false;
            }
            var target = _this.target;
            if (_insert2.default.openLinkDialog && !(0, _util.contains)(target, node)) {
                _this.closeBubble();
            }
        }, _this.changeTitle = function (e) {
            _insert2.default.linkTitle = e.target.value || '';
        }, _this.changeUrl = function (e) {
            _insert2.default.linkUrl = e.target.value || '';
        }, _this.apply = function () {
            if (getEditor() && !!_insert2.default.linkUrl) {
                var editor = getEditor();
                var selection = _insert2.default.linkSelection;
                if (selection) {
                    if (editor.getText(selection.index, selection.length) === _insert2.default.linkTitle) {
                        getEditor().format('link', _insert2.default.linkUrl, 'user');
                    } else {
                        var index = selection.index,
                            length = selection.length;

                        editor.deleteText(index, length, 'user');
                        var linkTitle = _insert2.default.linkTitle || _insert2.default.linkUrl;
                        editor.insertText(index, linkTitle, 'user');
                        editor.setSelection(index, linkTitle.length, 'user');
                        getEditor().format('link', _insert2.default.linkUrl, 'user');
                    }
                }
                _insert2.default.openLinkDialog = false;
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LinkBubble, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            setTimeout(function () {
                window.document.addEventListener('click', _this2.otherDOMClick);
            }, 100);
            this.target = _reactDom2.default.findDOMNode(this);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.document.removeEventListener('click', this.otherDOMClick, false);
        }
    }, {
        key: 'render',
        value: function render() {
            // const {linkPosition,openLinkDialog} = this.props.insert;
            return _react2.default.createElement(
                'section',
                { className: 'weditor-bubble', style: {
                        top: _insert2.default.linkPosition.top,
                        left: _insert2.default.linkPosition.left,
                        display: _insert2.default.openLinkDialog ? 'block' : 'none'
                    } },
                _react2.default.createElement(
                    'div',
                    { className: 'weditor-bubble-item' },
                    _react2.default.createElement(
                        'span',
                        null,
                        '\u6587\u672C\uFF1A'
                    ),
                    ' ',
                    _react2.default.createElement(_index2.default, { className: 'weditor-insert-input',
                        value: _insert2.default.linkTitle,
                        onChange: this.changeTitle })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'weditor-bubble-item' },
                    _react2.default.createElement(
                        'span',
                        null,
                        '\u94FE\u63A5\uFF1A'
                    ),
                    ' ',
                    _react2.default.createElement(_index2.default, { className: 'weditor-insert-input',
                        value: _insert2.default.linkUrl,
                        onChange: this.changeUrl }),
                    _react2.default.createElement(
                        _index4.default,
                        { onClick: this.apply },
                        '\u5E94\u7528'
                    )
                )
            );
        }
    }]);

    return LinkBubble;
}(_react.Component), _class.defaultProps = {
    linkTitle: '',
    linkUrl: ''
}, _temp2);
exports.default = LinkBubble;