/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import React, {Component} from "react";
import Icon from './components/icon/index';
import quillEditor from './lib/quillEditor'

export default class CommonEditor extends Component {

    clearFormat = ()=>{
        if(quillEditor){
            const {index,length} = window.quillEditor.getSelection();
            if(!!index){
                window.quillEditor.removeFormat(index,length,window.Quill.sources.users);
            }
        }
    };

    undo = ()=>{
        if(quillEditor){
            quillEditor.history.undo();
        }
    };

    redo = ()=>{
        if(quillEditor){
            quillEditor.history.redo();
        }
    };

    render() {
        return (
            <span className="ql-formats common-header">
                <button className="ql-undo" onClick={this.undo}>
                    <Icon type="undo"/>
                </button>
                <button className="ql-redo" onClick={this.redo}>
                    <Icon type="redo"/>
                </button>
                <button className="ql-format">
                    <Icon type="geshishua"/>
                </button>
                <button className="ql-clear-format" onClick={this.clearFormat}>
                    <Icon type="qingchu"/>
                </button>
            </span>
        )
    }
}
