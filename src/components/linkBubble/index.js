/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import './index.scss'
import React,{Component} from 'react';
import Input from '../input/index';
import Button from '../button/index'

export default class LinkDialog extends Component {
    render(){
        return(
            <section className="weditor-bubble">
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
