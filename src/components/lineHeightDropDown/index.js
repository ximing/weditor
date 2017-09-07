/**
 * Created by yeanzhi on 17/3/16.
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';
import {getEditor} from '../../lib/quillEditor';
import Icon from '../icon';
const $ = window.jQuery;
export default class SizeDropDown extends Component {

    constructor() {
        super();
        this.state = {
            open: false
        };
    }

    componentDidMount() {
        this.setState({
            open: false
        });

    }

    componentWillUnmount() {
    }


    componentWillReceiveProps(nextProps) {
        // if (this.input) {
        //     let val = this.formatSize(nextProps.size);
        //     this.input.value = fontSizeMap[val] || val;
        // }
    }

    changeLineHeight = (value) => {
        if (getEditor()) {
            getEditor().format('lineHeight', value, 'user');
        }
    }

    closePanel = () => {
        this.setState({open: false});
        $(document).off('click', this.closePanel);
    }

    inputClick = (e) => {
        // e.stopPropagation();
        // e
        //     .nativeEvent
        //     .stopImmediatePropagation();
        console.log('size this.state.open', this.state.open);
        this.setState({open: !this.state.open});
        if (!this.state.open) {
            setTimeout(() => {
                $(document).on('click', this.closePanel);
            }, 10);
        }
    }

    handleKeyPress = (e) => {
        this.changeLineHeight(e.target.getAttribute('data-size') || '1');
        this.closePanel();
        $(document).off('click', this.closePanel);

    }

    render() {
        return (
            <div className="xm-lineheight">
                <Icon type="lineheight" onClick={this.inputClick}/>
                <div
                    className="xm-size-p"
                    id="xm-size-p"
                    style={{
                        display: this.state.open
                            ? 'block'
                            : 'none'
                    }} onClick={this.handleKeyPress}>
                    <p data-size="1">1</p>
                    <p data-size="1.15">1.15</p>
                    <p data-size="1.35">1.35</p>
                    <p data-size="1.5">1.5</p>
                    <p data-size="2">2</p>
                    <p data-size="2.5">2.5</p>
                    <p data-size="3">3</p>
                </div>
            </div>
        );
    }
}
