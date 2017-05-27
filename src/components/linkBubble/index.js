/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Input from '../input/index';
import Button from '../button/index';
import {contains} from '../../lib/util';
import {getEditor} from '../../lib/quillEditor'
import insert from '../../model/insert';
import editor from '../../model/editor';

import {inject, observer} from 'mobx-react';

@observer
export default class LinkBubble extends Component {
    static defaultProps = {
        linkTitle: '',
        linkUrl: ''
    }

    componentDidMount() {
        setTimeout(() => {
            window.document.addEventListener('click', this.otherDOMClick);
        }, 100);
        this.target = ReactDOM.findDOMNode(this);
    }

    componentWillUnmount() {
        window.document.removeEventListener('click', this.otherDOMClick, false);
    }

    closeBubble = () => {
        insert.openLinkDialog = false;
        insert.isReadOnlyLink = false;
    };

    otherDOMClick = (e) => {
        let node = e.target;
        if (!insert.openLinkDialog) {
            return false;
        }
        let target = this.target;
        if (insert.openLinkDialog && !(contains(target, node))) {
            this.closeBubble();
        }
    }

    changeTitle = (e) => {
        insert.linkTitle = e.target.value || '';
    };

    changeUrl = (e) => {
        insert.linkUrl = e.target.value || '';
    };

    apply = () => {
        if (getEditor() && !!insert.linkUrl) {
            let editor = getEditor();
            let selection = insert.linkSelection;
            if (selection) {
                if (editor.getText(selection.index, selection.length) === insert.linkTitle) {
                    getEditor().format('link', insert.linkUrl, 'user');
                } else {
                    const {index, length} = selection;
                    editor.deleteText(index, length, 'user');
                    let linkTitle = insert.linkTitle || insert.linkUrl;
                    editor.insertText(index, linkTitle, 'user');
                    editor.setSelection(index, linkTitle.length, 'user');
                    getEditor().format('link', insert.linkUrl, 'user');
                }
            }
            insert.openLinkDialog = false;
        }
    }

    ableEditLink = () => {
        this.closeBubble();
        insert.openLinkDialog = true;
    };

    removeLink = () => {
        if(getEditor()){
            const {index, length} = editor.range;//getEditor().getSelection()
            let [leaf, offset] = quillEditor.getLeaf(index);
            let LinkIndex = quillEditor.getIndex(leaf);
            getEditor().removeFormat(LinkIndex, leaf.text.length,'user');
            this.closeBubble();
        }
    };

    renderReadOnly() {
        return (
            <div className="weditor-bubble-only-read">
                <a href={insert.linkUrl} target="_blank">{insert.linkUrl}</a>
                <span>-</span>
                <a href="javascript:void(0)" onClick={this.ableEditLink}>编辑</a>
                <span>|</span>
                <a href="javascript:void(0)" onClick={this.removeLink}>移除</a>
            </div>
        )
    }

    renderEdit() {
        return (
            <div>
                <div className="weditor-bubble-item">
                    <span>文本：</span> <Input className="weditor-insert-input"
                                            value={insert.linkTitle || ''}
                                            onChange={this.changeTitle}/>
                </div>
                <div className="weditor-bubble-item">
                    <span>链接：</span> <Input className="weditor-insert-input"
                                            value={insert.linkUrl || ''}
                                            onChange={this.changeUrl}/>
                    <Button onClick={this.apply}>应用</Button>
                </div>
            </div>
        )
    }

    render() {
        const {linkPosition, openLinkDialog, isReadOnlyLink} = this.props.insert;
        return (
            <section className="weditor-bubble" style={{
                top: linkPosition.top + (isReadOnlyLink ? 55 : 0),
                left: linkPosition.left,
                display: openLinkDialog ? 'block' : 'none',
                padding: isReadOnlyLink ? 8 : 16
            }}>
                {
                    isReadOnlyLink ? this.renderReadOnly() : this.renderEdit()
                }
            </section>
        );
    }
}
