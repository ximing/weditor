/**
 * Created by yeanzhi on 17/3/29.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.error = exports.success = exports.info = exports.warning = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcNotification = require('rc-notification');

var _rcNotification2 = _interopRequireDefault(_rcNotification);

require('./index.scss');

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notification = _rcNotification2.default.newInstance({});

var warning = exports.warning = function warning(content, onClose) {
    notification.notice({
        content: _react2.default.createElement(
            'p',
            { className: 'weditor-toast' },
            _react2.default.createElement(_icon2.default, { type: 'warning' }),
            _react2.default.createElement(
                'span',
                null,
                content
            ),
            ' '
        ),
        onClose: onClose
    });
};
var info = exports.info = function info(content, onClose) {
    notification.notice({
        content: _react2.default.createElement(
            'p',
            { className: 'weditor-toast' },
            _react2.default.createElement(_icon2.default, { type: 'info' }),
            _react2.default.createElement(
                'span',
                null,
                content
            )
        ),
        onClose: onClose
    });
};
var success = exports.success = function success(content, onClose) {
    notification.notice({
        content: _react2.default.createElement(
            'p',
            { className: 'weditor-toast' },
            _react2.default.createElement(_icon2.default, { type: 'success' }),
            _react2.default.createElement(
                'span',
                null,
                content
            )
        ),
        onClose: onClose
    });
};
var error = exports.error = function error(content, onClose) {
    notification.notice({
        content: _react2.default.createElement(
            'p',
            { className: 'weditor-toast' },
            _react2.default.createElement(_icon2.default, { type: 'error' }),
            _react2.default.createElement(
                'span',
                null,
                content
            )
        ),
        onClose: onClose
    });
};