/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { inject, observer } from 'mobx-react';
import { getEditor, getEditorBoundingClientRect } from '../../lib/quillEditor';

var Selection = (_dec = inject('editor'), _dec(_class = observer(_class = function (_Component) {
    _inherits(Selection, _Component);

    function Selection() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Selection);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Selection.__proto__ || Object.getPrototypeOf(Selection)).call.apply(_ref, [this].concat(args))), _this), _this.interval = null, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Selection, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.selection = ReactDOM.findDOMNode(this.refs.selection);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.interval);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var editor = getEditor();
            clearInterval(this.interval);
            var _props$editor$range = this.props.editor.range,
                index = _props$editor$range.index,
                length = _props$editor$range.length;

            var sLeft = 0,
                sHeight = 0,
                sWidth = 0,
                sTop = 0;
            if (editor) {
                if (index) {
                    var _editor$getBounds = editor.getBounds(index, length || 0),
                        left = _editor$getBounds.left,
                        height = _editor$getBounds.height,
                        top = _editor$getBounds.top,
                        width = _editor$getBounds.width;

                    console.log(left, height, top, width);
                    sLeft = left;
                    sHeight = height;
                    sTop = top;
                    sWidth = width;
                    if (width === 0) {
                        this.interval = setInterval(function () {
                            if (_this2.selection) {
                                if (_this2.selection.style.display === 'block') {
                                    _this2.selection.style.display = 'none';
                                } else {
                                    _this2.selection.style.display = 'block';
                                }
                            }
                        }, 1200);
                    }
                }
            }
            return React.createElement('div', { className: 'weditor-selection', ref: 'selection',
                style: {
                    diplay: 'block',
                    height: sHeight,
                    width: sWidth,
                    left: sLeft,
                    top: sTop,
                    borderLeft: sWidth === 0 ? '0.5px solid black' : 'none'
                } });
        }
    }]);

    return Selection;
}(Component)) || _class) || _class);
export { Selection as default };