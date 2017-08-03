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

    componentDidMount() {
        if (getEditor()) {
            getEditor().on('text-change', this.onTextChange);
        }
    }

    componentWillUnmount() {
        if (getEditor()) {
            getEditor().off('text-change', this.onTextChange);
        }
    }

    /*
    * delta 首字符的话  只有  insert delete
    * 其他地方，会有 retain ，insert delete 两个
    * insert是往后插入的retain
    * delete是往前删除的retain
    *
    * */
    onTextChange = (delta, oldDelta, source) => {
        console.log('comments',delta);
        delta.ops.forEach(item => {
            if (item.attributes) {
                if (item.attributes['comments']) {
                } else if (item.attributes['comments'] === null) {
                }
            }
        });
    };

    render() {
        return (
            <div className="comments-list">
                {
                    this.props.comments.list.sort((a, b) => a.index - b.index).map((_, i) => {
                        return (
                            <CommentItem key={i} commentId={_.commentId}/>
                        );
                    })
                }
            </div>
        )
    }
}
