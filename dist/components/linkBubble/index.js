/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

require('./index.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _index2 = require('../input/index');

var _index3 = _interopRequireDefault(_index2);

var _index4 = require('../button/index');

var _index5 = _interopRequireDefault(_index4);

var _util = require('../../lib/util');

var _quillEditor = require('../../lib/quillEditor');

var _insert = require('../../model/insert');

var _insert2 = _interopRequireDefault(_insert);

var _editor2 = require('../../model/editor');

var _editor3 = _interopRequireDefault(_editor2);

var _mobxReact = require('mobx-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;

var LinkBubble = (0, _mobxReact.observer)(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(LinkBubble, _Component);

    function LinkBubble() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, LinkBubble);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LinkBubble.__proto__ || Object.getPrototypeOf(LinkBubble)).call.apply(_ref, [this].concat(args))), _this), _this.onWindowResize = function () {
            _this.closeBubble();
        }, _this.closeBubble = function () {
            _insert2.default.openLinkDialog = false;
            _insert2.default.isReadOnlyLink = false;
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
            if ((0, _quillEditor.getEditor)() && !!_insert2.default.linkUrl) {
                var _editor = (0, _quillEditor.getEditor)();
                var selection = _insert2.default.linkSelection;
                console.log('selection', selection, _insert2.default.isCreateNewLink);
                if (selection) {
                    if (_insert2.default.isCreateNewLink) {
                        var index = selection.index;

                        var linkTitle = _insert2.default.linkTitle || _insert2.default.linkUrl;
                        _editor.insertText(index, linkTitle, 'user');
                        // editor.setSelection(index, linkTitle.length, 'user');
                        (0, _quillEditor.getEditor)().formatText(index, linkTitle.length, 'link', _insert2.default.linkUrl, 'user');
                        // getEditor().format('link', insert.linkUrl, 'user');
                    } else {
                        var _index = selection.index,
                            length = selection.length;

                        var _linkTitle = _insert2.default.linkTitle || _insert2.default.linkUrl;
                        if (_editor.getText(_index, _linkTitle.length) !== _linkTitle) {
                            _editor.deleteText(_index, length, 'user');
                            _editor.insertText(_index, _linkTitle, 'user');
                        }
                        // editor.setSelection(index, linkTitle.length, 'user');
                        (0, _quillEditor.getEditor)().formatText(_index, _linkTitle.length, 'link', _insert2.default.linkUrl, 'user');
                    }
                }
                _insert2.default.openLinkDialog = false;
            }
        }, _this.ableEditLink = function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            var _quillEditor$getLeaf = quillEditor.getLeaf(_editor3.default.range.index),
                _quillEditor$getLeaf2 = _slicedToArray(_quillEditor$getLeaf, 2),
                leaf = _quillEditor$getLeaf2[0],
                offset = _quillEditor$getLeaf2[1];

            var LinkIndex = quillEditor.getIndex(leaf);
            _insert2.default.linkSelection = {
                index: LinkIndex,
                length: _insert2.default.linkTitle.length || 0
            };
            _this.closeBubble();
            _insert2.default.openLinkDialog = true;
            _insert2.default.isCreateNewLink = false;
        }, _this.removeLink = function () {
            if ((0, _quillEditor.getEditor)()) {
                var _editor$range = _editor3.default.range,
                    index = _editor$range.index,
                    length = _editor$range.length;

                var _quillEditor$getLeaf3 = quillEditor.getLeaf(index),
                    _quillEditor$getLeaf4 = _slicedToArray(_quillEditor$getLeaf3, 2),
                    leaf = _quillEditor$getLeaf4[0],
                    offset = _quillEditor$getLeaf4[1];

                var LinkIndex = quillEditor.getIndex(leaf);
                // getEditor().removeFormat(LinkIndex, leaf.text.length, 'user');
                (0, _quillEditor.getEditor)().formatText(LinkIndex, leaf.text.length, 'link', false, 'user');
                _this.closeBubble();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(LinkBubble, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            setTimeout(function () {
                $(document).on('mousedown', _this2.otherDOMClick);
            }, 10);
            this.target = _reactDom2.default.findDOMNode(this);
            $(window).on('resize', this.onWindowResize);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            $(document).off('mousedown', this.otherDOMClick);
            $(window).off('resize', this.onWindowResize);
        }
    }, {
        key: 'renderReadOnly',
        value: function renderReadOnly() {
            var linkUrl = _insert2.default.linkUrl;
            if (_insert2.default.linkUrl.indexOf('http') !== 0) {
                linkUrl = 'http://' + _insert2.default.linkUrl;
            }
            return _react2.default.createElement(
                'div',
                { className: 'weditor-bubble-only-read' },
                _react2.default.createElement(
                    'a',
                    { href: linkUrl, target: '_blank' },
                    _insert2.default.linkUrl
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    '-'
                ),
                _react2.default.createElement(
                    'a',
                    { href: 'javascript:void(0)', onClick: this.ableEditLink },
                    '\u7F16\u8F91'
                ),
                _react2.default.createElement(
                    'span',
                    null,
                    '|'
                ),
                _react2.default.createElement(
                    'a',
                    { href: 'javascript:void(0)', onClick: this.removeLink },
                    '\u79FB\u9664'
                )
            );
        }
    }, {
        key: 'renderEdit',
        value: function renderEdit() {
            return _react2.default.createElement(
                'div',
                { style: { width: 388, height: 77 } },
                _react2.default.createElement(
                    'div',
                    { className: 'weditor-bubble-item' },
                    _react2.default.createElement(
                        'span',
                        null,
                        '\u6587\u672C\uFF1A'
                    ),
                    ' ',
                    _react2.default.createElement(_index3.default, { className: 'weditor-insert-input',
                        value: _insert2.default.linkTitle || '',
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
                    _react2.default.createElement(_index3.default, { className: 'weditor-insert-input',
                        value: _insert2.default.linkUrl || '',
                        onChange: this.changeUrl }),
                    _react2.default.createElement(
                        _index5.default,
                        { onClick: this.apply },
                        '\u5E94\u7528'
                    )
                )
            );
        }
    }, {
        key: 'calcTop',
        value: function calcTop() {
            var isReadOnlyLink = this.props.insert.isReadOnlyLink;
            var _props$insert$linkPos = this.props.insert.linkPosition,
                textHeight = _props$insert$linkPos.textHeight,
                top = _props$insert$linkPos.top,
                isAbove = _props$insert$linkPos.isAbove;

            if (isAbove) {
                if (isReadOnlyLink) {
                    return top - 40;
                } else {
                    return top - 115;
                }
            } else {
                return textHeight + top;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props$insert = this.props.insert,
                linkPosition = _props$insert.linkPosition,
                openLinkDialog = _props$insert.openLinkDialog,
                isReadOnlyLink = _props$insert.isReadOnlyLink;
            var left = linkPosition.left;

            return _react2.default.createElement(
                'section',
                { className: 'weditor-bubble', style: {
                        top: this.calcTop(),
                        left: left,
                        display: openLinkDialog ? 'block' : 'none',
                        padding: isReadOnlyLink ? 8 : 16
                    } },
                isReadOnlyLink ? this.renderReadOnly() : this.renderEdit()
            );
        }
    }]);

    return LinkBubble;
}(_react.Component), _class2.defaultProps = {
    linkTitle: '',
    linkUrl: ''
}, _temp2)) || _class;

exports.default = LinkBubble;