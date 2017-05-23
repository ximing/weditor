/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observer, inject} from 'mobx-react';

import Input from '../input/index';
import Button from '../button/index';
import {contains} from '../../lib/util';


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
        this.props.insert.openLinkDialog = false;
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
        this.props.insert.linkTitle = e.target.value || '';
    };

    changeUrl = (e) => {
        this.props.insert.linkUrl = e.target.value || '';
    };

    apply = () => {
        if (getEditor() && !!this.props.insert.linkUrl) {
            let editor = getEditor();
            let selection = this.props.insert.linkSelection;
            if (selection) {
                if (editor.getText(selection.index, selection.length) === this.props.insert.linkTitle) {
                    getEditor().format('link', this.props.insert.linkUrl, 'user');
                } else {
                    const {index, length} = selection;
                    editor.deleteText(index, length, 'user');
                    let linkTitle = this.props.insert.linkTitle || this.props.insert.linkUrl;
                    editor.insertText(index, linkTitle, 'user');
                    editor.setSelection(index, linkTitle.length, 'user');
                    getEditor().format('link', this.props.insert.linkUrl, 'user');
                }
            }
            this.props.insert.openLinkDialog = false;
        }
    }

    render() {
        // const {linkPosition,openLinkDialog} = this.props.insert;
        return (
            <section className="weditor-bubble" style={{
                top: this.props.insert.linkPosition.top,
                left: this.props.insert.linkPosition.left,
                display: this.props.insert.openLinkDialog ? 'block' : 'none'
            }}>
                <div className="weditor-bubble-item">
                    <span>文本：</span> <Input className="weditor-insert-input"
                                            value={this.props.insert.linkTitle}
                                            onChange={this.changeTitle}/>
                </div>
                <div className="weditor-bubble-item">
                    <span>链接：</span> <Input className="weditor-insert-input"
                                            value={this.props.insert.linkUrl}
                                            onChange={this.changeUrl}/>
                    <Button onClick={this.apply}>应用</Button>
                </div>
            </section>
        );
    }
}
