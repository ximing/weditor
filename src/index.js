/**
 * Created by pomy on 07/02/2017.
 */

'use strict';
import React, {Component} from "react";
import {observer,Provider} from 'mobx-react';

import './index.scss'
import 'quill/dist/quill.snow.css'
import {getEditor} from './lib/quillEditor'
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
        coCurcors:[],
        rightContent:null
    };

    constructor(){
        super();
        this.getEditor = getEditor;
    };

    render(){
        return(
            <Provider
                catalogue={catalogue}
                insert={insert}
                editor={editor}
            >
                <WEditor options={this.props.options}
                         coCurcors = {this.props.coCurcors}
                         doc={this.props.doc}
                         rightContent = {this.props.rightContent}/>
            </Provider>
        )
    }
}
export default Editor;
