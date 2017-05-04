/**
 * Created by yeanzhi on 17/2/16.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _omit = require('omit.js');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _default = (_temp = _class = function (_Component) {
    _inherits(_default, _Component);

    function _default() {
        _classCallCheck(this, _default);

        var _this = _possibleConstructorReturn(this, (_default.__proto__ || Object.getPrototypeOf(_default)).call(this));

        _this.state = {
            processing: false
        };

        _this.onClick = _this.onClick.bind(_this);
        return _this;
    }

    _createClass(_default, [{
        key: 'reset',


        // 重置,回到初始状态
        value: function reset() {
            this.setState({ processing: false });
        }
    }, {
        key: 'onClick',
        value: function onClick(SyntheticEvent) {
            var _props = this.props,
                disabled = _props.disabled,
                onClick = _props.onClick,
                async = _props.async;

            if (disabled) {
                return;
            }

            if (async) {
                if (!this.state.processing) {
                    this.setState({ processing: true });
                } else {
                    return;
                }
            }
            onClick(SyntheticEvent, this);
        }
    }, {
        key: 'render',
        value: function render() {
            var _classNames;

            var _props2 = this.props,
                prefixCls = _props2.prefixCls,
                color = _props2.color,
                type = _props2.type;

            var otherProps = (0, _omit2.default)(this.props, ['prefixCls', 'color', 'type', 'children']);
            var classes = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, prefixCls, true), _defineProperty(_classNames, prefixCls + '-' + color, color), _classNames));
            return _react2.default.createElement('input', _extends({ type: 'button',
                value: this.props.children,
                onClick: this.onClick,
                className: classes
            }, otherProps));
        }
    }]);

    return _default;
}(_react.Component), _class.defaultProps = {
    prefixCls: 'nx-btn',
    color: 'blue',
    type: '',
    onClick: function onClick() {},
    disabled: false
}, _temp);

exports.default = _default;