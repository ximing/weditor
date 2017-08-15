/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';
import {getEditor} from '../../lib/quillEditor';
import editor from '../../model/editor';

export default class HeaderDropDown extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
            value:'正文'
        };
    }

    componentDidMount() {
        $('#xm-size-h').on('click', '.o-p-h', this.changeSize);
    }

    componentWillUnmount() {
        $('#xm-size-h').off('click', '.o-p-h', this.changeSize);
    }

    componentWillReceiveProps(nextProps) {
        if (this.span) {
            let header = nextProps.val;
            if(!header) {
                this.setState({
                    value:'正文'
                });
            }else{
                this.setState({
                    value:`标题${header}`
                });
            }
        }
    }

    changeSize = (e) => {
        this.closePanel();
        if(getEditor()) {
            getEditor().formatLine(editor.range, 'header', e.target.getAttribute('data-size'),'user');
        }
    }


    closePanel = () => {
        this.setState({open: false});
        $(document).off('click', this.closePanel);
    }

    spanClick = (e) => {
        // e.stopPropagation();
        // e.nativeEvent.stopImmediatePropagation();
        this.setState({open: !this.state.open});
        if(!this.state.open) {
            setTimeout(()=>{
                $(document).on('click', this.closePanel);
            },10);
        }
    }

    render() {
        return(
            <div className="xm-header">
                <span
                    className="xm-header-span"
                    onClick={this.spanClick}
                    ref={(span) => this.span = span}>{this.state.value}</span>
                <i className="xm-icon docicon docicon-triangle" onClick={this.spanClick}></i>
                <div
                    className="xm-size-h"
                    id="xm-size-h"
                    style={{
                        display: this.state.open
                            ? 'block'
                            : 'none'
                    }} onClick={this.changeSize}>
                    <p data-size="" className="o-p-h">正文</p>
                    <h1 data-size="1" className="o-p-h">标题1</h1>
                    <h2 data-size="2" className="o-p-h">标题2</h2>
                    <h3 data-size="3" className="o-p-h">标题3</h3>
                    <h4 data-size="4" className="o-p-h">标题4</h4>
                    <h5 data-size="5" className="o-p-h">标题5</h5>
                    <h6 data-size="6" className="o-p-h">标题6</h6>
                </div>
            </div>
        );
    }
}
