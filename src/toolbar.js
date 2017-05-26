/**
 * Created by yeanzhi on 17/5/20.
 */
'use strict';
import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import SizeDropDown from './components/sizeDropDown/index';
import HeaderDropDown from './components/headerDropDown/index';
import ColorPicker from './components/color-picker';
import ToolTip from './components/tooltip';
import Icon from './components/icon';
import HightLight from './components/hightLight';
import classnames from 'classnames';

import {getEditor} from './lib/quillEditor';

@inject(state => ({
    rangeFormat: state.editor.format,
    editor: state.editor
})) @observer
export default class EditorToolbar extends Component {
    constructor() {
        super();
    }

    setColor = (color) => {
        if (getEditor()) {
            getEditor().focus();
            getEditor().format('color', color, 'user');
        }
    }

    setBackgroundColor = (color) => {
        if (getEditor()) {
            getEditor().format('background', color, 'user');
        }
    }

    align = (e, align) => {
        const quillEditor = getEditor();
        if (quillEditor) {
            quillEditor.format('align', align, 'user');
        }
    }

    renderAlignButton = (type, icon) => {
        const onMouseDown = e => this.align(e, type);

        const classname = classnames({
            button: true
        });

        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type={icon}/>
            </button>
        )
    }

    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasMark = (type) => {
        return this.props.editor.format[type]
    }

    /**
     * Check if the any of the currently selected blocks are of `type`.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasBlock = (type) => {
        return this.props.editor.format[type]
    }


    /**
     * Render a mark-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @return {Element}
     */

    renderMarkButton = (type, icon) => {
        const isActive = this.hasMark(type);
        const onMouseDown = e => this.onClickMark(e, type);
        const classname = classnames({
            button: true,
            active: isActive
        })
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type={icon}/>
            </button>
        )
    }

    /**
     * Render a block-toggling toolbar button.
     *
     * @param {String} type
     * @param {String} icon
     * @param {String} val
     * @return {Element}
     */

    renderBlockButton = (type, icon, val) => {
        const isActive = this.hasBlock(type)
        const onMouseDown = e => this.onClickBlock(e, type, val);
        const classname = classnames({
            button: true,
            active: isActive
        })
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type={icon}/>
            </button>
        )
    }

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} e
     * @param {String} type
     */

    onClickMark = (e, type) => {
        e.preventDefault()
        const quillEditor = getEditor();
        if (quillEditor) {
            if(this.hasMark(type)){
                quillEditor.format(type, false, 'user');
            }else{
                quillEditor.format(type, true, 'user');
            }
        }
    }

    /**
     * When a block button is clicked, toggle the block type.
     *
     * @param {Event} e
     * @param {String} type
     * @param {String} val
     */

    onClickBlock = (e, type, val) => {
        e.preventDefault();
        const quillEditor = getEditor();
        if (quillEditor) {
            console.log(this.hasBlock(type),this.props.editor.format[type],type)
            if(this.hasBlock(type)){
                if(this.props.editor.format[type] === val){
                    quillEditor.format(type, false, 'user');
                }else{
                    quillEditor.format(type, val, 'user');
                }
            }else{
                if(val){
                    quillEditor.format(type, val, 'user');
                }else{
                    quillEditor.format(type, true, 'user');
                }
            }

        }
    }


    clearFormat = () => {
        if (getEditor()) {
            const {index, length} = getEditor().getSelection();
            if (index === 0 || !!index) {
                getEditor().removeFormat(index, length, 'user');
            }
        }
    };

    undo = () => {
        if (getEditor()) {
            getEditor().history.undo();
        }
    };

    redo = () => {
        if (getEditor()) {
            getEditor().history.redo();
        }
    };

    format = () => {
        let {index, length} = getEditor().getSelection();
        if (!!index) {
            format.currentFormat = getEditor().getFormat(index, length);
        }
    }

    render() {
        let {rangeFormat, style} = this.props;
        let {color, background, size, header} = rangeFormat;
        if (Array.isArray(color)) {
            color = '#FFFFFF';
        }
        if (Array.isArray(background)) {
            background = '#FFFFFF';
        }
        return (
            <div className="toolbar-opver" id="toolbarOpver">
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>撤销(ctrl+Z)</div>}
                >
                    <button className="ql-undo" onClick={this.undo}>
                        <Icon type="undo"/>
                    </button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>重做(ctrl+Y)</div>}
                >
                    <button className="ql-redo" onClick={this.redo}>
                        <Icon type="redo"/>
                    </button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>格式刷</div>}
                >
                    <button className="ql-format" onClick={this.format}>
                        <Icon type="format"/>
                    </button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>清除格式 Ctrl+Shift+C</div>}
                >
                    <button className="ql-clear-format" onClick={this.clearFormat}>
                        <Icon type="clear"/>
                    </button>
                </ToolTip>
                <Icon type="vertical"/>
                <HeaderDropDown val={header}/>
                <SizeDropDown size={size}/>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>加粗 ctrl+b</div>}
                >
                    {this.renderMarkButton('bold', 'bold')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>斜体 ctrl+i</div>}
                >
                    {this.renderMarkButton('italic', 'italic')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>删除线 ctrl+shift+s</div>}
                >
                    {this.renderMarkButton('strike', 'strike')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>下划线 ctrl+u</div>}
                >
                    {this.renderMarkButton('underlined', 'underline')}
                </ToolTip>
                <HightLight />
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>字体颜色</div>}
                >
                    <ColorPicker onChangeComplete={this.setColor} defaultColor={color} icon={(
                        <Icon type="color"/>
                    )}/>
                </ToolTip>
                <Icon type="vertical"/>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>有序列表 ctrl+Option+L</div>}
                >
                    {this.renderBlockButton('list', 'ol','ordered')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>无序列表 ctrl+Option+U</div>}
                >
                    {this.renderBlockButton('list', 'ul','bullet')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>左对齐 Ctrl+Shift+L</div>}
                >
                    {this.renderAlignButton('left', 'left-align')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>居中对齐 Ctrl+Shift+E</div>}
                >
                    {this.renderAlignButton('center', 'center-align')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>右对齐 Ctrl+Shift+R</div>}
                >
                    {this.renderAlignButton('right', 'right-align')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>两端对齐 Ctrl+Shift+J</div>}
                >
                    {this.renderAlignButton('justify', 'justify-align')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>减少缩进</div>}
                >
                    <button className="ql-indent" value="-1">
                        <Icon type="left-indent"/>
                    </button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>增加缩进</div>}
                >
                    <button className="ql-indent" value="+1">
                        <Icon type="right-indent"/>
                    </button>
                </ToolTip>
                <Icon type="vertical"/>
            </div>
        );

    }
}
