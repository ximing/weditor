/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/7
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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _swatch = require('./swatch');

var _swatch2 = _interopRequireDefault(_swatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _default = (_temp = _class = function (_Component) {
    _inherits(_default, _Component);

    function _default() {
        _classCallCheck(this, _default);

        return _possibleConstructorReturn(this, (_default.__proto__ || Object.getPrototypeOf(_default)).apply(this, arguments));
    }

    _createClass(_default, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                colors = _props.colors,
                onClick = _props.onClick,
                title = _props.title,
                noWrap = _props.noWrap,
                onHover = _props.onHover;

            var body = colors.map(function (color, i) {
                return _react2.default.createElement(_swatch2.default, { color: color, onClick: onClick, onHover: onHover, key: i });
            });
            var xmColorPickerBlock = (0, _classnames2.default)({
                'xm-color-picker-block': true,
                noWrap: noWrap
            });
            return _react2.default.createElement(
                'div',
                { className: xmColorPickerBlock },
                _react2.default.createElement(
                    'div',
                    { className: 'xm-color-picker-block-title' },
                    title
                ),
                body
            );
        }
    }]);

    return _default;
}(_react.Component), _class.defaultProps = {
    colors: [],
    onClick: function onClick(color, e) {},
    onHover: function onHover(color, e) {},
    title: '默认title',
    noWrap: true
}, _class.propTypes = {
    colors: _react.PropTypes.array,
    onClick: _react.PropTypes.func,
    title: _react.PropTypes.string,
    noWrap: _react.PropTypes.bool
}, _temp);

exports.default = _default;