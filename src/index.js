/**
 * Created by pomy on 07/02/2017.
 */

'use strict';
import React, {Component} from 'react';
import {observer,Provider} from 'mobx-react';

import './style/index.scss';
import 'quill/dist/quill.snow.css';
//import 'quill/dist/quill.bubble.css';
import {getEditor,resize} from './lib/quillEditor';
import WEditor from './weditor';
import catalogue from './model/catalogue';
import insert from './model/insert';
import editor from './model/editor';
import help from './model/help';
import hooks from './lib/hooks';
import {loop} from './lib/util'
class  Editor extends Component {
    static defaultProps = {
        options:{
            uploadUrl:'',
            helpOptions:[],
            fileOptions:[]
        },
        doc:{
            name:'',
            status:''
        },
        // coCursors:[],
        rightContent:null,
        onlyRead:false,
        hooks:{}
    };

    constructor(props) {
        super(props);
        this.getEditor = getEditor;
        hooks.onSave = props.hooks.onSave || loop;
    };

    setContents(content) {
        if(getEditor()) {
            getEditor().setContents(content);
        }
    };

    render() {
        return(
            <Provider
                catalogue={catalogue}
                insert={insert}
                editor={editor}
                help={help}
            >
                <WEditor onlyRead={this.props.onlyRead}
                         options={this.props.options}
                         doc={this.props.doc}/>
            </Provider>
        );
    }
}
export default Editor;
