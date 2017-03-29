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
class  Editor extends Component {
    static defaultProps = {
        options:{
            uploadUrl:''
        },
        doc:{
            name:'',
            status:''
        },
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
            >
                <WEditor options={this.props.options} doc={this.props.doc} rightContent = {this.props.rightContent}/>
            </Provider>
        )
    }
}
export default Editor;
