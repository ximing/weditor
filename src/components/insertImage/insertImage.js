/**
 * Created by yeanzhi on 17/3/27.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';
import {inject, observer} from 'mobx-react';
import 'rc-tabs/assets/index.css';
import Tabs, { TabPane} from 'rc-tabs';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar.js';
import TabContent from 'rc-tabs/lib/TabContent.js';
import Dialog from '../dialog';
import {contains} from '../../lib/util';
import {Uploader} from '../uploader/index';
import Button from '../button';


import Input from '../input';
import {error} from '../toast';
const $ = window.jQuery;

export default class InsertImage extends Component {
    state = {
        activeKey:'1',
        linkUrl:''
    }
    componentDidMount() {
        setTimeout(()=>{
            window.document.addEventListener('click', this.otherDOMClick);
        },100);
        this.initUploader();
    }

    onLinkUrlChange = (e)=>{
        this.setState({
            linkUrl:e.target.value
        });
    }

    insertLink = ()=>{
        if(this.state.linkUrl) {

        }

    }
    initUploader() {
        this.rootNode = ReactDOM.findDOMNode(this);
        this.target = this.rootNode.getElementsByClassName('weditor-insert-image-dialog')[0];
        let uploader = this.uploader = new Uploader({
            'dnd': '.weditor-uploader-wrapper',
            'pick': '#weditorUploaderPick',
            'auto': true,
            'chunked': false,
            'chunkSize': 20971520,
            'linterContiner': document,
            '$': $,
            'body': this.target,
            'multiple': false,
            'method': 'post',
            'withCredentials':true,
            'server': this.props.uploadUrl || ''
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
                error('上传服务错误');
            }
        });
        uploader.on('uploadComplete',()=>{
            uploader.reset();
        });
        uploader.on('uploadError',()=>{
            uploader.reset();
            error('上传服务错误');
        });
    }

    componentWillUnmount() {
        window.document.removeEventListener('click', this.otherDOMClick);
        this.uploader.removeEvent('uploadAccept');
        this.uploader.removeEvent('uploadComplete');
        this.uploader.removeEvent('uploadError');
        this.uploader.destory();
    }

    closeBubble = () => {
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

    onChange = (activeKey) => {
        this.setState({
            activeKey
        });
    }

    render() {
        return (
            <Dialog
                title="插入图片"
                className="weditor-insert-image-dialog"
                content={
                    <div className="weditor-insert-image">
                        <div className="weditor-uploader-wrapper">
                            <Tabs
                                renderTabBar={() => <ScrollableInkTabBar onTabClick={this.onTabClick}/>}
                                renderTabContent={() => <TabContent animatedWithMargin />}
                                activeKey={this.state.activeKey}
                                onChange={this.onChange}
                            >
                                <TabPane tab={'本地上传'} key="1">
                                    <div className="weditor-uploader-file-inner">
                                        <p className="weditor-image-tips">最大上传20M的图片</p>
                                        <Button id="weditorUploaderPick">点击上传</Button>
                                    </div>
                                </TabPane>
                                <TabPane tab={'插入外链'} key="2">
                                    <div className="weditor-uploader-file-inner">
                                        <div>
                                            <Input onChange={this.onLinkUrlChange}/>
                                            <Button onClick={this.insertLink}>插入</Button>
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                }
                onClose={this.closeBubble}
            />
        );
    }
}
