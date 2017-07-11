/**
 * Created by yeanzhi on 17/5/20.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {inject, observer} from 'mobx-react';
import {getCtrl} from './lib/util';
import SizeDropDown from './components/sizeDropDown/index';
import HeaderDropDown from './components/headerDropDown/index';
import ColorPicker from './components/color-picker';
import ToolTip from './components/tooltip';
import Icon from './components/icon';
import HightLight from './components/hightLight';
import classnames from 'classnames';
import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';

import {getEditor} from './lib/quillEditor';
import format from './model/format';
function preventDefault(e) {
    e.preventDefault();
}
const $ = window.jQuery;


@inject(state => ({
    rangeFormat: state.editor.format,
    editor: state.editor
})) @observer
export default class EditorToolbar extends Component {
    constructor() {
        super();
    }
    onWindowResize = ()=>{
        this.forceUpdate();
    };
    componentDidMount(){
        $(window).on('resize',this.onWindowResize)
    }
    componentWillUnmount(){
        $(window).off('resize',this.onWindowResize)
    }
    state = {moreBtnActive:false}

    getPopupContainer = (trigger) => {
        return ReactDOM.findDOMNode(this);
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
            if (this.hasMark(type)) {
                quillEditor.format(type, false, 'user');
            } else {
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
            console.log(this.hasBlock(type), this.props.editor.format[type], type)
            if (this.hasBlock(type)) {
                if (this.props.editor.format[type] === val) {
                    quillEditor.format(type, false, 'user');
                } else {
                    quillEditor.format(type, val, 'user');
                }
            } else {
                if (val) {
                    quillEditor.format(type, val, 'user');
                } else {
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

    formatPainter = () => {
        let {index, length} = getEditor().getSelection();
        if (index >= 0) {
            format.currentFormat = getEditor().getFormat(index, length);
        }
    }

    onPopupVisibleChange = (visible)=>{
        this.setState({
            moreBtnActive:visible
        })
    }

    renderLinkBtn = () => {
        const isActive = this.hasMark('link');
        const onMouseDown = e => {
            if (getEditor()) {
                let toolbar = getEditor().getModule('toolbar');
                toolbar.handlers['link'].call(toolbar, !this.props.editor.format['link']);
            }
        };
        const classname = classnames({
            button: true,
            active: isActive
        })
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type="link"/>
            </button>
        )
    }

    renderImageBtn = () => {
        const onMouseDown = e => {
            if (getEditor()) {
                let toolbar = getEditor().getModule('toolbar');
                toolbar.handlers['image'].call(toolbar, !this.props.editor.format['image']);
            }
        };
        const classname = classnames({
            button: true
        })
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type="image"/>
            </button>
        )
    };

    renderMore = ()=>{
        return(
            <span className="more-toolbar-container" onClick={preventDefault}>
                <div className="popup-triangle-wrapper">
                    <div className="popup-triangle-inner"></div>
                </div>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>有序列表 {getCtrl()}+Option+L</div>}
                    >
                    {this.renderBlockButton('list', 'ol', 'ordered')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>无序列表 {getCtrl()}+Option+U</div>}
                >
                    {this.renderBlockButton('list', 'ul', 'bullet')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>左对齐 {getCtrl()}+Shift+L</div>}
                >
                    {this.renderAlignButton('left', 'left-align')}
                </ToolTip>
                <Icon type="vertical"/>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>居中对齐 {getCtrl()}+Shift+E</div>}
                >
                    {this.renderAlignButton('center', 'center-align')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>右对齐 {getCtrl()}+Shift+R</div>}
                >
                    {this.renderAlignButton('right', 'right-align')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>两端对齐 {getCtrl()}+Shift+J</div>}
                >
                    {this.renderAlignButton('justify', 'justify-align')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>减少缩进</div>}
                >
                    {this.renderBlockButton('indent', 'left-indent', '-1')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>增加缩进</div>}
                >
                    {this.renderBlockButton('indent', 'right-indent', '+1')}
                </ToolTip>
                <Icon type="vertical"/>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>插入链接</div>}
                >
                    {this.renderLinkBtn()}
                </ToolTip>
                <ToolTip
                    placement="bottomRight"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>插入图片</div>}
                >
                    {this.renderImageBtn()}
                </ToolTip>
                </span>
        )
    };

    renderMoreBtn(){
        let btnClassName = classnames({
            'more-btn':true,
            'active':this.state.moreBtnActive
        })
        return (
            <Trigger
                popupClassName="popup-opver-wrapper"
                getPopupContainer={this.getPopupContainer}
                popupPlacement="bottomRight"
                builtinPlacements={{
                    bottomLeft: {
                        points: ['tl', 'bl'],
                    },
                    bottomRight: {
                        points: ['tr', 'br'],
                    },
                    bottom: {
                        points: ['tc', 'bc'],
                    },
                }}
                popupAlign={{
                    offset: [16, 12],
                    overflow: {
                        adjustX: 1,
                        adjustY: 1
                    }}}
                destroyPopupOnHide={false}
                zIndex={40}
                defaultPopupVisible={false}
                mask={false}
                action={['click']}
                popup={(this.renderMore())}
                popupTransitionName={''}
                onPopupVisibleChange={this.onPopupVisibleChange}
            >
                <button className={btnClassName} onClick={preventDefault}>更多 <Icon type="triangle"/></button>
            </Trigger>
//rc-trigger-popup-zoom
        )
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
                    placement="bottomLeft"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>撤销({getCtrl()}+Z)</div>}
                >
                    <button onClick={this.undo}>
                        <Icon type="undo"/>
                    </button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>重做({getCtrl()}+Y)</div>}
                >
                    <button onClick={this.redo}>
                        <Icon type="redo"/>
                    </button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>格式刷</div>}
                >
                    <button onClick={this.formatPainter}>
                        <Icon type="format"/>
                    </button>
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>清除格式 {getCtrl()}+Shift+C</div>}
                >
                    <button className="ql-clear-format" onClick={this.clearFormat}>
                        <Icon type="clear"/>
                    </button>
                </ToolTip>
                <Icon type="vertical"/>
                <HeaderDropDown val={header}/>
                <Icon type="vertical"/>
                <SizeDropDown size={size}/>
                <Icon type="vertical"/>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>加粗 {getCtrl()}+B</div>}
                >
                    {this.renderMarkButton('bold', 'bold')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>斜体 {getCtrl()}+I</div>}
                >
                    {this.renderMarkButton('italic', 'italic')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>删除线 {getCtrl()}+Shift+S</div>}
                >
                    {this.renderMarkButton('strike', 'strike')}
                </ToolTip>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>下划线 {getCtrl()}+U</div>}
                >
                    {this.renderMarkButton('underline', 'underline')}
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
                {
                    window.innerWidth<900?this.renderMoreBtn():this.renderMore()
                }
            </div>
        );

    }
}
