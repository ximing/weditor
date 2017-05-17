/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {inject, observer} from 'mobx-react';
import {getEditor, getEditorBoundingClientRect} from '../../lib/quillEditor';

@inject('editor') @observer
export default class Selection extends Component {

    componentDidMount() {
        this.selection = ReactDOM.findDOMNode(this.refs.selection);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    interval = null;

    render() {
        const editor = getEditor();
        clearInterval(this.interval);
        const {index, length} = this.props.editor.range;
        let sLeft = 0, sHeight = 0, sWidth = 0, sTop = 0;
        if (editor) {
            if (index) {
                const {left, height, top, width} = editor.getBounds(index, length || 0);
                console.log(left,height,top,width);
                sLeft = left;
                sHeight = height;
                sTop = top;
                sWidth = width;
                if(width === 0) {
                    this.interval = setInterval(()=>{
                        if(this.selection) {
                            if(this.selection.style.display === 'block') {
                                this.selection.style.display = 'none';
                            }else{
                                this.selection.style.display = 'block';
                            }
                        }
                    },1200);
                }
            }
        }
        return (
            <div className="weditor-selection" ref="selection"
                 style={{
                     diplay:'block',
                     height: sHeight,
                     width: sWidth,
                     left: sLeft,
                     top: sTop,
                     borderLeft:sWidth === 0 ? '0.5px solid black' : 'none'
                 }}>
            </div>
        );
    }
}
