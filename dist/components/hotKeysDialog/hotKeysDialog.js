/**
 * Created by yeanzhi on 17/4/4.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dialog = require('../dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _help = require('../../model/help');

var _help2 = _interopRequireDefault(_help);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HotKeysDialog = function (_Component) {
    _inherits(HotKeysDialog, _Component);

    function HotKeysDialog() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, HotKeysDialog);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HotKeysDialog.__proto__ || Object.getPrototypeOf(HotKeysDialog)).call.apply(_ref, [this].concat(args))), _this), _this.closeDialog = function () {
            _help2.default.hotKeysDialog = false;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(HotKeysDialog, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_dialog2.default, {
                title: '\u952E\u76D8\u5FEB\u6377\u952E',
                className: 'weditor-hotkeys-dialog',
                content: _react2.default.createElement(
                    'div',
                    { className: 'weditor-hotkeys-inner' },
                    _react2.default.createElement(
                        'table',
                        {
                            cellPadding: '0',
                            tabIndex: '0',
                            className: 'apps-shortcutshelppopup-content'
                        },
                        _react2.default.createElement(
                            'tbody',
                            null,
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'th',
                                    { colSpan: '2' },
                                    _react2.default.createElement(
                                        'h3',
                                        {
                                            className: 'apps-shortcutshelppopup-content-header apps-shortcutshelppopup-content-header-first' },
                                        '\u6587\u672C\u683C\u5F0F'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u7C97\u4F53'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318B'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u659C\u4F53'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318I'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u52A0\u4E0B\u5212\u7EBF'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318U'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5220\u9664\u7EBF'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Shift+X'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u6E05\u9664\u683C\u5F0F'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Shift+C'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'th',
                                    { colSpan: '2' },
                                    _react2.default.createElement(
                                        'h3',
                                        { className: 'apps-shortcutshelppopup-content-header' },
                                        '\u6BB5\u843D\u683C\u5F0F'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5E94\u7528\u201C\u666E\u901A\u6587\u672C\u201D'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Alt+0'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5E94\u7528\u201C\u6807\u98981\u201D'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Shift+1'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5E94\u7528\u201C\u6807\u98982\u201D'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Alt+2'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5E94\u7528\u201C\u6807\u98983\u201D'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Alt+3'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5E94\u7528\u201C\u6807\u98984\u201D'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Alt+4'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5E94\u7528\u201C\u6807\u98985\u201D'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Alt+5'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5E94\u7528\u201C\u6807\u98986\u201D'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Alt+6'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5DE6\u5BF9\u9F50\u6587\u672C'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Shift+L'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5C45\u4E2D\u5BF9\u9F50\u6587\u672C'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Shift+E'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u53F3\u5BF9\u9F50\u6587\u672C'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Shift+R'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u5BF9\u9F50\u6587\u672C'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Shift+J'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u6709\u5E8F\u5217\u8868'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Option+l'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u65E0\u5E8F\u5217\u8868'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+Option+u'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'th',
                                    { colSpan: '2' },
                                    _react2.default.createElement(
                                        'h3',
                                        { className: 'apps-shortcutshelppopup-content-header' },
                                        '\u7F16\u8F91'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u64A4\u9500'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+z'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-desc apps-shortcutshelppopup-content-element' },
                                    '\u91CD\u505A'
                                ),
                                _react2.default.createElement(
                                    'td',
                                    {
                                        className: 'apps-shortcutshelppopup-shortcut-key apps-shortcutshelppopup-content-element' },
                                    _react2.default.createElement(
                                        'span',
                                        null,
                                        '\u2318+y'
                                    )
                                )
                            )
                        )
                    )
                ),
                onClose: this.closeDialog
            });
        }
    }]);

    return HotKeysDialog;
}(_react.Component);

exports.default = HotKeysDialog;