/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';
import React, {Component} from 'react'
import ReactDOM from 'react-dom';

import {inject, observer} from 'mobx-react';
import {getEditor, getEditorBoundingClientRect} from '../../lib/quillEditor';

@inject('editor') @observer
export default class Selection extends Component {
    componentDidMount(){
        let editorDom = $('.ql-editor');
        let $selection = $(ReactDOM.findDOMNode(this.refs.selection));
        editorDom.on('scroll', (e) => {
            const {index, length} = this.props.editor.range;
            const {top} = getEditor().getBounds(index, length || 0);
            $selection.css('top',top)
        })
    }
    render() {
        const editor = getEditor();
        const {index, length} = this.props.editor.range;
        let sLeft = 0, sHeight = 0, sWidth = 0, sTop = 0;
        if (editor) {
            if (index) {
                const {left, height, top, width} = editor.getBounds(index, length || 0);
                sLeft = left;
                sHeight = height;
                sTop = top;
                sWidth = width;
            }
        }
        return (
            <div className="weditor-selection" ref="selection"
                 style={{
                     height: sHeight,
                     width: sWidth,
                     left: sLeft,
                     top: sTop
                 }}>
            </div>
        )
    }
}
