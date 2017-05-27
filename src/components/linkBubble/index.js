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

import insert from '../../model/insert';

export default class LinkBubble extends Component {
    static defaultProps = {
        linkTitle:'',
        linkUrl:''
    }
    componentDidMount() {
        setTimeout(()=>{
            window.document.addEventListener('click', this.otherDOMClick);
        },100);
        this.target = ReactDOM.findDOMNode(this);
    }

    componentWillUnmount() {
        window.document.removeEventListener('click', this.otherDOMClick, false);
    }

    closeBubble = (e) => {
        insert.openLinkDialog = false;
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

    render() {
        // const {linkPosition,openLinkDialog} = this.props.insert;
        return (
            <section className="weditor-bubble" style={{
                top: insert.linkPosition.top,
                left: insert.linkPosition.left,
                display: insert.openLinkDialog ? 'block' : 'none'
            }}>
                <div className="weditor-bubble-item">
                    <span>文本：</span> <Input className="weditor-insert-input"
                                            value={insert.linkTitle}
                                            onChange={this.changeTitle}/>
                </div>
                <div className="weditor-bubble-item">
                    <span>链接：</span> <Input className="weditor-insert-input"
                                            value={insert.linkUrl}
                                            onChange={this.changeUrl}/>
                    <Button onClick={this.apply}>应用</Button>
                </div>
            </section>
        );
    }
}
