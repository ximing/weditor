/**
 * Created by yeanzhi on 17/8/2.
 */
'use strict';
import React,{Component} from 'react';
export default class CommentItem extends Component {
    componentDidMount(){

    }
    render(){
        let {commentId,left,top}  =this.props.comment;

        return(
            <div className="comment-item" style={{
                top:top,
                right:0
            }}>
                CommentItem{this.props.comment.commentId}
            </div>
        )
    }
}
