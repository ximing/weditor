/**
 * Created by yeanzhi on 17/7/19.
 */
'use strict';
import React, {Component} from 'react';
import CommentItem from './item';
import {getEditor} from '../../lib/quillEditor';
import {observer,inject} from 'mobx-react';

const itemHeight = 100;
@inject('comments') @observer
export default class CommentList extends Component {

    render() {
        let preComment = {top:-itemHeight},comments=[];
        const {activeCommentId,list,activeCommentIndex} = this.props.comments;
        if(activeCommentIndex<0){
            list.forEach(item=>{
                let comment = Object.assign({},item);
                comment.top = Math.max((preComment.top+itemHeight),comment.top);
                comments.push(comment);
                preComment = comment;
            })
        }else{
            let activeComment = Object.assign({},list[activeCommentIndex]);
            preComment = activeComment;
            for(let i = activeCommentIndex-1;i>=0;i--){
                let comment = Object.assign({},list[i]);
                comment.top = Math.min((preComment.top-itemHeight),comment.top);
                comments.unshift(comment);
                preComment = comment;
            }
            comments.push(activeComment);
            preComment = activeComment;
            for(let i = activeCommentIndex+1;i<list.length;i++){
                let comment = Object.assign({},list[i]);
                comment.top = Math.max((preComment.top+itemHeight),comment.top);
                comments.push(comment);
                preComment = comment;
            }
        }
        return (
            <div className="comments-list">
                {
                    comments.map((_, i) => {
                        return (
                            <CommentItem key={i} comment={_}/>
                        );
                    })
                }
            </div>
        )
    }
}
