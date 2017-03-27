/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import './index.scss'
import React,{Component} from 'react';
import {inject,observer} from 'mobx-react'

import Input from '../input/index';
import Button from '../button/index'

@inject('insert') @observer
export default class LinkBubble extends Component {
    render(){
        const {linkPosition,openLinkDialog} = this.props.insert;
        debugger
        return(
            <section className="weditor-bubble" style={{
                top:linkPosition.top,
                left:linkPosition.left,
                display:openLinkDialog?'block':'none'
            }}>
                <div className="weditor-bubble-item">
                    <span>文本：</span>  <Input className="weditor-insert-input"/>
                </div>
                <div className="weditor-bubble-item">
                    <span>链接：</span> <Input className="weditor-insert-input"/>
                    <Button>应用</Button>
                </div>
            </section>
        )
    }
}
