/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {inject, observer} from 'mobx-react';
import {getEditor, getEditorBoundingClientRect} from '../../lib/quillEditor';

@inject('editor')@observer
export default class Selection extends Component {

    componentDidMount() {
        this.selection = ReactDOM.findDOMNode(this.refs.selection);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    interval = null;
    createSelectionBlock(rect, containerRect, key) {
        return <span
            key={key}
            className="ql-cursor-selection-block"
            style={{
                top: rect.top - containerRect.top,
                left: rect.left - containerRect.left,
                width: rect.width,
                height: rect.height
            }}/>;
    }

    _updateSelection(rects, containerRect) {
        let index = [];
        let rectIndex,
            selectionArray = [];
        if (rects) {
            try{
                rects.forEach((rect, i) => {
                    rectIndex = ('' + rect.top + rect.left + rect.width + rect.height);

                    // Note: Safari throws a rect with length 1 when caret with no selection. A
                    // check was addedfor to avoid drawing those carets - they show up on blinking.
                    if (!~ index.indexOf(rectIndex) && rect.width > 1) {
                        index.push(rectIndex);
                        selectionArray.push(this.createSelectionBlock(rect, containerRect, i));
                    }
                });
            }catch(err) {
                console.error(err);
            }
        }
        return selectionArray;
    }
    render() {
        const editor = getEditor();
        clearInterval(this.interval);
        const {index, length} = this.props.editor.range;
        let sLeft = 0,
            sHeight = 0,
            sWidth = 0,
            sTop = 0,
            selectionArray;
        if (editor) {
            if (index) {
                const {left, height, top, width} = editor.getBounds(index, length || 0);
                console.log(left, height, top, width);
                sLeft = left;
                sHeight = height;
                sTop = top;
                sWidth = width;
                if (width === 0) {
                    this.interval = setInterval(() => {
                        if (this.selection) {
                            if (this.selection.style.display === 'block') {
                                this.selection.style.display = 'none';
                            } else {
                                this.selection.style.display = 'block';
                            }
                        }
                    }, 1200);
                }

                let containerRect = editor
                    .container
                    .getBoundingClientRect();
                let startLeaf = editor.getLeaf(index);
                let endLeaf = editor.getLeaf(index + length);
                let range = document.createRange();
                let rects;

                // Sanity check
                if (!startLeaf || !endLeaf || !startLeaf[0] || !endLeaf[0] || startLeaf[1] < 0 || endLeaf[1] < 0 || !startLeaf[0].domNode || !endLeaf[0].domNode) {
                    console.log('default Troubles!');

                    return (
                        <span></span>
                    );
                }

                if (startLeaf[0].domNode.nodeName.toLowerCase() === 'img' || endLeaf[0].domNode.nodeName.toLowerCase() === 'img') {
                    return (
                        <span></span>
                    );
                }
                range.setStart(startLeaf[0].domNode, startLeaf[1]);
                range.setEnd(endLeaf[0].domNode, endLeaf[1]);
                rects = window
                    .RangeFix
                    .getClientRects(range);

                selectionArray = this._updateSelection(rects, containerRect);
            }
        }
        return (
            <div
                className="weditor-selection"
                ref="selection"
                style={{
                    diplay: 'block'
                }}>
                {selectionArray}
            </div>
        );
    }
}
