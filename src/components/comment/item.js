/**
 * Created by yeanzhi on 17/8/2.
 */
'use strict';
import React,{Component} from 'react';
export default class CommentItem extends Component {
    componentDidMount(){

    }
    render(){
        return(
            <div className="comment-item">
                CommentItem{this.props.commentId}
            </div>
        )
    }
}
