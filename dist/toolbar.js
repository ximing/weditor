/**
 * Created by yeanzhi on 17/5/20.
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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _mobxReact = require('mobx-react');

var _util = require('./lib/util');

var _index = require('./components/sizeDropDown/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./components/headerDropDown/index');

var _index4 = _interopRequireDefault(_index3);

var _colorPicker = require('./components/color-picker');

var _colorPicker2 = _interopRequireDefault(_colorPicker);

var _tooltip = require('./components/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _icon = require('./components/icon');

var _icon2 = _interopRequireDefault(_icon);

var _hightLight = require('./components/hightLight');

var _hightLight2 = _interopRequireDefault(_hightLight);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _rcTrigger = require('rc-trigger');

var _rcTrigger2 = _interopRequireDefault(_rcTrigger);

require('rc-trigger/assets/index.css');

var _quillEditor = require('./lib/quillEditor');

var _format = require('./model/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function preventDefault(e) {
    e.preventDefault();
}
var $ = window.jQuery;

var EditorToolbar = (_dec = (0, _mobxReact.inject)(function (state) {
    return {
        rangeFormat: state.editor.format,
        editor: state.editor
    };
}), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
    _inherits(EditorToolbar, _Component);

    function EditorToolbar() {
        _classCallCheck(this, EditorToolbar);

        var _this = _possibleConstructorReturn(this, (EditorToolbar.__proto__ || Object.getPrototypeOf(EditorToolbar)).call(this));

        _this.onWindowResize = function () {
            _this.forceUpdate();
        };

        _this.state = { moreBtnActive: false };

        _this.getPopupContainer = function (trigger) {
            return _reactDom2.default.findDOMNode(_this);
        };

        _this.setColor = function (color) {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().focus();
                (0, _quillEditor.getEditor)().format('color', color, 'user');
            }
        };

        _this.setBackgroundColor = function (color) {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().format('background', color, 'user');
            }
        };

        _this.align = function (e, align) {
            var quillEditor = (0, _quillEditor.getEditor)();
            if (quillEditor) {
                quillEditor.format('align', align, 'user');
            }
        };

        _this.renderAlignButton = function (type, icon) {
            var onMouseDown = function onMouseDown(e) {
                return _this.align(e, type);
            };

            var classname = (0, _classnames2.default)({
                button: true
            });

            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: icon })
            );
        };

        _this.hasMark = function (type) {
            return _this.props.editor.format[type];
        };

        _this.hasBlock = function (type, val) {
            if (val) {
                return _this.props.editor.format[type] === val;
            } else {
                return _this.props.editor.format[type];
            }
        };

        _this.renderMarkButton = function (type, icon) {
            var isActive = _this.hasMark(type);
            var onMouseDown = function onMouseDown(e) {
                return _this.onClickMark(e, type);
            };
            var classname = (0, _classnames2.default)({
                button: true,
                active: isActive
            });
            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: icon })
            );
        };

        _this.renderBlockButton = function (type, icon, val) {
            var isActive = _this.hasBlock(type, val);
            var onMouseDown = function onMouseDown(e) {
                return _this.onClickBlock(e, type, val);
            };
            var classname = (0, _classnames2.default)({
                button: true,
                active: isActive
            });
            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: icon })
            );
        };

        _this.onClickMark = function (e, type) {
            e.preventDefault();
            var quillEditor = (0, _quillEditor.getEditor)();
            console.log('mark click', quillEditor, type);
            if (quillEditor) {
                if (_this.hasMark(type)) {
                    quillEditor.format(type, false, 'user');
                } else {
                    quillEditor.format(type, true, 'user');
                }
            }
        };

        _this.onClickBlock = function (e, type, val) {
            e.preventDefault();
            var quillEditor = (0, _quillEditor.getEditor)();
            if (quillEditor) {
                console.log(_this.hasBlock(type), _this.props.editor.format[type], type);
                if (_this.hasBlock(type)) {
                    if (_this.props.editor.format[type] === val) {
                        quillEditor.format(type, false, 'user');
                    } else {
                        quillEditor.format(type, val, 'user');
                    }
                } else {
                    if (val) {
                        quillEditor.format(type, val, 'user');
                    } else {
                        quillEditor.format(type, true, 'user');
                    }
                }
            }
        };

        _this.clearFormat = function () {
            if ((0, _quillEditor.getEditor)()) {
                var _getEditor$getSelecti = (0, _quillEditor.getEditor)().getSelection(),
                    index = _getEditor$getSelecti.index,
                    length = _getEditor$getSelecti.length;

                if (index === 0 || !!index) {
                    (0, _quillEditor.getEditor)().removeFormat(index, length, 'user');
                }
            }
        };

        _this.undo = function () {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().history.undo();
            }
        };

        _this.redo = function () {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().history.redo();
            }
        };

        _this.formatPainter = function () {
            var _getEditor$getSelecti2 = (0, _quillEditor.getEditor)().getSelection(),
                index = _getEditor$getSelecti2.index,
                length = _getEditor$getSelecti2.length;

            if (index >= 0) {
                _format2.default.currentFormat = (0, _quillEditor.getEditor)().getFormat(index, length);
            }
        };

        _this.onPopupVisibleChange = function (visible) {
            _this.setState({
                moreBtnActive: visible
            });
        };

        _this.renderLinkBtn = function () {
            var isActive = _this.hasMark('link');
            var onMouseDown = function onMouseDown(e) {
                if ((0, _quillEditor.getEditor)()) {
                    var toolbar = (0, _quillEditor.getEditor)().getModule('toolbar');
                    toolbar.handlers['link'].call(toolbar, !_this.props.editor.format['link']);
                }
            };
            var classname = (0, _classnames2.default)({
                button: true,
                active: isActive
            });
            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: 'link' })
            );
        };

        _this.renderImageBtn = function () {
            var onMouseDown = function onMouseDown(e) {
                if ((0, _quillEditor.getEditor)()) {
                    var toolbar = (0, _quillEditor.getEditor)().getModule('toolbar');
                    toolbar.handlers['image'].call(toolbar, !_this.props.editor.format['image']);
                }
                $(document).trigger('click');
            };
            var classname = (0, _classnames2.default)({
                button: true
            });
            return _react2.default.createElement(
                'button',
                { className: classname, onMouseDown: onMouseDown },
                _react2.default.createElement(_icon2.default, { type: 'image' })
            );
        };

        _this.renderMore = function () {
            return _react2.default.createElement(
                'span',
                { className: 'more-toolbar-container', onClick: preventDefault },
                _react2.default.createElement(
                    'div',
                    { className: 'popup-triangle-wrapper' },
                    _react2.default.createElement('div', { className: 'popup-triangle-inner' })
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
                            '\u6709\u5E8F\u5217\u8868 ',
                            (0, _util.getCtrl)(),
                            '+Option+L'
                        )
                    },
                    _this.renderBlockButton('list', 'ol', 'ordered')
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
                            '\u65E0\u5E8F\u5217\u8868 ',
                            (0, _util.getCtrl)(),
                            '+Option+U'
                        )
                    },
                    _this.renderBlockButton('list', 'ul', 'bullet')
                ),
                _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                _react2.default.createElement(
                    _tooltip2.default,
                    {
                        placement: 'bottom',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: _react2.default.createElement(
                            'div',
                            null,
                            '\u5DE6\u5BF9\u9F50 ',
                            (0, _util.getCtrl)(),
                            '+Shift+L'
                        )
                    },
                    _this.renderAlignButton('left', 'left-align')
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
                            '\u5C45\u4E2D\u5BF9\u9F50 ',
                            (0, _util.getCtrl)(),
                            '+Shift+E'
                        )
                    },
                    _this.renderAlignButton('center', 'center-align')
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
                            '\u53F3\u5BF9\u9F50 ',
                            (0, _util.getCtrl)(),
                            '+Shift+R'
                        )
                    },
                    _this.renderAlignButton('right', 'right-align')
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
                            '\u4E24\u7AEF\u5BF9\u9F50 ',
                            (0, _util.getCtrl)(),
                            '+Shift+J'
                        )
                    },
                    _this.renderAlignButton('justify', 'justify-align')
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
                            '\u51CF\u5C11\u7F29\u8FDB'
                        )
                    },
                    _this.renderBlockButton('indent', 'left-indent', '-1')
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
                    _this.renderBlockButton('indent', 'right-indent', '+1')
                ),
                _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                _react2.default.createElement(
                    _tooltip2.default,
                    {
                        placement: 'bottom',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: _react2.default.createElement(
                            'div',
                            null,
                            '\u63D2\u5165\u94FE\u63A5'
                        )
                    },
                    _this.renderLinkBtn()
                ),
                _react2.default.createElement(
                    _tooltip2.default,
                    {
                        placement: 'bottomRight',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: _react2.default.createElement(
                            'div',
                            null,
                            '\u63D2\u5165\u56FE\u7247'
                        )
                    },
                    _this.renderImageBtn()
                )
            );
        };

        return _this;
    }

    _createClass(EditorToolbar, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            $(window).on('resize', this.onWindowResize);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            $(window).off('resize', this.onWindowResize);
        }

        /**
         * Check if the current selection has a mark with `type` in it.
         *
         * @param {String} type
         * @return {Boolean}
         */

        /**
         * Check if the any of the currently selected blocks are of `type`.
         *
         * @param {String} type
         * @param {String} val
         * @return {Boolean}
         */

        /**
         * Render a mark-toggling toolbar button.
         *
         * @param {String} type
         * @param {String} icon
         * @return {Element}
         */

        /**
         * Render a block-toggling toolbar button.
         *
         * @param {String} type
         * @param {String} icon
         * @param {String} val
         * @return {Element}
         */

        /**
         * When a mark button is clicked, toggle the current mark.
         *
         * @param {Event} e
         * @param {String} type
         */

        /**
         * When a block button is clicked, toggle the block type.
         *
         * @param {Event} e
         * @param {String} type
         * @param {String} val
         */

    }, {
        key: 'renderMoreBtn',
        value: function renderMoreBtn() {
            var btnClassName = (0, _classnames2.default)({
                'more-btn': true,
                'active': this.state.moreBtnActive
            });
            return _react2.default.createElement(
                _rcTrigger2.default,
                {
                    style: { zIndex: 400000 },
                    popupClassName: 'popup-opver-wrapper more-popup-opver-wrapper',
                    getPopupContainer: this.getPopupContainer,
                    popupPlacement: 'bottomRight',
                    builtinPlacements: {
                        bottomLeft: {
                            points: ['tl', 'bl']
                        },
                        bottomRight: {
                            points: ['tr', 'br']
                        },
                        bottom: {
                            points: ['tc', 'bc']
                        }
                    },
                    popupAlign: {
                        offset: [16, 12],
                        overflow: {
                            adjustX: 1,
                            adjustY: 1
                        } },
                    destroyPopupOnHide: false,
                    zIndex: 40,
                    defaultPopupVisible: false,
                    mask: false,
                    action: ['click'],
                    popup: this.renderMore(),
                    popupTransitionName: '',
                    onPopupVisibleChange: this.onPopupVisibleChange
                },
                _react2.default.createElement(
                    'button',
                    { className: btnClassName, onClick: preventDefault },
                    '\u66F4\u591A ',
                    _react2.default.createElement(_icon2.default, { type: 'triangle' })
                )
            )
            //rc-trigger-popup-zoom
            ;
        }
    }, {
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
            return _react2.default.createElement(
                'div',
                { className: 'toolbar-opver', id: 'toolbarOpver' },
                _react2.default.createElement(
                    _tooltip2.default,
                    {
                        placement: 'bottomLeft',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: _react2.default.createElement(
                            'div',
                            null,
                            '\u64A4\u9500(',
                            (0, _util.getCtrl)(),
                            '+Z)'
                        )
                    },
                    _react2.default.createElement(
                        'button',
                        { onClick: this.undo },
                        _react2.default.createElement(_icon2.default, { type: 'undo' })
                    )
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
                            '\u91CD\u505A(',
                            (0, _util.getCtrl)(),
                            '+Y)'
                        )
                    },
                    _react2.default.createElement(
                        'button',
                        { onClick: this.redo },
                        _react2.default.createElement(_icon2.default, { type: 'redo' })
                    )
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
                            '\u683C\u5F0F\u5237'
                        )
                    },
                    _react2.default.createElement(
                        'button',
                        { onClick: this.formatPainter },
                        _react2.default.createElement(_icon2.default, { type: 'format' })
                    )
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
                            '\u6E05\u9664\u683C\u5F0F ',
                            (0, _util.getCtrl)(),
                            '+Shift+C'
                        )
                    },
                    _react2.default.createElement(
                        'button',
                        { className: 'ql-clear-format', onClick: this.clearFormat },
                        _react2.default.createElement(_icon2.default, { type: 'clear' })
                    )
                ),
                _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                _react2.default.createElement(_index4.default, { val: header }),
                _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                _react2.default.createElement(_index2.default, { size: size }),
                _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                _react2.default.createElement(
                    _tooltip2.default,
                    {
                        placement: 'bottom',
                        mouseEnterDelay: 0,
                        mouseLeaveDelay: 0,
                        overlay: _react2.default.createElement(
                            'div',
                            null,
                            '\u52A0\u7C97 ',
                            (0, _util.getCtrl)(),
                            '+B'
                        )
                    },
                    this.renderMarkButton('bold', 'bold')
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
                            '\u659C\u4F53 ',
                            (0, _util.getCtrl)(),
                            '+I'
                        )
                    },
                    this.renderMarkButton('italic', 'italic')
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
                            '\u5220\u9664\u7EBF ',
                            (0, _util.getCtrl)(),
                            '+Shift+S'
                        )
                    },
                    this.renderMarkButton('strike', 'strike')
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
                            '\u4E0B\u5212\u7EBF ',
                            (0, _util.getCtrl)(),
                            '+U'
                        )
                    },
                    this.renderMarkButton('underline', 'underline')
                ),
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
                    _react2.default.createElement(_colorPicker2.default, { onChangeComplete: this.setColor, defaultColor: color, icon: _react2.default.createElement(_icon2.default, { type: 'color' }) })
                ),
                _react2.default.createElement(_icon2.default, { type: 'vertical' }),
                window.innerWidth < 900 ? this.renderMoreBtn() : this.renderMore()
            );
        }
    }]);

    return EditorToolbar;
}(_react.Component)) || _class) || _class);
exports.default = EditorToolbar;