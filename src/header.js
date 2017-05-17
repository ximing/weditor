/**
 * Created by yeanzhi on 17/2/26.
 */
'use strict';
import React, {Component} from 'react';
import {formatDate} from './lib/timeRelated';
import CommonHeader from './commonHeader';
import StartHeader from './startHeader';
import {getEditor} from './lib/quillEditor';
import {info} from './components/toast';
import Dropdown from 'rc-dropdown';
import Menu, { Item as MenuItem, Divider } from 'rc-menu';
import 'rc-dropdown/assets/index.css';


import printThis from './lib/printThis';
const $ = window.jQuery;
printThis($);

import help from './model/help';
import insert from './model/insert';
import format from './model/format';
import editor from './model/editor';

export default class EditorHeader extends Component {
    static defaultProps ={
        fileOptions:[],
        helpOptions:[]
    }
    constructor() {
        super();
        this.backList = this.backList.bind(this);
        this.state = {
            panel: 1
        };
    }

    componentDidMount() {
    }


    backList() {
        // this.props.dispatch(push('/xnote/index'));
    }


    HelpMenuClick = ({key}) =>{
        if(key === '0') {
            help.hotKeysDialog = true;
        }else{
            this.props.helpOptions.forEach(item=>{
                if(item.key === key) {
                    item.onClick(key);
                }
            });
        }
    };

    fileMenuClick = ({key}) =>{
        if(key === '0') {
            $('.ql-editor').printThis({
                pageTitle:'',
                header:null,
                footer:null
            });
        }else{
            this.props.helpOptions.forEach(item=>{
                if(item.key === key) {
                    item.onClick(key);
                }
            });
        }
    };

    insertMenuClick = ({key}) =>{
        if(key === '0') {
            insert.imageSelection = getEditor().getSelection();
            insert.openImageDialog = true;
        }else if(getEditor()) {
            let toolbar = getEditor().getModule('toolbar');
            toolbar.handlers['link'].call(toolbar, !(editor.format && editor.format.link));
        }
    };

    export = async() => {
        if (getEditor()) {
            // let res = await api.getExportUrl(window.quillEditor.getContents());
            document.getElementById('gf_down_file').src = res.url;
        }
    }

    renderOpverHeader() {
        const {panel} = this.state;
        return (
            <div className="toolbar-opver" id="toolbarOpver">
                <CommonHeader />
                <StartHeader style={{display:panel === 1 ? 'inline-block' : 'none'}}/>
            </div>
        );

    }

    changePanel(panel) {
        return () => {
            if(panel === 4 || panel === 5) {
                info('稍后开放，敬请期待');
                return;
            }
            this.setState({panel});
        };
    }


    renderToolbar() {
        let menu = (
            <Menu selectable={false} onClick={this.HelpMenuClick}>
                <MenuItem key="0">键盘快捷键</MenuItem>
                <Divider />
                {
                    this.props.helpOptions.map(item=>{
                        return(
                            <MenuItem key={item.key}>{item.content}</MenuItem>
                        );
                    })
                }
            </Menu>
        );

        let fileMenu = (
            <Menu selectable={false} onClick={this.fileMenuClick}>
                {
                    this.props.fileOptions.map(item=>{
                        return(
                            <MenuItem key={item.key}>{item.content}</MenuItem>
                        );
                    })
                }
                <Divider />
                <MenuItem key="0">打印</MenuItem>
            </Menu>
        );


        const {panel} = this.state;
        return(
            <div className="toolbar-tab">
                <Dropdown
                    trigger={['click']}
                    overlay={fileMenu}
                    animation="slide-up"
                >
                    <span className={'file-tab'}>文件</span>
                </Dropdown>

                <Dropdown
                    trigger={['click']}
                    overlay={(
                        <Menu selectable={false} onClick={this.insertMenuClick}>
                            <MenuItem key="0">插入图片</MenuItem>
                            <MenuItem key="1">插入链接</MenuItem>
                        </Menu>
                    )}
                    animation="slide-up"
                >
                    <span className={'insert-tab'}>插入</span>
                </Dropdown>

                <span className={`view-tab ${panel === 3 ? 'active' : ''}`} onClick={this.changePanel(4)}>视图</span>

                <span className="history-tab" onClick={this.changePanel(4)}>修订历史</span>

                <Dropdown
                    trigger={['click']}
                    overlay={menu}
                    animation="slide-up"
                >
                    <span className="help-tab" >帮助</span>
                </Dropdown>
            </div>
        );
    }


    render() {
        return (
            <div className="weditor-header">
                <div className="header-left-box list-header">
                    <div className="s-header">
                        <a className="header-back-up" onClick={this.backList}>
                            <span className="header-back-icon"/>
                        </a>
                        <span className="s-header-text">
                            <div className="span-input-wrap">
                                <input className="title-input span-input" defaultValue={'ceshi.doc'} maxLength="100"
                                       style={{
                                           display: 'none'
                                       }}/>
                                <span className="title-input-pre span-input-pre">{this.props.doc.name || '未命名'}</span>
                            </div>
                        </span>
                        <span className="s-header-time"
                              id="save-status">{this.props.doc.status}</span>
                    </div>
                </div>
                <div className="header-right-box">
                    {this.props.rightContent}
                </div>
                <div className="editor-toolbar" id="toolbar">
                    {this.renderToolbar()}
                    {this.renderOpverHeader()}
                </div>
            </div>
        );
    }
}
