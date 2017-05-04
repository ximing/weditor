/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('./components/icon/index');

var _index2 = _interopRequireDefault(_index);

var _printThis = require('./lib/printThis');

var _printThis2 = _interopRequireDefault(_printThis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;
(0, _printThis2.default)($);
// import {inject,observer} from 'mobx-react'

var CommonEditor = function (_Component) {
    _inherits(CommonEditor, _Component);

    function CommonEditor() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CommonEditor);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommonEditor.__proto__ || Object.getPrototypeOf(CommonEditor)).call.apply(_ref, [this].concat(args))), _this), _this.print = function () {
            $('.ql-editor').printThis({
                pageTitle: '',
                header: null,
                footer: null
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CommonEditor, [{
        key: 'render',
        value: function render() {
            var style = this.props.style;

            return _react2.default.createElement(
                'span',
                { className: 'ql-formats file-header', style: style },
                _react2.default.createElement(
                    'button',
                    { className: 'ql-ordinaryprint ', onClick: this.print },
                    _react2.default.createElement(_index2.default, { type: 'ordinaryprint' })
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-pdf opver-area' },
                    _react2.default.createElement('span', { className: 'opver-icon  pdf-icon' }),
                    _react2.default.createElement(
                        'span',
                        null,
                        '\u5BFC\u51FApdf'
                    )
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-word opver-area' },
                    _react2.default.createElement('span', { className: 'opver-icon word-icon' }),
                    _react2.default.createElement(
                        'span',
                        null,
                        '\u5BFC\u51FAword'
                    )
                )
            );
        }
    }]);

    return CommonEditor;
}(_react.Component);

exports.default = CommonEditor;