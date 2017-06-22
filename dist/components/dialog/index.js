/**
 * Created by yeanzhi on 17/2/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

require('./index.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = (_temp = _class = function (_Component) {
    _inherits(Dialog, _Component);

    function Dialog() {
        _classCallCheck(this, Dialog);

        return _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).apply(this, arguments));
    }

    _createClass(Dialog, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                prefixCls = _props.prefixCls,
                title = _props.title,
                content = _props.content,
                buttons = _props.buttons,
                btnCls = _props.btnCls,
                onClose = _props.onClose,
                hasHeader = _props.hasHeader,
                className = _props.className;

            var cls = prefixCls; //样式待定
            return _react2.default.createElement(
                'div',
                { className: 'nx-modal-mask' },
                _react2.default.createElement(
                    'div',
                    { className: cls + '-wrapper' },
                    _react2.default.createElement(
                        'div',
                        { className: cls + ' ' + cls + '-normal ' + className },
                        hasHeader ? _react2.default.createElement(
                            'div',
                            { className: cls + '-title' },
                            title,
                            _react2.default.createElement(
                                'span',
                                { className: 'nx-dialog-icon' },
                                _react2.default.createElement(_icon2.default, { type: 'close', onClick: onClose })
                            )
                        ) : null,
                        _react2.default.createElement(
                            'div',
                            { className: cls + '-content' },
                            content
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: cls + '-buttons' },
                            buttons.map(function (_ref, i) {
                                var text = _ref.text,
                                    type = _ref.type,
                                    action = _ref.action;
                                return _react2.default.createElement(
                                    _button2.default,
                                    {
                                        key: i,
                                        cls: 'nx_button',
                                        onClick: action || onClose
                                    },
                                    text
                                );
                            })
                        )
                    )
                )
            );
        }
    }]);

    return Dialog;
}(_react.Component), _class.defaultProps = {
    prefixCls: 'nx-dialog',
    hasHeader: true, //是否有header
    content: null,
    buttons: []
}, _temp);
exports.default = Dialog;