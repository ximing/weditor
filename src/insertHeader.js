/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import React, {Component} from "react";
import Icon from './components/icon/index';
import {inject, observer} from 'mobx-react';
import {getEditor, getEditorBoundingClientRect} from './lib/quillEditor';
import ToolTip from './components/tooltip'

// @inject('insert') @observer
export default class CommonEditor extends Component {

    render() {
        const {style} = this.props;
        return (
            <span className="ql-formats insert-header" style={style}>
                {/*<button className="ql-fengexian">*/}
                {/*<Icon type="fengexian"/>*/}
                {/*</button>*/}
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>插入链接</div>}
                >
                    <button className="ql-link"></button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>插入图片</div>}
                >
                    <button className="ql-image"></button>
                </ToolTip>

            </span>
        )
    }
}
