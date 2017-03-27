/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import React, {Component} from "react";
import Icon from './components/icon/index';
import {inject, observer} from 'mobx-react';
import {getEditor, getEditorBoundingClientRect} from './lib/quillEditor';

// @inject('insert') @observer
export default class CommonEditor extends Component {

    openLinkDialog = () => {

    };

    openImageDialog = () => {
        let {openImageDialog} = this.props.insert;
        if (openImageDialog) {
            openImageDialog = false;
        } else {
            openImageDialog = true;
        }
    };


    render() {
        const {rangeFormat, style} = this.props;
        return (
            <span className="ql-formats insert-header" style={style}>
                {/*<button className="ql-fengexian">*/}
                {/*<Icon type="fengexian"/>*/}
                {/*</button>*/}
                <button className="ql-link">
                </button>
                <button className="ql-image" onClick={this.openImageDialog}>
                </button>
            </span>
        )
    }
}
