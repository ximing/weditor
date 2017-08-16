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
import LineHeightDropDown from './components/lineHeightDropDown';
import classnames from 'classnames';
import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';
import Quill from 'quill';
import Delta from 'quill-delta';
import DeltaOp from 'quill-delta/lib/op';

const CodeBlock = Quill.import('formats/code');
const Block = Quill.import('blots/block');

import {getEditor} from './lib/quillEditor';
import format from './model/format';

function preventDefault(e) {
    e.preventDefault();
}

const $ = window.jQuery;

function shiftRange(range, index, length, source) {
    if (range == null) return null;
    let start, end;
    if (index instanceof Delta) {
        [start, end] = [range.index, range.index + range.length].map(function (pos) {
            return index.transformPosition(pos, source !== 'user');
        });
    } else {
        [start, end] = [range.index, range.index + range.length].map(function (pos) {
            if (pos < index || (pos === index && source === 'user')) return pos;
            if (length >= 0) {
                return pos + length;
            } else {
                return Math.max(index, pos + length);
            }
        });
    }
    return new Range(start, end - start);
}

@inject(state => ({
    rangeFormat: state.editor.format,
    editor: state.editor
})) @observer
export default class EditorToolbar extends Component {
    constructor() {
        super();
    }

    onWindowResize = () => {
        this.forceUpdate();
    };

    componentDidMount() {
        $(window).on('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        $(window).off('resize', this.onWindowResize);
    }

    state = {moreBtnActive: false}

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
        );
    }

    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */

    hasMark = (type) => {
        return this.props.editor.format[type];
    }

    /**
     * Check if the any of the currently selected blocks are of `type`.
     *
     * @param {String} type
     * @param {String} val
     * @return {Boolean}
     */

    hasBlock = (type, val) => {
        if (val) {
            return this.props.editor.format[type] === val;
        } else {
            return this.props.editor.format[type];
        }
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
        });
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type={icon}/>
            </button>
        );
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
        const isActive = this.hasBlock(type, val);
        const onMouseDown = e => this.onClickBlock(e, type, val);
        const classname = classnames({
            button: true,
            active: isActive
        });
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type={icon}/>
            </button>
        );
    }

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} e
     * @param {String} type
     */

    onClickMark = (e, type) => {
        e.preventDefault();
        const quillEditor = getEditor();
        console.log('mark click', quillEditor, type);
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
            console.log(this.hasBlock(type), this.props.editor.format[type], type);
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
            let {index, length} = getEditor().getSelection();
            //重写 removeformat ，标注格式不能被清除
            if (index === 0 || !!index) {
                // getEditor().removeFormat(index, length, 'user');

                let range = getEditor().getSelection();
                let oldDelta = getEditor().editor.delta;

                let text = getEditor().getText(index, length);
                let [line, offset] = getEditor().scroll.line(index + length);
                let suffixLength = 0, suffix = new Delta();
                if (line != null) {
                    if (!(line instanceof CodeBlock)) {
                        suffixLength = line.length() - offset;
                    } else {
                        suffixLength = line.newlineIndex(offset) - offset + 1;
                    }
                    suffix = line.delta().slice(offset, offset + suffixLength - 1).insert('\n');
                }
                let contents = getEditor().getContents(index, length + suffixLength);
                let diff = contents.diff(new Delta().insert(text).concat(suffix));
                let delta = new Delta().retain(index).concat(diff);

                delta.ops = delta.ops.map(item => {
                    if (item.attributes && item.attributes['comments'] == null) {
                        delete item.attributes['comments'];
                    }
                    console.log('delta.ops.map', item);
                    return item;
                });

                console.log(delta);

                let change = getEditor().editor.applyDelta(delta);

                if (range != null) {
                    if (index === true) index = range.index;
                    range = shiftRange(range, change, 'user');
                    getEditor().setSelection(range, 'silent');
                }
                if (change.length() > 0) {
                    let args = ['text-change', change, oldDelta, 'user'];
                    getEditor().emitter.emit('editor-change', ...args);
                    getEditor().emitter.emit(...args);
                }
                return change;
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

    onPopupVisibleChange = (visible) => {
        this.setState({
            moreBtnActive: visible
        });
    };

    // renderTodoBtn = () => {
    //     const isActive = this.hasMark('checked');
    //     const onMouseDown = e => {
    //         if (getEditor()) {
    //             const {index, length} = this.props.editor.range;
    //             //unchecked
    //             if(isActive){
    //
    //             }else{
    //                 getEditor().formatLine(index, length, 'list', 'checked');
    //             }
    //         }
    //     };
    //     const classname = classnames({
    //         button: true,
    //         active: isActive
    //     });
    //     return (
    //         <button className={classname} onMouseDown={onMouseDown}>
    //             <Icon type="link"/>
    //         </button>
    //     )
    // };

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
        });
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type="link"/>
            </button>
        );
    };

    renderImageBtn = () => {
        const onMouseDown = e => {
            if (getEditor()) {
                let toolbar = getEditor().getModule('toolbar');
                toolbar.handlers['image'].call(toolbar, !this.props.editor.format['image']);
            }
            $(document).trigger('click');
        };
        const classname = classnames({
            button: true
        });
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type="image"/>
            </button>
        );
    };

    renderMore = () => {
        let {lineheight} = this.props.rangeFormat;
        return (
            <span className="more-toolbar-container"
                  onClick={preventDefault}>
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
                <Icon type="vertical"/>
                <ToolTip
                    placement="bottom"
                    mouseEnterDelay={0}
                    mouseLeaveDelay={0}
                    overlay={<div>左对齐 {getCtrl()}+Shift+L</div>}
                >
                    {this.renderAlignButton('left', 'left-align')}
                </ToolTip>
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
                    overlay={<div>插入TODO</div>}
                >
                    {this.renderBlockButton('list', 'todo', 'checked')}
                </ToolTip>
                <LineHeightDropDown lineheight={lineheight}/>
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
                {this.props.toolbar}
            </span>
        );
    };

    renderMoreBtn() {
        let btnClassName = classnames({
            'more-btn': true,
            'active': this.state.moreBtnActive
        });
        return (
            <Trigger
                style={{zIndex: 400000}}
                popupClassName="popup-opver-wrapper more-popup-opver-wrapper"
                getPopupContainer={this.getPopupContainer}
                popupPlacement="bottomRight"
                builtinPlacements={{
                    bottomLeft: {
                        points: ['tl', 'bl']
                    },
                    bottomRight: {
                        points: ['tr', 'br']
                    },
                    bottom: {
                        points: ['tc', 'bc']
                    }
                }}
                popupAlign={{
                    offset: [16, 12],
                    overflow: {
                        adjustX: 1,
                        adjustY: 1
                    }
                }}
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
        );
    }

    render() {
        let {rangeFormat, style} = this.props;
        let {color, background, size, header} = rangeFormat;
        if (Array.isArray(color)) {
            color = '#FFFFFF';
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
                <HightLight/>
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
                    window.innerWidth < 900 ? this.renderMoreBtn() : this.renderMore()
                }
            </div>
        );

    }
}
