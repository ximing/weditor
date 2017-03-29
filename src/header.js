/**
 * Created by yeanzhi on 17/2/26.
 */
'use strict';
import React, {Component} from "react";
import {formatDate} from "./lib/timeRelated";
import CommonHeader from './commonHeader';
import FileHeader from './fileHeader';
import StartHeader from './startHeader';
import InsertHeader from './insertHeader';
import ViewHeader from './viewHeader';
import {getEditor} from './lib/quillEditor'
import {info} from './components/toast'
export default class EditorHeader extends Component {
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
                <FileHeader rangeFormat={this.props.rangeFormat}
                            style={{display:panel===0?'inline-block':'none'}}/>
                <StartHeader rangeFormat={this.props.rangeFormat}
                             style={{display:panel===1?'inline-block':'none'}}/>
                <InsertHeader rangeFormat={this.props.rangeFormat}
                              style={{display:panel===2?'inline-block':'none'}}/>
                <ViewHeader rangeFormat={this.props.rangeFormat}
                            style={{display:panel===3?'inline-block':'none'}}/>
            </div>
        )

    }

    changePanel(panel) {
        return () => {
            if(panel===4 || panel === 5){
                info('稍后开放，敬请期待')
                return;
            }
            this.setState({panel});
        }
    }

    renderToolbar(){
        const {panel} = this.state;
        return(
            <div className="toolbar-tab">
                <span className={`file-tab ${panel===0?'active':''}`} onClick={this.changePanel(0)}>文件</span>
                <span className={`start-tab ${panel===1?'active':''}`} onClick={this.changePanel(1)}>开始</span>
                <span className={`insert-tab ${panel===2?'active':''}`} onClick={this.changePanel(2)}>插入</span>
                {/*<span className="table-tab">视图</span>*/}
                <span className={`view-tab ${panel===3?'active':''}`} onClick={this.changePanel(3)}>视图</span>
                <span className="history-tab" onClick={this.changePanel(4)}>修订历史</span>
                <span className="help-tab" onClick={this.changePanel(5)}>帮助</span>
            </div>
        )
    }


    render() {
        console.log(this.props.rangeFormat)

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
                                <span className="title-input-pre span-input-pre">{'测试远安的doc.docx'}</span>
                            </div>
                        </span>
                        <span className="s-header-time"
                              id="save-status">{formatDate('yyyy/MM/dd HH:mm', new Date().getTime())}更新</span>
                    </div>
                </div>
                <div className="header-right-box">

                </div>
                <div className="editor-toolbar" id="toolbar">
                    {this.renderToolbar()}
                    {this.renderOpverHeader()}
                </div>
            </div>
        );
    }
}
