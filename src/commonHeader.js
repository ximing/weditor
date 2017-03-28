/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import React, {Component} from "react";
import Icon from './components/icon/index';
import {getEditor} from './lib/quillEditor'
import format from './model/format';

export default class CommonEditor extends Component {

    clearFormat = ()=>{
        if(getEditor()){
            const {index,length} = getEditor().getSelection();
            if(index === 0 || !!index){
                getEditor().removeFormat(index,length,'user');
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

    format = ()=>{
        let {index,length} = getEditor().getSelection();
        if(!!index){
            format.currentFormat = getEditor().getFormat(index,length);
        }
    }

    render() {
        return (
            <span className="ql-formats common-header">
                <button className="ql-undo" onClick={this.undo}>
                    <Icon type="undo"/>
                </button>
                <button className="ql-redo" onClick={this.redo}>
                    <Icon type="redo"/>
                </button>
                <button className="ql-format" onClick={this.format}>
                    <Icon type="geshishua"/>
                </button>
                <button className="ql-clear-format" onClick={this.clearFormat}>
                    <Icon type="qingchu"/>
                </button>
            </span>
        )
    }
}
