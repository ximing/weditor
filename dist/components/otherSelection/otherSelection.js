/**
 * Created by yeanzhi on 17/4/4.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { getEditor } from '../../lib/quillEditor';

var OtherSelection = function (_Component) {
    _inherits(OtherSelection, _Component);

    function OtherSelection() {
        _classCallCheck(this, OtherSelection);

        return _possibleConstructorReturn(this, (OtherSelection.__proto__ || Object.getPrototypeOf(OtherSelection)).apply(this, arguments));
    }

    _createClass(OtherSelection, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                name = _props.name,
                range = _props.range;

            var editor = getEditor();
            var index = range.index,
                length = range.length;

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

                    sLeft = left;
                    sHeight = height;
                    sTop = top;
                    sWidth = width;
                }
                return React.createElement(
                    'div',
                    { className: 'weditor-other-selection',
                        style: {
                            diplay: 'block',
                            height: sHeight,
                            left: sLeft,
                            top: sTop
                        } },
                    React.createElement('div', { className: 'w-o-b', style: { height: sHeight } }),
                    React.createElement(
                        'p',
                        { className: 'weditor-other-selection-name' },
                        name
                    )
                );
            } else {
                return React.createElement('span', null);
            }
        }
    }]);

    return OtherSelection;
}(Component);

export { OtherSelection as default };