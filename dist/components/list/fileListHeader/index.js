/**
 * @Creator: Liuyanqing
 * @Date: 11/9/16
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileListHeader = function (_Component) {
    _inherits(FileListHeader, _Component);

    function FileListHeader() {
        _classCallCheck(this, FileListHeader);

        return _possibleConstructorReturn(this, (FileListHeader.__proto__ || Object.getPrototypeOf(FileListHeader)).apply(this, arguments));
    }

    _createClass(FileListHeader, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'yp-file-list-header' },
                _react2.default.createElement(
                    'span',
                    { className: 'list-header-title list-header-title-name' },
                    '\u540D\u79F0'
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'list-header-right' },
                    _react2.default.createElement(
                        'span',
                        { className: 'list-header-title list-header-title-size' },
                        '\u5927\u5C0F'
                    ),
                    _react2.default.createElement(
                        'span',
                        { className: 'list-header-title list-header-title-uts' },
                        '\u66F4\u65B0\u65F6\u95F4'
                    )
                )
            );
        }
    }]);

    return FileListHeader;
}(_react.Component);

exports.default = FileListHeader;