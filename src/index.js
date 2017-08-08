/**
 * Created by pomy on 07/02/2017.
 */

'use strict';
import React, {Component} from 'react';
import {observer,Provider} from 'mobx-react';
import {autorun,observe} from 'mobx';
window.RangeFix = require('rangefix');
import './style/index.scss';
import 'quill/dist/quill.snow.css';
import {getEditor,resize} from './lib/quillEditor';
import WEditor from './weditor';
import catalogue from './model/catalogue';
import insert from './model/insert';
import editor from './model/editor';
import help from './model/help';
import {forceUpdate} from './model/markerLayer'
import hooks from './lib/hooks';
import layerManager from './lib/layer';
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
        models:{},
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

    on(eventName, callback){
        let disposer = null;
        if(eventName === 'editor-change'){
            disposer = observe(editor,callback);
        }
        return disposer;
    }

    render() {
        return(
            <Provider
                {...this.props.models}
                catalogue={catalogue}
                insert={insert}
                editor={editor}
                help={help}
                forceUpdate={forceUpdate}
            >
                <WEditor onlyRead={this.props.onlyRead}
                         options={this.props.options}
                         doc={this.props.doc}/>
            </Provider>
        );
    }
}
export default Editor;

export {
    catalogue,insert,editor,help,WEditor,getEditor,layerManager
};
