/**
 * Created by pomy on 07/02/2017.
 */

'use strict';
import React, {Component} from "react";
import {observer,Provider} from 'mobx-react';

import './index.scss'
import 'quill/dist/quill.snow.css'
import {getEditor,resize} from './lib/quillEditor'
import WEditor from './weditor'
import catalogue from './model/catalogue';
import insert from './model/insert';
import editor from './model/editor';

class  Editor extends Component {
    static defaultProps = {
        options:{
            uploadUrl:''
        },
        doc:{
            name:'',
            status:''
        },
        coCursors:[],
        rightContent:null
    };

    constructor(){
        super();
        this.getEditor = getEditor;
    };

    setContents(content){
        if(getEditor()){
            getEditor().setContents(content);
        }
    };

    render(){
        return(
            <Provider
                catalogue={catalogue}
                insert={insert}
                editor={editor}
            >
                <WEditor options={this.props.options}
                         coCursors = {this.props.coCursors}
                         doc={this.props.doc}
                         rightContent = {this.props.rightContent}/>
            </Provider>
        )
    }
}
export default Editor;
