/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';
import React, {Component} from "react";
import Icon from './components/icon/index';
import {getEditor} from './lib/quillEditor'

import {observer,inject} from 'mobx-react';
import {is} from './lib/util'
@inject('catalogue') @observer
export default class CommonEditor extends Component {

    toggleCatalogue = () => {
        if (getEditor()) {
            let ops = getEditor().getContents().ops;
            let _ops = [];
            ops = ops.forEach((item, i) => {
                if (ops[i + 1] && ops[i + 1].attributes && ops[i + 1].attributes.header && is('String',item.insert)) {
                    _ops.push({
                        h: ops[i + 1].attributes.header,
                        content: item.insert
                    })
                }
            });
            console.log(_ops)
            this.props.catalogue.open = true;
            this.props.catalogue.list = _ops;
        }
    }

    render() {
        const {style} = this.props;
        return (
            <span className="ql-formats view-header" style={style}>
                <span className="ql-catalogue opver-area" onClick={this.toggleCatalogue}>
                    <span className="opver-icon catalogue-icon"/>
                    <span>显示目录</span>
                </span>
            </span>
        )
    }
}
