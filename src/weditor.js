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
import {setLinkBubble} from './lib/quillEditor'
import {inject, observer} from 'mobx-react';

@inject(state => ({
    insert: state.insert,
    open: state.catalogue.open
})) @observer
export default class WEditor extends Component {
    state = {
        rangeFormat: {},
        left: window.innerWidth / 2 - 400
    }

    constructor() {
        super();
    }

    componentDidMount() {
        let quillEditor = this.quill = initQuillEditor(ReactDOM.findDOMNode(this.refs.editor));
        quillEditor.on('selection-change', (range, oldRange, source) => {
            if (range) {
                let rangeFormat = quillEditor.getFormat(range);
                if (rangeFormat.link) {
                    this.props.insert.openLinkDialog = true;
                    this.props.insert.linkUrl = rangeFormat.link;
                    let [leaf, offset] = quillEditor.getLeaf(range.index);
                    this.props.insert.linkTitle = leaf.text;
                    // let index= quillEditor.getIndex(leaf);
                    setLinkBubble(range.index)
                }
                this.setState({rangeFormat});
            }
            if (range && range.length) {
            }
        });

        // quillEditor.updateContents(op2);
        // quillEditor.setContents({"ops":op})
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
                <Header rangeFormat={this.state.rangeFormat}
                        doc={this.props.doc} rightContent={this.props.rightContent}/>
                <div className="weditor-body">
                    <Catalogue/>
                    <div className="content-container"
                         style={{left: this.state.left}}>
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
