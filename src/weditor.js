/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from "react";
import hotkeys from 'hotkeys-js';
import ReactDOM from 'react-dom';
import Header from './header';
import Catalogue from './catalogue';
import {initQuillEditor} from './lib/quillEditor'
import LinkBubble from './components/linkBubble';
import InsertImage from './components/insertImage';
import {inject, observer} from 'mobx-react';
import Selection from './components/selection';
const $ = window.jQuery;
import editor from './model/editor'
@inject(state => ({
    insert: state.insert,
    open: state.catalogue.open,
    focus: state.editor.focus
})) @observer
export default class WEditor extends Component {
    state = {
        left: window.innerWidth / 2 - 400,
        scrollTop: 0
    };

    constructor() {
        super();
    }

    componentDidMount() {
        let quillEditor = this.quill = initQuillEditor(ReactDOM.findDOMNode(this.refs.editor));
        let editorDom = this.editorDom = $(ReactDOM.findDOMNode(this.refs.editor)).find('.ql-editor');
        editorDom.on('blur', () => {
            editor.focus = false;
        })

    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            left: nextProps.open ? window.innerWidth / 2 - 300 : window.innerWidth / 2 - 400
        });
    }

    render() {
        return (
            <div className="weditor-wrapper">
                <Header doc={this.props.doc} rightContent={this.props.rightContent}/>
                <div className="weditor-body">
                    <Catalogue/>
                    <div className="content-container"
                         style={{left: this.state.left}}>
                        {
                            !this.props.focus && <Selection scrollTop={this.state.scrollTop}/>
                        }
                        <div ref="editor">
                        </div>
                    </div>
                </div>
                {
                    this.props.insert.openLinkDialog &&
                    <LinkBubble />
                }
                {
                    this.props.insert.openImageDialog &&
                    <InsertImage uploadUrl={this.props.options.uploadUrl}/>
                }
            </div>
        );
    }
}
