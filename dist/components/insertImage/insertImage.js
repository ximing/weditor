/**
 * Created by yeanzhi on 17/3/27.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';
import { inject, observer } from 'mobx-react';
import 'rc-tabs/assets/index.css';
import Tabs, { TabPane } from 'rc-tabs';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar.js';
import TabContent from 'rc-tabs/lib/TabContent.js';
import Dialog from '../dialog';
import { contains } from '../../lib/util';
import { Uploader } from '../uploader/index';
import Button from '../button';
import { getEditor } from '../../lib/quillEditor';
import insert from '../../model/insert';
import Input from '../input';
import { error } from '../toast';
var $ = window.jQuery;
var InsertImage = (_dec = inject('insert'), _dec(_class = observer(_class = function (_Component) {
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

                getEditor().insertEmbed(index, 'image', _this.state.linkUrl, Quill.sources.USER);
            }
            insert.openImageDialog = false;
        }, _this.closeBubble = function () {
            _this.props.insert.openImageDialog = false;
        }, _this.otherDOMClick = function (e) {
            var node = e.target;
            if (!insert.openImageDialog) {
                return false;
            }
            var target = _this.target;
            if (insert.openImageDialog && !contains(target, node)) {
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

            this.rootNode = ReactDOM.findDOMNode(this);
            this.target = this.rootNode.getElementsByClassName('weditor-insert-image-dialog')[0];
            var uploader = this.uploader = new Uploader({
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

                        getEditor().insertEmbed(index, 'image', res.data.url, Quill.sources.USER);
                        _this3.props.insert.openImageDialog = false;
                    }
                } else {
                    error('上传服务错误');
                }
            });
            uploader.on('uploadComplete', function () {
                uploader.reset();
            });
            uploader.on('uploadError', function () {
                uploader.reset();
                error('上传服务错误');
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

            return React.createElement(Dialog, {
                title: '\u63D2\u5165\u56FE\u7247',
                className: 'weditor-insert-image-dialog',
                content: React.createElement(
                    'div',
                    { className: 'weditor-insert-image' },
                    React.createElement(
                        'div',
                        { className: 'weditor-uploader-wrapper' },
                        React.createElement(
                            Tabs,
                            {
                                renderTabBar: function renderTabBar() {
                                    return React.createElement(ScrollableInkTabBar, { onTabClick: _this4.onTabClick });
                                },
                                renderTabContent: function renderTabContent() {
                                    return React.createElement(TabContent, { animatedWithMargin: true });
                                },
                                activeKey: this.state.activeKey,
                                onChange: this.onChange
                            },
                            React.createElement(
                                TabPane,
                                { tab: '\u672C\u5730\u4E0A\u4F20', key: '1' },
                                React.createElement(
                                    'div',
                                    { className: 'weditor-uploader-file-inner' },
                                    React.createElement(
                                        'p',
                                        { className: 'weditor-image-tips' },
                                        '\u6700\u5927\u4E0A\u4F2020M\u7684\u56FE\u7247'
                                    ),
                                    React.createElement(
                                        Button,
                                        { id: 'weditorUploaderPick' },
                                        '\u70B9\u51FB\u4E0A\u4F20'
                                    )
                                )
                            ),
                            React.createElement(
                                TabPane,
                                { tab: '\u63D2\u5165\u5916\u94FE', key: '2' },
                                React.createElement(
                                    'div',
                                    { className: 'weditor-uploader-file-inner' },
                                    React.createElement(
                                        'div',
                                        null,
                                        React.createElement(Input, { onChange: this.onLinkUrlChange }),
                                        React.createElement(
                                            Button,
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
}(Component)) || _class) || _class);
export { InsertImage as default };