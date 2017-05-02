/**
 * Created by yeanzhi on 17/4/10.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import './index.scss';
import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { contains } from '../../lib/util';
import { getEditor } from '../../lib/quillEditor';
var $ = window.$;

var _default = function (_Component) {
    _inherits(_default, _Component);

    function _default() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, _default);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _default.__proto__ || Object.getPrototypeOf(_default)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            open: false
        }, _this.otherDOMClick = function (e) {
            var node = e.target;
            var target = _this.target;
            if (!_this.state.open) {
                return false;
            }
            if (_this.state.open && !contains(target, node)) {
                _this.onClose();
            }
        }, _this.onClick = function () {
            _this.setState({
                open: true
            });
            setTimeout(function () {
                window.document.addEventListener('click', _this.otherDOMClick);
            }, 100);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(_default, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.target = ReactDOM.findDOMNode(this);
            console.log('fdsaf', this.target);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.document.removeEventListener('click', this.otherDOMClick);
        }
    }, {
        key: 'onClose',
        value: function onClose() {
            this.setState({
                open: false
            });
            window.document.removeEventListener('click', this.otherDOMClick);
        }
    }, {
        key: 'selectBackground',
        value: function selectBackground(color) {
            var _this2 = this;

            return function () {
                getEditor().format('background', color, 'user');
                _this2.onClose();
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return React.createElement(
                'span',
                { className: 'weditor-hightlight' },
                React.createElement(
                    'svg',
                    { viewBox: '0 0 18 18', onClick: this.onClick },
                    React.createElement(
                        'g',
                        { className: 'ql-fill ql-color-label' },
                        React.createElement('polygon', { points: '6 6.868 6 6 5 6 5 7 5.942 7 6 6.868' }),
                        React.createElement('rect', { height: '1', width: '1', x: '4', y: '4' }),
                        React.createElement('polygon', { points: '6.817 5 6 5 6 6 6.38 6 6.817 5' }),
                        React.createElement('rect', { height: '1', width: '1', x: '2', y: '6' }),
                        React.createElement('rect', { height: '1', width: '1', x: '3', y: '5' }),
                        React.createElement('rect', { height: '1', width: '1', x: '4', y: '7' }),
                        React.createElement('polygon', { points: '4 11.439 4 11 3 11 3 12 3.755 12 4 11.439' }),
                        React.createElement('rect', { height: '1', width: '1', x: '2', y: '12' }),
                        React.createElement('rect', { height: '1', width: '1', x: '2', y: '9' }),
                        React.createElement('rect', { height: '1', width: '1', x: '2', y: '15' }),
                        React.createElement('polygon', { points: '4.63 10 4 10 4 11 4.192 11 4.63 10' }),
                        React.createElement('rect', { height: '1', width: '1', x: '3', y: '8' }),
                        React.createElement('path', { d: 'M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z' }),
                        React.createElement('path', { d: 'M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z' }),
                        React.createElement('path', { d: 'M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z' }),
                        React.createElement('rect', { height: '1', width: '1', x: '12', y: '2' }),
                        React.createElement('rect', { height: '1', width: '1', x: '11', y: '3' }),
                        React.createElement('path', { d: 'M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z' }),
                        React.createElement('rect', { height: '1', width: '1', x: '2', y: '3' }),
                        React.createElement('rect', { height: '1', width: '1', x: '6', y: '2' }),
                        React.createElement('rect', { height: '1', width: '1', x: '3', y: '2' }),
                        React.createElement('rect', { height: '1', width: '1', x: '5', y: '3' }),
                        React.createElement('rect', { height: '1', width: '1', x: '9', y: '2' }),
                        React.createElement('rect', { height: '1', width: '1', x: '15', y: '14' }),
                        React.createElement('polygon', { points: '13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174' }),
                        React.createElement('rect', { height: '1', width: '1', x: '13', y: '7' }),
                        React.createElement('rect', { height: '1', width: '1', x: '15', y: '5' }),
                        React.createElement('rect', { height: '1', width: '1', x: '14', y: '6' }),
                        React.createElement('rect', { height: '1', width: '1', x: '15', y: '8' }),
                        React.createElement('rect', { height: '1', width: '1', x: '14', y: '9' }),
                        React.createElement('path', { d: 'M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z' }),
                        React.createElement('rect', { height: '1', width: '1', x: '14', y: '3' }),
                        React.createElement('polygon', { points: '12 6.868 12 6 11.62 6 12 6.868' }),
                        React.createElement('rect', { height: '1', width: '1', x: '15', y: '2' }),
                        React.createElement('rect', { height: '1', width: '1', x: '12', y: '5' }),
                        React.createElement('rect', { height: '1', width: '1', x: '13', y: '4' }),
                        React.createElement('polygon', { points: '12.933 9 13 9 13 8 12.495 8 12.933 9' }),
                        React.createElement('rect', { height: '1', width: '1', x: '9', y: '14' }),
                        React.createElement('rect', { height: '1', width: '1', x: '8', y: '15' }),
                        React.createElement('path', { d: 'M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z' }),
                        React.createElement('rect', { height: '1', width: '1', x: '5', y: '15' }),
                        React.createElement('path', { d: 'M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z' }),
                        React.createElement('rect', { height: '1', width: '1', x: '11', y: '15' }),
                        React.createElement('path', { d: 'M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z' }),
                        React.createElement('rect', { height: '1', width: '1', x: '14', y: '15' }),
                        React.createElement('rect', { height: '1', width: '1', x: '15', y: '11' })
                    ),
                    React.createElement('polyline', { className: 'ql-stroke', points: '5.5 13 9 5 12.5 13' }),
                    React.createElement('line', { className: 'ql-stroke', x1: '11.63', x2: '6.38', y1: '11', y2: '11' })
                ),
                React.createElement(
                    'div',
                    { className: 'hightlight-color-panel', style: { display: this.state.open ? 'block' : 'none' } },
                    ['yellow', 'green', 'cyan', 'magenta', 'darkYellow', 'darkGray', 'lightGray', 'black', 'blue', 'red', 'darkBlue', 'darkCyan', 'darkGreen', 'darkMagenta', 'darkRed'].map(function (item) {
                        return React.createElement('span', { style: { background: item }, key: item, onClick: _this3.selectBackground(item) });
                    })
                )
            );
        }
    }]);

    return _default;
}(Component);

export { _default as default };