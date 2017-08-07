/**
 * Created by yeanzhi on 17/7/18.
 */
'use strict';
import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';

import {getEditor} from '../../lib/quillEditor';
import Icon from '../icon';
import comments from '../../model/comments';

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
        if (range && range.length>0) {
            const formats = getEditor().getFormat(range);
            if(!formats['comments']){
                const {top} = getEditor().getBounds(range.index);
                this.setState({
                    top,
                    display:'block'
                });
            }else{
                this.setState({
                    display:'none'
                });
            }
        } else {
            //Cursor not in the editor
            this.setState({
                display:'none'
            });
        }
    };

    showCreatePanel(top){
        return ()=>{
            comments.createPanelPosition = {
                top,
                display:'block'
            };
            this.setState({
                display:'none'
            })
        }

    }

    render(){
        const {top,display} = this.state;
        return(
            <button className="ql-comment-btn" onClick={this.showCreatePanel(top)} style={{
                top:top,
                display:display
            }}>
                <Icon type="comment"/>
            </button>
        );
    }
}
