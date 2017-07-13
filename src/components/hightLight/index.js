/**
 * Created by yeanzhi on 17/4/10.
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {contains} from '../../lib/util';
import Icon from '../icon';
import {getEditor} from '../../lib/quillEditor';
import editor from '../../model/editor';

const $ = window.$;

export default class extends Component {

    state = {
        open:false
    }

    componentDidMount() {
        this.target = ReactDOM.findDOMNode(this);
        console.log('fdsaf',this.target);
    }

    componentWillUnmount() {
        window.document.removeEventListener('click',this.otherDOMClick);
    }

    otherDOMClick = (e) => {
        let node = e.target;
        let target = this.target;
        if (!this.state.open) {
            return false;
        }
        if (this.state.open && !contains(target, node)) {
            this.onClose();
        }
    }

    onClick = ()=>{
        this.setState({
            open:true
        });
        setTimeout(()=>{
            window.document.addEventListener('click',this.otherDOMClick);
        },100);
    }

    onClose() {
        this.setState({
            open:false
        });
        window.document.removeEventListener('click',this.otherDOMClick);

    }

    selectBackground(color) {
        return ()=>{
            this.onClose();
            if(getEditor()){
                getEditor().formatText(editor.range,'background',color,'user');
            }
        };
    }

    render() {
        return (
            <button className="weditor-hightlight">
                <Icon type="background" onClick={this.onClick}/>
                <div className="hightlight-color-panel" style={{display:this.state.open ? 'block' : 'none'}}>
                    {
                        ['yellow','green','cyan','magenta','white','darkGray','lightGray','black',
                            'blue','red','darkBlue','darkCyan','darkGreen','darkMagenta','darkRed'].map((item)=>{
                                return <span style={{background:item}} key={item} onClick={this.selectBackground(item)}></span>;
                            })
                    }
                </div>
            </button>
        );
    }
}
