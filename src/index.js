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
//import 'quill/dist/quill.bubble.css';
import {getEditor,resize} from './lib/quillEditor';
import WEditor from './weditor';
import catalogue from './model/catalogue';
import insert from './model/insert';
import editor from './model/editor';
import help from './model/help';
import user from './model/user';
import comments from './model/comments';
import {forceUpdate} from './model/markerLayer'
import hooks from './lib/hooks';
import {loop} from './lib/util'
import {defaultAvatar} from './lib/consts';


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
        title:null,
        onlyRead:false,
        hooks:{},
        user:{
            name:'薛之谦',
            avatar:defaultAvatar,
            uid:0,
            sid:0
        }
    };

    constructor(props) {
        super(props);
        this.getEditor = getEditor;
        hooks.onSave = props.hooks.onSave || loop;
        user.name = props.user.name;
        user.avatar = props.user.avatar || defaultAvatar;
        user.uid = props.user.uid;
        user.sid = props.user.sid;
    };

    setContents(content) {
        if(getEditor()) {
            getEditor().setContents(content);
        }
    };

    on(eventName, callback){
        let disposer = null;
        if(eventName === 'comments-change'){
            disposer = observe(comments.list,callback);
        }else if(eventName === 'editor-change'){
            disposer = observe(editor,callback);
        }
        return disposer;
    }

    setComments(comments){
        comments.list = comments;
    }

    updateComments(comment){

    }

    updateUser(_user){
        user.name = _user.name || user.name;
        user.avatar = _user.avatar || user.avatar;
        user.uid = _user.uid || user.uid;
        user.sid = _user.sid || user.sid;
    }

    render() {
        return(
            <Provider
                catalogue={catalogue}
                insert={insert}
                editor={editor}
                help={help}
                comments={comments}
                forceUpdate={forceUpdate}
            >
                <WEditor onlyRead={this.props.onlyRead}
                         title = {this.props.title}
                         options={this.props.options}
                         doc={this.props.doc}/>
            </Provider>
        );
    }
}
export default Editor;

export {
    catalogue,insert,editor,help,user,comments,WEditor,getEditor
};
