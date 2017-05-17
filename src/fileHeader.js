/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import React, {Component} from 'react';
import Icon from './components/icon/index';
import printThis from './lib/printThis';
const $ = window.jQuery;
printThis($);
// import {inject,observer} from 'mobx-react'

export default class CommonEditor extends Component {

    print = () =>{
        $('.ql-editor').printThis({
            pageTitle:'',
            header:null,
            footer:null
        });
    }


    render() {
        const {style} = this.props;
        return (
            <span className="ql-formats file-header" style={style}>
                <button className="ql-ordinaryprint " onClick={this.print}>
                    <Icon type="ordinaryprint"/>
                </button>
                <span className="ql-pdf opver-area">
                    <span className="opver-icon  pdf-icon"></span>
                    <span>导出pdf</span>
                </span>

                <span className="ql-word opver-area">
                    <span className="opver-icon word-icon"></span>
                    <span>导出word</span>
                </span>
            </span>
        );
    }
}
