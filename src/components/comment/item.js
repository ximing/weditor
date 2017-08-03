/**
 * Created by yeanzhi on 17/8/2.
 */
'use strict';
import React,{Component} from 'react';
import {getEditor} from '../../lib/quillEditor';
import comments from '../../model/comments';

export default class CommentItem extends Component {
    componentDidMount(){

    }
    handleClick = ()=>{
        if(getEditor()){
            let commentsModule = getEditor().getModule('comments');
            comments.activeCommentId = this.props.comment.commentId;
            commentsModule.reflushComments(this.props.comment.commentId);
        }
    };
    render(){
        let {commentId,left,top}  =this.props.comment;

        return(
            <div className="comment-item" style={{
                top:top,
                right:0
            }} onClick={this.handleClick}>
                CommentItem{this.props.comment.commentId}
            </div>
        )
    }
}
