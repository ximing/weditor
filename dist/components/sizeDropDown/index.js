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

var _editor = require('../../model/editor');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;
var fontSizeMap = {
    '': '小四',
    '42pt': '初号',
    '36pt': '小初',
    '26pt': '一号',
    '24pt': '小一',
    '22pt': '二号',
    '18pt': '小二',
    '15pt': '三号',
    '14.5pt': '小三',
    '14pt': '四号',
    '12pt': '小四',
    '10.5pt': '五号',
    '9pt': '小五',
    '7.5pt': '六号',
    '6.5pt': '小六',
    '5.5pt': '七号',
    '5pt': '八号'
};
function changeSize(e) {
    if ((0, _quillEditor.getEditor)()) {
        var _editor$range = _editor2.default.range,
            index = _editor$range.index,
            length = _editor$range.length;

        (0, _quillEditor.getEditor)().setSelection(index, length, 'user');
        (0, _quillEditor.getEditor)().format('size', $(e.target).data('size'), 'user');
    }
}

var SizeDropDown = function (_Component) {
    _inherits(SizeDropDown, _Component);

    function SizeDropDown() {
        _classCallCheck(this, SizeDropDown);

        var _this = _possibleConstructorReturn(this, (SizeDropDown.__proto__ || Object.getPrototypeOf(SizeDropDown)).call(this));

        _this.formatSize = function (size) {
            size = Number.parseFloat(size, 10);
            if (isNaN(size)) {
                return '12pt';
            } else if (size > 72) {
                return '72pt';
            } else if (size < 5) {
                return '5pt';
            } else {
                return size + 'pt';
            }
        };

        _this.changeSize = function (value) {
            _this.setState({ value: value });
        };

        _this.closePanel = function () {
            _this.setState({ open: false });
            $(document).off('click', _this.closePanel);
        };

        _this.inputClick = function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            $(document).on('click', _this.closePanel);
            _this.setState({ open: true });
        };

        _this.handleKeyPress = function (e) {
            if (e.key === 'Enter') {
                _this.closePanel();
                if ((0, _quillEditor.getEditor)()) {
                    (0, _quillEditor.getEditor)().format('size', _this.formatSize(_this.input.value), 'user');
                }
            }
        };

        _this.state = {
            value: 12,
            open: false
        };
        return _this;
    }

    _createClass(SizeDropDown, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            $('#xm-size-p').on('click', 'p', changeSize);
            this.setState({
                value: this.props.size,
                open: false
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            $('#xm-size-p').off('click', 'p', changeSize);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.input) {
                var val = this.formatSize(nextProps.size);
                this.input.value = fontSizeMap[val] || val;
            }
        }
    }, {
        key: 'render',

        //                       {/*onChange={this.changeSize}*/}

        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'xm-size' },
                _react2.default.createElement('input', {
                    className: 'xm-size-input',
                    onClick: this.inputClick,
                    onKeyPress: this.handleKeyPress,
                    ref: function ref(input) {
                        return _this2.input = input;
                    },
                    type: 'text' }),
                _react2.default.createElement('div', { className: 'xm-size-button-dropdown' }),
                _react2.default.createElement(
                    'div',
                    {
                        className: 'xm-size-p',
                        id: 'xm-size-p',
                        style: {
                            display: this.state.open ? 'block' : 'none'
                        } },
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '42pt' },
                        '\u521D\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '36pt' },
                        '\u5C0F\u521D'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '26pt' },
                        '\u4E00\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '24pt' },
                        '\u5C0F\u4E00'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '22pt' },
                        '\u4E8C\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '18pt' },
                        '\u5C0F\u4E8C'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '15pt' },
                        '\u4E09\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '14.5pt' },
                        '\u5C0F\u4E09'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '14pt' },
                        '\u56DB\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '12pt' },
                        '\u5C0F\u56DB'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '10.5pt' },
                        '\u4E94\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '9pt' },
                        '\u5C0F\u4E94'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '7.5pt' },
                        '\u516D\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '6.5pt' },
                        '\u5C0F\u516D'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '5.5pt' },
                        '\u4E03\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '5pt' },
                        '\u516B\u53F7'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '5pt' },
                        '5'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '5.5pt' },
                        '5.5'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '6.5pt' },
                        '6.5'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '7.5pt' },
                        '7.5'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '8pt' },
                        '8'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '9pt' },
                        '9'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '10pt' },
                        '10'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '10.5pt' },
                        '10.5'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '11pt' },
                        '11'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '12pt' },
                        '12'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '14pt' },
                        '14'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '16pt' },
                        '16'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '18pt' },
                        '18'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '20pt' },
                        '20'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '22pt' },
                        '22'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '24pt' },
                        '24'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '26pt' },
                        '26'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '28pt' },
                        '28'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '36pt' },
                        '36'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '48pt' },
                        '48'
                    ),
                    _react2.default.createElement(
                        'p',
                        { 'data-size': '72pt' },
                        '72'
                    )
                )
            );
        }
    }]);

    return SizeDropDown;
}(_react.Component);

exports.default = SizeDropDown;