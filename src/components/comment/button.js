/**
 * Created by yeanzhi on 17/7/18.
 */
'use strict';
import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';

import {getEditor} from '../../lib/quillEditor';

import Icon from '../icon';

@inject(state => ({
    editor: state.editor
})) @observer
export default class CommentBtn extends Component{

    state = {
        display:'none',
        top:0
    };

    componentDidMount(){
        if(getEditor()){
            getEditor().on('selection-change',this.selectionChange)
        }
    }

    componentWillUnmount(){
        if(getEditor()){
            getEditor().on('selection-change',this.selectionChange)
        }
    }

    selectionChange = (range, oldRange, source) => {
        if (range) {
            const {top} = getEditor().getBounds(range.index);
            this.setState({
                top
            });
        } else {
            //Cursor not in the editor
        }
    };

    render(){
        const {top} = this.state;
        return(
            <button className="ql-comment-btn" style={{
                top:top
            }}>
                <Icon type="comment"/>
            </button>
        );
    }
}
