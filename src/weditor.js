/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {inject, observer} from 'mobx-react';

import LinkBubble from './components/linkBubble';
import InsertImage from './components/insertImage';
import HotKeysDialog from './components/hotKeysDialog';
import BubbleToolbar from './components/bubble-toolbar';
import Selection from './components/selection';
import Editor from './components/editor';

import Header from './header';
import Toolbar from './toolbar';

const $ = window.jQuery;

import editor from './model/editor';

import layer from './lib/layer';

@inject(state => ({
    insert: state.insert,
    focus: state.editor.focus,
    help: state.help,
    forceUpdate:state.forceUpdate
})) @observer
export default class WEditor extends Component {
    state = {
        scrollTop: 0
    };

    constructor() {
        super();
    }

    // onWindowResize = () => {
    // };

    componentDidMount() {
        let editorDom = this.editorDom = $(ReactDOM.findDOMNode(this.refs.editor)).find('.ql-editor');
        editorDom.on('blur', () => {
            editor.focus = false;
        });
        // $(window).on('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        // $(window).off('resize', this.onWindowResize);

    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        return (
            <div className="weditor-wrapper">
                {
                    !this.props.onlyRead && (
                        <Header doc={this.props.doc}
                            fileOptions={this.props.options.fileOptions}
                            helpOptions={this.props.options.helpOptions}/>
                    )
                }
                {
                    !this.props.onlyRead && (
                        <div className="editor-toolbar" id="toolbar">
                            <Toolbar toolbar={this.props.toolbar}/>
                        </div>
                    )
                }
                <div className="weditor-body">
                    <div className="content-container">
                        {
                            !this.props.focus && <Selection scrollTop={this.state.scrollTop}/>
                        }
                        {layer.renderBackend()}
                        <Editor modules={this.props.modules} onlyRead={this.props.onlyRead}/>
                        {layer.renderFrontend()}
                        {
                            this.props.insert.openLinkDialog &&
                            <LinkBubble insert={this.props.insert}/>
                        }
                        {!this.props.onlyRead && <BubbleToolbar/>}
                    </div>
                </div>
                {
                    this.props.insert.openImageDialog &&
                    <InsertImage uploadUrl={this.props.options.uploadUrl}/>
                }
                {
                    this.props.help.hotKeysDialog &&
                    <HotKeysDialog/>
                }
            </div>
        );
    }
}
