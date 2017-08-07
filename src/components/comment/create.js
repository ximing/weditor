/**
 * Created by yeanzhi on 17/8/3.
 */

'use strict';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {inject, observer} from 'mobx-react';

import user from '../../model/user';
import {defaultAvatar} from "../../lib/consts";
import {formatDate} from '../../lib/timeRelated';
import {stopPropagation} from '../../lib/util'
import {contains} from '../../lib/util';
import {getEditor} from '../../lib/quillEditor';
import $ from 'jquery';

import Button from '../button';

@inject(state => ({
    comments: state.comments
})) @observer
export default class CommentCreate extends Component {
    componentDidMount(){
        setTimeout(() => {
            $(document).on('mousedown',this.otherDOMClick);
        }, 10);
        this.target = ReactDOM.findDOMNode(this);
        $(window).on('resize',this.onWindowResize);
    }

    componentWillUnmount() {
        $(document).off('mousedown',this.otherDOMClick);
        $(window).off('resize',this.onWindowResize);
    }

    onWindowResize = ()=>{
        this.closeBubble();
    };

    closeBubble = () => {
        if(getEditor()){
            getEditor().focus();
        }
        this.props.comments.createPanelPosition.display = 'none';
    };

    otherDOMClick = (e) => {
        let node = e.target;
        console.log(this.props.comments.createPanelPosition.display,'this.props.comments.display');
        if (this.props.comments.createPanelPosition.display === 'none') {
            return false;
        }
        let target = this.target;
        if (!(contains(target, node))) {
            this.closeBubble();
        }
    };

    render(){
        let {comments} = this.props;
        let {createPanelPosition} = comments;
        return(
            <div className="comment-create" style={createPanelPosition} onClick={stopPropagation}>
                <div className="comment-create-header">
                    <img src={user.avatar} alt="" onError={e=>e.target.src = defaultAvatar}/>
                    <section>
                        <p className="user-name">{user.name}</p>
                        <p className="create-time">{formatDate('yyyy-MM-dd hh:mm',new Date().getDate())}</p>
                    </section>
                </div>
                <div className="comment-create-body">
                    <input type="text" placeholder="请输入批注内容"/>
                </div>
                <div className="comment-create-footer">
                    <Button color="white" className="cancel-create-comment" onClick={this.closeBubble}>取消</Button>
                    <Button className="create-comment">确定</Button>
                </div>
            </div>
        )
    }
}
