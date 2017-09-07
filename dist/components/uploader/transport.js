'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Transport = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by yeanzhi on 15/11/3.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _eventBus = require('./eventBus.js');

var _eventBus2 = _interopRequireDefault(_eventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview Transport
 */

var _options = {
    server: '',
    method: 'POST',
    fileVal: 'file',
    timeout: 2 * 60 * 1000, // 2分钟
    formData: {},
    headers: {},
    fileName: void 0
};

var Transport = exports.Transport = function () {
    function Transport(_blob, eventEmitter) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, Transport);

        if (!_blob) {
            throw new Error('blob should not empty');
        }
        this.eventEmitter = eventEmitter;
        this.config = (0, _lodash2.default)({}, _options, opts);
        this._blob = _blob;
    }

    // 添加其他字段


    _createClass(Transport, [{
        key: 'append',
        value: function append(key, value) {
            if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
                (0, _lodash2.default)(this.config.formData, key);
            } else {
                this.config.formData[key] = value;
            }
        }
    }, {
        key: 'setRequestHeader',
        value: function setRequestHeader(key, value) {
            if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
                (0, _lodash2.default)(this._headers, key);
            } else {
                this.config.headers[key] = value;
            }
        }
    }, {
        key: 'abort',
        value: function abort() {
            this.xhr.abort();
        }
    }, {
        key: 'send',
        value: function send() {
            var _this = this;

            return new Promise(function (res, rej) {
                var xhr = new XMLHttpRequest();
                _this.xhr = xhr;
                var formData = new FormData();
                xhr.upload.addEventListener('progress', function (e) {
                    //TODO 这里total给的超过文件大小了
                    _this.eventEmitter.emit('uploadBlobProgress', e.loaded, e.total);
                }, false);
                if (_this.config.timeout !== 0) {
                    xhr.timeout = _this.config.timeout;
                }
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status <= 300) {
                            _this.eventEmitter.emit('_uploadSuccess', _this._blob, xhr.responseText);
                            res(xhr.responseText);
                        } else {
                            _this.eventEmitter.emit('_uploadError', xhr.statusText);
                            rej(xhr.response);
                        }
                    }
                };
                xhr.ontimeout = function (event) {
                    _eventBus2.default.emit('timeout', event);
                };
                if (_this.config.withCredentials) {
                    xhr.withCredentials = true;
                }
                Object.keys(_this.config.formData).forEach(function (key) {
                    formData.append(key, _this.config.formData[key]);
                });
                formData.append(_this.config.fileVal, _this._blob, _this.config.fileName);
                xhr.open(_this.config.method, _this.config.server, true);
                Object.keys(_this.config.headers).forEach(function (key) {
                    xhr.setRequestHeader(key, _this.config.headers[key]);
                });
                xhr.send(formData);
            });
        }
    }]);

    return Transport;
}();