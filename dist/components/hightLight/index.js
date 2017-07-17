/**
 * Created by yeanzhi on 17/4/10.
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

var _util = require('../../lib/util');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _quillEditor = require('../../lib/quillEditor');

var _editor = require('../../model/editor');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.$;

var _default = function (_Component) {
    _inherits(_default, _Component);

    function _default() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, _default);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _default.__proto__ || Object.getPrototypeOf(_default)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            open: false
        }, _this.otherDOMClick = function (e) {
            var node = e.target;
            var target = _this.target;
            if (!_this.state.open) {
                return false;
            }
            if (_this.state.open && !(0, _util.contains)(target, node)) {
                _this.onClose();
            }
        }, _this.onClick = function () {
            _this.setState({
                open: true
            });
            setTimeout(function () {
                $(document).on('click', _this.otherDOMClick);
            }, 100);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(_default, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.target = _reactDom2.default.findDOMNode(this);
            console.log('fdsaf', this.target);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            $(document).off('click', this.otherDOMClick);
        }
    }, {
        key: 'onClose',
        value: function onClose() {
            this.setState({
                open: false
            });
            $(document).off('click', this.otherDOMClick);
        }
    }, {
        key: 'selectBackground',
        value: function selectBackground(color) {
            var _this2 = this;

            return function () {
                _this2.onClose();
                if ((0, _quillEditor.getEditor)()) {
                    var _editor$range = _editor2.default.range,
                        index = _editor$range.index,
                        length = _editor$range.length;

                    (0, _quillEditor.getEditor)().formatText({ index: index, length: length }, 'background', color, 'user');
                }
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'button',
                { className: 'weditor-hightlight' },
                _react2.default.createElement(_icon2.default, { type: 'background', onClick: this.onClick }),
                _react2.default.createElement(
                    'div',
                    { className: 'hightlight-color-panel', style: { display: this.state.open ? 'block' : 'none' } },
                    ['yellow', 'green', 'cyan', 'magenta', 'white', 'darkGray', 'lightGray', 'black', 'blue', 'red', 'darkBlue', 'darkCyan', 'darkGreen', 'darkMagenta', 'darkRed'].map(function (item) {
                        return _react2.default.createElement('span', { style: { background: item }, key: item, onClick: _this3.selectBackground(item) });
                    })
                )
            );
        }
    }]);

    return _default;
}(_react.Component);

exports.default = _default;