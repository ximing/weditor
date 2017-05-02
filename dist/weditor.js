/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import hotkeys from 'hotkeys-js';
import ReactDOM from 'react-dom';
import Header from './header';
import Catalogue from './catalogue';
import LinkBubble from './components/linkBubble';
import InsertImage from './components/insertImage';
import HotKeysDialog from './components/hotKeysDialog';
import { inject, observer } from 'mobx-react';
import Selection from './components/selection';
import OtherSelection from './components/otherSelection';
import Editor from './components/editor';
var $ = window.jQuery;
import editor from './model/editor';
var WEditor = (_dec = inject(function (state) {
    return {
        insert: state.insert,
        open: state.catalogue.open,
        focus: state.editor.focus,
        help: state.help
    };
}), _dec(_class = observer(_class = function (_Component) {
    _inherits(WEditor, _Component);

    function WEditor() {
        _classCallCheck(this, WEditor);

        var _this = _possibleConstructorReturn(this, (WEditor.__proto__ || Object.getPrototypeOf(WEditor)).call(this));

        _this.state = {
            left: window.innerWidth / 2 - 400,
            scrollTop: 0
        };
        return _this;
    }

    _createClass(WEditor, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var editorDom = this.editorDom = $(ReactDOM.findDOMNode(this.refs.editor)).find('.ql-editor');
            editorDom.on('blur', function () {
                editor.focus = false;
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({
                left: nextProps.open ? window.innerWidth / 2 - 300 : window.innerWidth / 2 - 400
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'weditor-wrapper' },
                React.createElement(Header, { doc: this.props.doc,
                    rightContent: this.props.rightContent,
                    helpOptions: this.props.options.helpOptions }),
                React.createElement(
                    'div',
                    { className: 'weditor-body' },
                    React.createElement(Catalogue, null),
                    React.createElement(
                        'div',
                        { className: 'content-container',
                            style: { left: this.state.left } },
                        !this.props.focus && React.createElement(Selection, { scrollTop: this.state.scrollTop }),
                        React.createElement(Editor, null),
                        this.props.coCursors.map(function (item) {
                            return React.createElement(OtherSelection, { key: item.id, name: item.name, range: item.range });
                        })
                    )
                ),
                this.props.insert.openLinkDialog && React.createElement(LinkBubble, null),
                this.props.insert.openImageDialog && React.createElement(InsertImage, { uploadUrl: this.props.options.uploadUrl }),
                this.props.help.hotKeysDialog && React.createElement(HotKeysDialog, null)
            );
        }
    }]);

    return WEditor;
}(Component)) || _class) || _class);
export { WEditor as default };