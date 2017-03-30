/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react';
import {getEditor, getEditorBoundingClientRect} from '../../lib/quillEditor';

@inject('editor') @observer
export default class Selection extends Component {
    componentDidMount() {

    }

    render() {
        const editor = getEditor();
        const {index, length} = this.props.editor.range;
        let sLeft = 0, sHeight = 30, sWidth = 30, sTop = 0;
        if (editor) {
            if (index) {
                const {left, height, top,width} = editor.getBounds(index,length||0);
                const {left: eLeft, top: eTop} = getEditorBoundingClientRect();
                sLeft = left + eLeft;
                sHeight = height;
                sTop = top + 20;
                sWidth = width;
            }
        }
        return (
            <div className="weditor-selection"
                 style={{
                     display: !this.props.editor.focus ? 'block' : 'none',
                     height: sHeight,
                     width: sWidth,
                     left: sLeft,
                     top: sTop
                 }}>
            </div>
        )
    }
}
