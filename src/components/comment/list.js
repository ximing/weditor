/**
 * Created by yeanzhi on 17/7/19.
 */
'use strict';
import React, {Component} from 'react';
import CommentItem from './item';
import {getEditor} from '../../lib/quillEditor';
import {observer,inject} from 'mobx-react';

@inject('comments') @observer
export default class CommentList extends Component {

    render() {
        return (
            <div className="comments-list">
                {
                    this.props.comments.list.map((_, i) => {
                        return (
                            <CommentItem key={i} comment={_}/>
                        );
                    })
                }
            </div>
        )
    }
}
