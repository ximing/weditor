/**
 * Created by yeanzhi on 17/3/19.
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

var _index = require('./components/sizeDropDown/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./components/headerDropDown/index');

var _index4 = _interopRequireDefault(_index3);

var _colorPicker = require('./components/color-picker');

var _colorPicker2 = _interopRequireDefault(_colorPicker);

var _quillEditor = require('./lib/quillEditor');

var _tooltip = require('./components/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _mobxReact = require('mobx-react');

var _icon = require('./components/icon');

var _icon2 = _interopRequireDefault(_icon);

var _hightLight = require('./components/hightLight');

var _hightLight2 = _interopRequireDefault(_hightLight);

var _insertHeader = require('./insertHeader');

var _insertHeader2 = _interopRequireDefault(_insertHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StartHeader = (_dec = (0, _mobxReact.inject)(function (state) {
    return {
        rangeFormat: state.editor.format
    };
}), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
    _inherits(StartHeader, _Component);

    function StartHeader() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, StartHeader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = StartHeader.__proto__ || Object.getPrototypeOf(StartHeader)).call.apply(_ref, [this].concat(args))), _this), _this.setColor = function (color) {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().focus();
                (0, _quillEditor.getEditor)().format('color', color, 'user');
            }
        }, _this.setBackgroundColor = function (color) {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().format('background', color, 'user');
            }
        }, _this.align = function (align) {
            return function () {
                var quillEditor = (0, _quillEditor.getEditor)();
                if (quillEditor) {
                    // const {index,length} = editor.range;
                    // if(index===0 || !!index){
                    //     quillEditor.formatLine(index,length,'align',align);
                    // }
                    quillEditor.format('align', align, 'user');
                }
            };
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }
    //行高
    // quill.addStyles({
    //     'div': { 'line-height': '24px' }
    // });

    _createClass(StartHeader, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                rangeFormat = _props.rangeFormat,
                style = _props.style;
            var color = rangeFormat.color,
                background = rangeFormat.background,
                size = rangeFormat.size,
                header = rangeFormat.header;

            if (Array.isArray(color)) {
                color = '#FFFFFF';
            }
            if (Array.isArray(background)) {
                background = '#FFFFFF';
            }
            // if(!!header){
            //     header = `h${header}`
            // }else{
            //     header = 'normal';
            // }
            return _react2.default.createElement(
                'span',
                { className: 'ql-formats start-header', style: style },
                _react2.default.createElement(
                    'span',
                    { className: 'ql-formats' },
                    _react2.default.createElement(_index4.default, { val: header })
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-formats' },
                    _react2.default.createElement(_index2.default, { size: size })
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-formats' },
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u52A0\u7C97 ctrl+b'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-bold' })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u659C\u4F53 ctrl+i'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-italic' })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u5220\u9664\u7EBF ctrl+shift+s'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-strike' })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u4E0B\u5212\u7EBF ctrl+u'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-underline' })
                    )
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-formats' },
                    _react2.default.createElement(_hightLight2.default, null),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u5B57\u4F53\u989C\u8272'
                            )
                        },
                        _react2.default.createElement(_colorPicker2.default, { onChangeComplete: this.setColor, defaultColor: color, icon: _react2.default.createElement(
                                'span',
                                { className: 'ql-defalut-color' },
                                _react2.default.createElement(
                                    'svg',
                                    { viewBox: '0 0 18 18' },
                                    _react2.default.createElement('line', { className: 'ql-color-label ql-stroke', x1: '3', x2: '15', y1: '15', y2: '15',
                                        style: { stroke: color } }),
                                    _react2.default.createElement('polyline', { className: 'ql-stroke', points: '5.5 11 9 3 12.5 11',
                                        style: { stroke: color === '#FFFFFF' ? '#000000' : color } }),
                                    _react2.default.createElement('line', { className: 'ql-stroke', x1: '11.63', x2: '6.38', y1: '9', y2: '9',
                                        style: { stroke: color === '#FFFFFF' ? '#000000' : color } })
                                )
                            ) })
                    ),
                    _react2.default.createElement(_icon2.default, { type: 'vertical' })
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-formats' },
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u6709\u5E8F\u5217\u8868 ctrl+Option+L'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-list', value: 'ordered' })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u65E0\u5E8F\u5217\u8868 ctrl+Option+U'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-list', value: 'bullet' })
                    )
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-formats' },
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u5DE6\u5BF9\u9F50 Ctrl+Shift+L'
                            )
                        },
                        _react2.default.createElement(_icon2.default, { type: 'left-align', onClick: this.align('left') })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u5C45\u4E2D\u5BF9\u9F50 Ctrl+Shift+E'
                            )
                        },
                        _react2.default.createElement(_icon2.default, { type: 'center-align', onClick: this.align('center') })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u53F3\u5BF9\u9F50 Ctrl+Shift+R'
                            )
                        },
                        _react2.default.createElement(_icon2.default, { type: 'right-align', onClick: this.align('right') })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u4E24\u7AEF\u5BF9\u9F50 Ctrl+Shift+J'
                            )
                        },
                        _react2.default.createElement(_icon2.default, { type: 'justify-align', onClick: this.align('justify') })
                    )
                ),
                _react2.default.createElement(
                    'span',
                    { className: 'ql-formats' },
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u51CF\u5C11\u7F29\u8FDB'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-indent', value: '-1' })
                    ),
                    _react2.default.createElement(
                        _tooltip2.default,
                        {
                            placement: 'bottom',
                            mouseEnterDelay: 0,
                            mouseLeaveDelay: 0,
                            overlay: _react2.default.createElement(
                                'div',
                                null,
                                '\u589E\u52A0\u7F29\u8FDB'
                            )
                        },
                        _react2.default.createElement('button', { className: 'ql-indent', value: '+1' })
                    ),
                    _react2.default.createElement(_icon2.default, { type: 'vertical' })
                ),
                _react2.default.createElement(_insertHeader2.default, null)
            );
        }
    }]);

    return StartHeader;
}(_react.Component)) || _class) || _class);
exports.default = StartHeader;