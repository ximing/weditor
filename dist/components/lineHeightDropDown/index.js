/**
 * Created by yeanzhi on 17/3/16.
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

var _quillEditor = require('../../lib/quillEditor');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;

var SizeDropDown = function (_Component) {
    _inherits(SizeDropDown, _Component);

    function SizeDropDown() {
        _classCallCheck(this, SizeDropDown);

        var _this = _possibleConstructorReturn(this, (SizeDropDown.__proto__ || Object.getPrototypeOf(SizeDropDown)).call(this));

        _this.changeLineHeight = function (value) {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().format('lineHeight', value, 'user');
            }
        };

        _this.closePanel = function () {
            _this.setState({ open: false });
            $(document).off('click', _this.closePanel);
        };

        _this.inputClick = function (e) {
            // e.stopPropagation();
            // e
            //     .nativeEvent
            //     .stopImmediatePropagation();
            console.log('size this.state.open', _this.state.open);
            _this.setState({ open: !_this.state.open });
            if (!_this.state.open) {
                setTimeout(function () {
                    $(document).on('click', _this.closePanel);
                }, 10);
            }
        };

        _this.handleKeyPress = function (e) {
            _this.changeLineHeight(e.target.getAttribute("data-size") || '1');
            _this.closePanel();
            $(document).off('click', _this.closePanel);
        };

        _this.state = {
            open: false
        };
        return _this;
    }

    _createClass(SizeDropDown, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setState({
                open: false
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // if (this.input) {
            //     let val = this.formatSize(nextProps.size);
            //     this.input.value = fontSizeMap[val] || val;
            // }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'xm-lineheight' },
                _react2.default.createElement(_icon2.default, { type: 'lineheight', onClick: this.inputClick }),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'xm-size-p',
                        id: 'xm-size-p',
                        style: {
                            display: this.state.open ? 'block' : 'none'
                        }, onClick: this.handleKeyPress },
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '1' },
                        '1'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '1.15' },
                        '1.15'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '1.35' },
                        '1.35'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '1.5' },
                        '1.5'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '2' },
                        '2'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '2.5' },
                        '2.5'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '3' },
                        '3'
                    )
                )
            );
        }
    }]);

    return SizeDropDown;
}(_react.Component);

exports.default = SizeDropDown;