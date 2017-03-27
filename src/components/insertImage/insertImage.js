/**
 * Created by yeanzhi on 17/3/27.
 */
'use strict';
import React,{Component} from 'react';
import Dialog from '../dialog'
import {inject,observer} from 'mobx-react'
import {contains} from '../../lib/util'

@inject('insert') @observer
export default class InsertImage extends Component{
    componentDidMount(){
        window.document.addEventListener('click',this.otherDOMClick,false)
    }

    componentWillUnmount(){
        window.document.removeEventListener('click',this.otherDOMClick,false)
    }

    closeBubble = () => {
        this.props.insert.openImageDialog = false;
    };

    otherDOMClick(e) {
        let node = e.target;
        if (!this.props.insert.openImageDialog) {
            return false;
        }
        let target = this.target;
        if (!(contains(target, node)) && this.state.shown) {
            this.closeBubble();
        }
    }

    render(){
        return(
            <Dialog
                content={
                    <div className="weditor-insert-image">
                        hello
                    </div>
                }
                onClose={this.closeBubble}
            />
        )
    }
}
