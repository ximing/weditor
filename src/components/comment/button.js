/**
 * Created by yeanzhi on 17/7/18.
 */
'use strict';
import React,{Component} from 'react';
import {inject, observer} from 'mobx-react';

import Icon from '../icon';

@inject(state => ({
    editor: state.editor
})) @observer
export default class extends Component{
    render(){
        const { index,length} = this.props.editor.range;

        return(
            <button className="ql-comment-btn">
                <Icon type="comment"/>
            </button>
        );
    }
}
