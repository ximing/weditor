/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import './index.scss';
import React, { Component } from "react";
import { getEditor } from '../../lib/quillEditor';
import editor from '../../model/editor';

var HeaderDropDown = function (_Component) {
    _inherits(HeaderDropDown, _Component);

    function HeaderDropDown() {
        _classCallCheck(this, HeaderDropDown);

        var _this = _possibleConstructorReturn(this, (HeaderDropDown.__proto__ || Object.getPrototypeOf(HeaderDropDown)).call(this));

        _this.changeSize = function (e) {
            if (getEditor()) {
                var _editor$range = editor.range,
                    index = _editor$range.index,
                    length = _editor$range.length;

                getEditor().setSelection(index, length, 'user');
                getEditor().format('header', $(e.target).data('size'), 'user');
                _this.setState({
                    value: !!$(e.target).data('size') ? '\u6807\u9898' + $(e.target).data('size') : '正文'
                });
            }
        };

        _this.closePanel = function () {
            _this.setState({ open: false });
            $(document).off('click', _this.closePanel);
        };

        _this.spanClick = function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            // window     .quillEditor     .focus();
            $(document).on('click', _this.closePanel);
            _this.setState({ open: true });
        };

        _this.state = {
            open: false,
            value: '正文'
        };
        return _this;
    }

    _createClass(HeaderDropDown, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            $('#xm-size-h').on('click', '.o-p-h', this.changeSize);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            $('#xm-size-h').off('click', '.o-p-h', this.changeSize);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.span) {
                var header = nextProps.val;
                if (!header) {
                    this.setState({
                        value: '正文'
                    });
                } else {
                    this.setState({
                        value: '\u6807\u9898' + header
                    });
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                { className: 'xm-header' },
                React.createElement(
                    'span',
                    {
                        className: 'xm-header-span',
                        onClick: this.spanClick,
                        ref: function ref(span) {
                            return _this2.span = span;
                        } },
                    this.state.value
                ),
                React.createElement('div', { className: 'xm-size-button-dropdown' }),
                React.createElement(
                    'div',
                    {
                        className: 'xm-size-h',
                        id: 'xm-size-h',
                        style: {
                            display: this.state.open ? 'block' : 'none'
                        } },
                    React.createElement(
                        'p',
                        { 'data-size': '', className: 'o-p-h' },
                        '\u6B63\u6587'
                    ),
                    React.createElement(
                        'h1',
                        { 'data-size': '1', className: 'o-p-h' },
                        '\u6807\u98981'
                    ),
                    React.createElement(
                        'h2',
                        { 'data-size': '2', className: 'o-p-h' },
                        '\u6807\u98982'
                    ),
                    React.createElement(
                        'h3',
                        { 'data-size': '3', className: 'o-p-h' },
                        '\u6807\u98983'
                    ),
                    React.createElement(
                        'h4',
                        { 'data-size': '4', className: 'o-p-h' },
                        '\u6807\u98984'
                    ),
                    React.createElement(
                        'h5',
                        { 'data-size': '5', className: 'o-p-h' },
                        '\u6807\u98985'
                    ),
                    React.createElement(
                        'h6',
                        { 'data-size': '6', className: 'o-p-h' },
                        '\u6807\u98986'
                    )
                )
            );
        }
    }]);

    return HeaderDropDown;
}(Component);

export { HeaderDropDown as default };