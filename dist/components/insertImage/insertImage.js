/**
 * Created by yeanzhi on 17/3/27.
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

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

var _mobxReact = require('mobx-react');

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

var _quillEditor = require('../../lib/quillEditor');

var _insert = require('../../model/insert');

var _insert2 = _interopRequireDefault(_insert);

var _input = require('../input');

var _input2 = _interopRequireDefault(_input);

var _toast = require('../toast');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;
var InsertImage = (_dec = (0, _mobxReact.inject)('insert'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
    _inherits(InsertImage, _Component);

    function InsertImage() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, InsertImage);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InsertImage.__proto__ || Object.getPrototypeOf(InsertImage)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            activeKey: "1",
            linkUrl: ''
        }, _this.onLinkUrlChange = function (e) {
            _this.setState({
                linkUrl: e.target.value
            });
        }, _this.insertLink = function () {
            if (_this.state.linkUrl) {
                var _this$props$insert$im = _this.props.insert.imageSelection,
                    index = _this$props$insert$im.index,
                    length = _this$props$insert$im.length;

                (0, _quillEditor.getEditor)().insertEmbed(index, 'image', _this.state.linkUrl, _quill2.default.sources.USER);
            }
            _insert2.default.openImageDialog = false;
        }, _this.closeBubble = function () {
            _this.props.insert.openImageDialog = false;
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
            var _this2 = this;

            setTimeout(function () {
                window.document.addEventListener('click', _this2.otherDOMClick);
            }, 100);
            this.initUploader();
        }
    }, {
        key: 'initUploader',
        value: function initUploader() {
            var _this3 = this;

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
                'server': this.props.uploadUrl || ''
            });
            uploader.on('uploadAccept', function (obj, res) {
                res = JSON.parse(res);
                if (res.errno === 0) {
                    if (res.data.url) {
                        var _props$insert$imageSe = _this3.props.insert.imageSelection,
                            index = _props$insert$imageSe.index,
                            length = _props$insert$imageSe.length;

                        (0, _quillEditor.getEditor)().insertEmbed(index, 'image', res.data.url, _quill2.default.sources.USER);
                        _this3.props.insert.openImageDialog = false;
                    }
                } else {
                    (0, _toast.error)('上传服务错误');
                }
            });
            uploader.on('uploadComplete', function () {
                uploader.reset();
            });
            uploader.on('uploadError', function () {
                uploader.reset();
                (0, _toast.error)('上传服务错误');
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.document.removeEventListener('click', this.otherDOMClick);
            this.uploader.removeEvent('uploadAccept');
            this.uploader.removeEvent('uploadComplete');
            this.uploader.removeEvent('uploadError');
            this.uploader.destory();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

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
                                    return _react2.default.createElement(_ScrollableInkTabBar2.default, { onTabClick: _this4.onTabClick });
                                },
                                renderTabContent: function renderTabContent() {
                                    return _react2.default.createElement(_TabContent2.default, { animatedWithMargin: true });
                                },
                                activeKey: this.state.activeKey,
                                onChange: this.onChange
                            },
                            _react2.default.createElement(
                                _rcTabs.TabPane,
                                { tab: '\u672C\u5730\u4E0A\u4F20', key: '1' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'weditor-uploader-file-inner' },
                                    _react2.default.createElement(
                                        'p',
                                        { className: 'weditor-image-tips' },
                                        '\u6700\u5927\u4E0A\u4F2020M\u7684\u56FE\u7247'
                                    ),
                                    _react2.default.createElement(
                                        _button2.default,
                                        { id: 'weditorUploaderPick' },
                                        '\u70B9\u51FB\u4E0A\u4F20'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                _rcTabs.TabPane,
                                { tab: '\u63D2\u5165\u5916\u94FE', key: '2' },
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
}(_react.Component)) || _class) || _class);
exports.default = InsertImage;