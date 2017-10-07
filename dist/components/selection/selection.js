/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _mobxReact = require('mobx-react');

var _quillEditor = require('../../lib/quillEditor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Selection = (_dec = (0, _mobxReact.inject)('editor'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
    _inherits(Selection, _Component);

    function Selection() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Selection);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Selection.__proto__ || Object.getPrototypeOf(Selection)).call.apply(_ref, [this].concat(args))), _this), _this.interval = null, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Selection, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.selection = _reactDom2.default.findDOMNode(this.refs.selection);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.interval);
        }
    }, {
        key: 'createSelectionBlock',
        value: function createSelectionBlock(rect, containerRect, key) {
            return _react2.default.createElement('span', {
                key: key,
                className: 'ql-cursor-selection-block',
                style: {
                    top: rect.top - containerRect.top,
                    left: rect.left - containerRect.left,
                    width: rect.width,
                    height: rect.height
                } });
        }
    }, {
        key: '_updateSelection',
        value: function _updateSelection(rects, containerRect) {
            var _this2 = this;

            var index = [];
            var rectIndex = void 0,
                selectionArray = [];
            if (rects) {
                try {
                    rects.forEach(function (rect, i) {
                        rectIndex = '' + rect.top + rect.left + rect.width + rect.height;

                        // Note: Safari throws a rect with length 1 when caret with no selection. A
                        // check was addedfor to avoid drawing those carets - they show up on blinking.
                        if (!~index.indexOf(rectIndex) && rect.width > 1) {
                            index.push(rectIndex);
                            selectionArray.push(_this2.createSelectionBlock(rect, containerRect, i));
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
            }
            return selectionArray;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var editor = (0, _quillEditor.getEditor)();
            clearInterval(this.interval);
            var _props$editor$range = this.props.editor.range,
                index = _props$editor$range.index,
                length = _props$editor$range.length;

            var sLeft = 0,
                sHeight = 0,
                sWidth = 0,
                sTop = 0,
                selectionArray = void 0;
            if (editor) {
                if (index) {
                    var _editor$getBounds = editor.getBounds(index, length || 0),
                        left = _editor$getBounds.left,
                        height = _editor$getBounds.height,
                        top = _editor$getBounds.top,
                        width = _editor$getBounds.width;

                    console.log(left, height, top, width);
                    sLeft = left;
                    sHeight = height;
                    sTop = top;
                    sWidth = width;
                    if (width === 0) {
                        this.interval = setInterval(function () {
                            if (_this3.selection) {
                                if (_this3.selection.style.display === 'block') {
                                    _this3.selection.style.display = 'none';
                                } else {
                                    _this3.selection.style.display = 'block';
                                }
                            }
                        }, 1200);
                    }

                    var containerRect = editor.container.getBoundingClientRect();
                    var startLeaf = editor.getLeaf(index);
                    var endLeaf = editor.getLeaf(index + length);
                    var range = document.createRange();
                    var rects = void 0;

                    // Sanity check
                    if (!startLeaf || !endLeaf || !startLeaf[0] || !endLeaf[0] || startLeaf[1] < 0 || endLeaf[1] < 0 || !startLeaf[0].domNode || !endLeaf[0].domNode) {
                        console.log('default Troubles!');

                        return _react2.default.createElement('span', null);
                    }

                    if (startLeaf[0].domNode.nodeName.toLowerCase() === 'img' || endLeaf[0].domNode.nodeName.toLowerCase() === 'img') {
                        return _react2.default.createElement('span', null);
                    }
                    range.setStart(startLeaf[0].domNode, startLeaf[1]);
                    range.setEnd(endLeaf[0].domNode, endLeaf[1]);
                    rects = window.RangeFix.getClientRects(range);

                    selectionArray = this._updateSelection(rects, containerRect);
                }
            }
            return _react2.default.createElement(
                'div',
                {
                    className: 'weditor-selection',
                    ref: 'selection',
                    style: {
                        diplay: 'block'
                    } },
                selectionArray
            );
        }
    }]);

    return Selection;
}(_react.Component)) || _class) || _class);
exports.default = Selection;