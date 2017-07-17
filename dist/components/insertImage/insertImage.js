/**
 * Created by yeanzhi on 17/3/27.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

require('rc-tabs/assets/index.css');

var _rcTabs = require('rc-tabs');

var _rcTabs2 = _interopRequireDefault(_rcTabs);

var _ScrollableInkTabBar = require('rc-tabs/lib/ScrollableInkTabBar.js');

var _ScrollableInkTabBar2 = _interopRequireDefault(_ScrollableInkTabBar);

var _TabContent = require('rc-tabs/lib/TabContent.js');

var _TabContent2 = _interopRequireDefault(_TabContent);

var _dialog = require('../dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _util = require('../../lib/util');

var _index = require('../uploader/index');

var _button = require('../button');

var _button2 = _interopRequireDefault(_button);

var _insert = require('../../model/insert');

var _insert2 = _interopRequireDefault(_insert);

var _quillEditor = require('../../lib/quillEditor');

var _rcProgress = require('rc-progress');

var _toast = require('../toast');

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;

var InsertImage = function (_Component) {
    _inherits(InsertImage, _Component);

    function InsertImage() {
        var _ref,
            _this2 = this;

        var _temp, _this, _ret;

        _classCallCheck(this, InsertImage);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InsertImage.__proto__ || Object.getPrototypeOf(InsertImage)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            activeKey: '1',
            linkUrl: '',
            progress: 0
        }, _this.onLinkUrlChange = function (e) {
            _this.setState({
                linkUrl: e.target.value
            });
        }, _this.onLoad = function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                return _context.abrupt('return', new Promise(function (res, rej) {
                                    var elem = document.createElement("img");
                                    elem.setAttribute("src", url);
                                    elem.onload = function () {
                                        res({
                                            width: this.width,
                                            height: this.height
                                        });
                                    };
                                    elem.onerror = function () {
                                        res({
                                            code: 500
                                        });
                                    };
                                }));

                            case 1:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this2);
            }));

            return function (_x) {
                return _ref2.apply(this, arguments);
            };
        }(), _this.insertImage = function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(url) {
                var index, res, _getEditor$getLeaf, _getEditor$getLeaf2, leaf, offset;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                index = 0;

                                if (_insert2.default.imageSelection) {
                                    index = _insert2.default.imageSelection.index;
                                }
                                _context2.next = 4;
                                return _this.onLoad(url);

                            case 4:
                                res = _context2.sent;

                                console.log('insert Image ', index);
                                if (!res.code) {
                                    (0, _quillEditor.getEditor)().insertEmbed(index, 'image', url, _quill2.default.sources.USER);
                                    _getEditor$getLeaf = (0, _quillEditor.getEditor)().getLeaf(index + 1), _getEditor$getLeaf2 = _slicedToArray(_getEditor$getLeaf, 2), leaf = _getEditor$getLeaf2[0], offset = _getEditor$getLeaf2[1];

                                    console.log(leaf);
                                    if (leaf && leaf.domNode.nodeName.toLowerCase() === 'img') {
                                        leaf.format('width', Math.min($('.ql-editor').width(), res.width));
                                    }
                                } else {}
                                _insert2.default.openImageDialog = false;

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this2);
            }));

            return function (_x2) {
                return _ref3.apply(this, arguments);
            };
        }(), _this.insertLink = function () {
            if (_this.state.linkUrl) {
                _this.insertImage(_this.state.linkUrl);
            }
        }, _this.closeBubble = function () {
            if (_this.file && _this.file.id) {
                _this.uploader.removeFile(_this.file.id);
            }
            _insert2.default.openImageDialog = false;
        }, _this.otherDOMClick = function (e) {
            var node = e.target;
            if (!_insert2.default.openImageDialog) {
                return false;
            }
            var target = _this.target;
            if (_insert2.default.openImageDialog && !(0, _util.contains)(target, node)) {
                _this.closeBubble();
            }
        }, _this.onChange = function (activeKey) {
            _this.setState({
                activeKey: activeKey
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(InsertImage, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            setTimeout(function () {
                $(document).on('mousedown', _this3.otherDOMClick);
            }, 10);
            this.initUploader();
        }
    }, {
        key: 'initUploader',
        value: function initUploader() {
            var _this4 = this;

            this.rootNode = _reactDom2.default.findDOMNode(this);
            this.target = this.rootNode.getElementsByClassName('weditor-insert-image-dialog')[0];
            var uploader = this.uploader = new _index.Uploader({
                'dnd': '.weditor-uploader-wrapper',
                'pick': '#weditorUploaderPick',
                'auto': true,
                'chunked': false,
                'chunkSize': 20971520,
                'linterContiner': document,
                '$': $,
                'body': this.target,
                'multiple': false,
                'method': 'post',
                'withCredentials': true,
                'server': this.props.uploadUrl || '',
                accept: {
                    title: 'Images',
                    extensions: 'jpg,jpeg,bmp,png,gif',
                    mimeTypes: 'image/*'
                }
            });

            uploader.on('beforeFileQueued', function (wuFile) {
                if (wuFile.size > 1024 * 1024 * 20) {
                    (0, _toast.error)('图片大小不能超过20M');
                    uploader.reset();
                    return false;
                }
                return true;
            });

            uploader.on('fileQueued', function (wuFile) {
                _this4.file = wuFile;
            });

            uploader.on('uploadProgress', function (file, currentProgress, loaded, total) {
                console.log('uploadProgress'.repeat(10));
                console.log(currentProgress, loaded, total);
                _this4.setState({
                    progress: currentProgress / total * 100
                });
            });

            uploader.on('uploadAccept', function (obj, res) {
                _this4.file = null;
                if (typeof res === 'string') {
                    res = JSON.parse(res);
                }
                console.log('uploadAccept', res, res.errno === 0, _insert2.default);
                if (res.errno === 0) {
                    if (res.data.url) {
                        _this4.insertImage(res.data.url);
                    }
                } else {
                    (0, _toast.error)('上传服务错误');
                }
            });

            uploader.on('uploadComplete', function () {
                uploader.reset();
            });

            uploader.on('uploadError', function (file, err) {
                console.error(err);
                uploader.reset();
                (0, _toast.error)('上传服务错误!');
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            $(document).off('mousedown', this.otherDOMClick);
            this.uploader.removeEvent('uploadAccept');
            this.uploader.removeEvent('uploadComplete');
            this.uploader.removeEvent('uploadError');
            this.uploader.destory();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var progress = this.state.progress;

            return _react2.default.createElement(_dialog2.default, {
                title: '\u63D2\u5165\u56FE\u7247',
                className: 'weditor-insert-image-dialog',
                content: _react2.default.createElement(
                    'div',
                    { className: 'weditor-insert-image' },
                    _react2.default.createElement(
                        'div',
                        { className: 'weditor-uploader-wrapper' },
                        _react2.default.createElement(
                            _rcTabs2.default,
                            {
                                renderTabBar: function renderTabBar() {
                                    return _react2.default.createElement(_ScrollableInkTabBar2.default, { onTabClick: _this5.onTabClick });
                                },
                                renderTabContent: function renderTabContent() {
                                    return _react2.default.createElement(_TabContent2.default, { animatedWithMargin: true });
                                },
                                activeKey: this.state.activeKey,
                                onChange: this.onChange
                            },
                            _react2.default.createElement(
                                _rcTabs.TabPane,
                                { tab: '本地上传', key: '1' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'weditor-uploader-file-inner' },
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'weditor-image-tips',
                                            style: { display: progress === 0 || progress === 100 ? 'block' : 'none' } },
                                        '\u6700\u5927\u4E0A\u4F2020M\u7684\u56FE\u7247'
                                    ),
                                    _react2.default.createElement(
                                        _button2.default,
                                        { id: 'weditorUploaderPick',
                                            style: { display: progress === 0 || progress === 100 ? 'block' : 'none' } },
                                        '\u70B9\u51FB\u4E0A\u4F20'
                                    ),
                                    _react2.default.createElement(_rcProgress.Line, { percent: progress, trailWidth: '2', strokeWidth: '2', strokeColor: '#118bfb',
                                        style: { display: progress > 0 && progress < 100 ? 'block' : 'none' } })
                                )
                            ),
                            _react2.default.createElement(
                                _rcTabs.TabPane,
                                { tab: '插入外链', key: '2' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'weditor-uploader-file-inner' },
                                    _react2.default.createElement(
                                        'div',
                                        null,
                                        _react2.default.createElement(_input2.default, { onChange: this.onLinkUrlChange }),
                                        _react2.default.createElement(
                                            _button2.default,
                                            { onClick: this.insertLink },
                                            '\u63D2\u5165'
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                onClose: this.closeBubble
            });
        }
    }]);

    return InsertImage;
}(_react.Component);

exports.default = InsertImage;