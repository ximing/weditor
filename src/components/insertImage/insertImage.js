/**
 * Created by yeanzhi on 17/3/27.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';
import 'rc-tabs/assets/index.css';
import Tabs, {TabPane} from 'rc-tabs';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar.js';
import TabContent from 'rc-tabs/lib/TabContent.js';
import Dialog from '../dialog';
import {contains} from '../../lib/util';
import {Uploader} from '../uploader/index';
import Button from '../button';
import insert from '../../model/insert';
import {getEditor} from '../../lib/quillEditor'
import {Line} from 'rc-progress';
import {error} from '../toast';
import Input from '../input';
const $ = window.jQuery;

export default class InsertImage extends Component {
    state = {
        activeKey: '1',
        linkUrl: '',
        progress: 0
    }

    componentDidMount() {
        setTimeout(() => {
            window.document.addEventListener('click', this.otherDOMClick);
        }, 100);
        this.initUploader();
    }

    onLinkUrlChange = (e) => {
        this.setState({
            linkUrl: e.target.value
        });
    }

    insertImage = (url) => {
        let index = 0;
        if (insert.imageSelection) {
            index = insert.imageSelection.index;
        }
        console.log('insert Image ', index);
        getEditor().insertEmbed(index, 'image', url, Quill.sources.USER);
        insert.openImageDialog = false;
    };

    insertLink = () => {
        if (this.state.linkUrl) {
            this.insertImage(this.state.linkUrl);
        }

    };

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
            'withCredentials': true,
            'server': this.props.uploadUrl || '',
            accept: {
                title: 'Images',
                extensions: 'jpg,jpeg,bmp,png,gif',
                mimeTypes: 'image/*'
            }
        });
        uploader.on('beforeFileQueued', (wuFile) => {
            if (wuFile.size > 1024 * 1024 * 20) {
                error('图片大小不能超过20M');
                return false;
            }
            return true;
        });
        uploader.on('fileQueued',(wuFile)=>{
            this.file = wuFile;
        });

        uploader.on('uploadProgress', (file, currentProgress, loaded, total) => {
            console.log('uploadProgress'.repeat(10))
            console.log(currentProgress, loaded, total)
            this.setState({
                progress: (currentProgress / total) * 100
            })
        });
        uploader.on('uploadAccept', (obj, res) => {
            this.file = null;
            if (typeof res === 'string') {
                res = JSON.parse(res);
            }
            console.log('uploadAccept', res, res.errno === 0, insert)
            if (res.errno === 0) {
                if (res.data.url) {
                    this.insertImage(res.data.url);
                }
            } else {
                error('上传服务错误');
            }
        });
        uploader.on('uploadComplete', () => {
            uploader.reset();
        });
        uploader.on('uploadError', (file, err) => {
            console.error(err);
            uploader.reset();
            error('上传服务错误!');
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
        if (this.file && this.file.id) {
            this.uploader.removeFile(this.file.id);
        }
        insert.openImageDialog = false;
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
        const {progress} = this.state;
        return (
            <Dialog
                title="插入图片"
                className="weditor-insert-image-dialog"
                content={
                    <div className="weditor-insert-image">
                        <div className="weditor-uploader-wrapper">
                            <Tabs
                                renderTabBar={() => <ScrollableInkTabBar onTabClick={this.onTabClick}/>}
                                renderTabContent={() => <TabContent animatedWithMargin/>}
                                activeKey={this.state.activeKey}
                                onChange={this.onChange}
                            >
                                <TabPane tab={'本地上传'} key="1">
                                    <div className="weditor-uploader-file-inner">
                                        <p className="weditor-image-tips"
                                           style={{display: (progress === 0 || progress === 100) ? 'block' : 'none'}}>
                                            最大上传20M的图片</p>
                                        <Button id="weditorUploaderPick"
                                                style={{display: (progress === 0 || progress === 100) ? 'block' : 'none'}}>点击上传</Button>
                                        <Line percent={progress} trailWidth="2" strokeWidth="2" strokeColor="#118bfb"
                                              style={{display: (progress > 0 && progress < 100) ? 'block' : 'none'}}/>

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
