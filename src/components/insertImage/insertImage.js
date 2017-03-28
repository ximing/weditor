/**
 * Created by yeanzhi on 17/3/27.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';
import {inject, observer} from 'mobx-react';
import $ from 'jquery';

import Dialog from '../dialog';
import {contains} from '../../lib/util';
import {Uploader} from '../uploader/index';
import Button from '../button';
import {getEditor} from '../../lib/quillEditor';
import insert from '../../model/insert'

@inject('insert') @observer
export default class InsertImage extends Component {
    componentDidMount() {
        setTimeout(()=>{
            window.document.addEventListener('click', this.otherDOMClick);
        },100);
        this.initUploader();
    }

    initUploader() {
        this.rootNode = ReactDOM.findDOMNode(this);
        this.target = this.rootNode.getElementsByClassName('weditor-insert-image-dialog')[0];
        let uploader = this.uploader = new Uploader({
            'dnd': '.weditor-uploader-wrapper',
            'pick': '#uploaderPick',
            'auto': true,
            'chunked': false,
            'chunkSize': 20971520,
            'linterContiner': document,
            '$': $,
            'body': this.target,
            'multiple': false,
            'method': 'post',
            'withCredentials':true,
            'server': 'http://mind.xm.test.sankuai.com/api/upload'
        });
        uploader.on('uploadAccept', (obj, res) => {
            res = JSON.parse(res);
            if (res.errno === 0) {
                if (res.data.url) {
                    const {index, length} = this.props.insert.imageSelection;
                    getEditor().insertEmbed(index, 'image', res.data.url, Quill.sources.USER);
                    this.props.insert.openImageDialog = false;
                }
            } else {
            }
        });
    }

    componentWillUnmount() {
        window.document.removeEventListener('click', this.otherDOMClick);
        this.uploader.removeEvent('uploadAccept');
        this.uploader.destory();
    }

    closeBubble = () => {
        console.log('close bubble')
        this.props.insert.openImageDialog = false;
    };

    otherDOMClick = (e) => {
        let node = e.target;
        if (!insert.openImageDialog) {
            return false;
        }
        let target = this.target;
        if (insert.openImageDialog && !contains(target, node)) {
            this.closeBubble();
        }
    }

    render() {
        return (
            <Dialog
                title="插入图片"
                className="weditor-insert-image-dialog"
                content={
                    <div className="weditor-insert-image">
                        <div className="weditor-uploader-wrapper">
                            <p className="weditor-image-tips">最大上传20M的图片</p>
                            <Button id="uploaderPick">点击上传</Button>
                        </div>
                    </div>
                }
                onClose={this.closeBubble}
            />
        )
    }
}
