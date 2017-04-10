/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import React, {Component} from "react";
import SizeDropDown from "./components/sizeDropDown/index";
import HeaderDropDown from "./components/headerDropDown/index";
import ColorPicker from "./components/color-picker";
import {getEditor} from './lib/quillEditor';
import ToolTip from './components/tooltip';
import {inject,observer} from 'mobx-react';
import Icon from './components/icon';
import HightLight from './components/hightLight';

@inject(state=>({
    rangeFormat:state.editor.format
})) @observer
export default class StartHeader extends Component {
    //行高
    // quill.addStyles({
    //     'div': { 'line-height': '24px' }
    // });

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
    align = (align)=>{
        return ()=>{
            const quillEditor = getEditor();
            if(quillEditor){
                // const {index,length} = editor.range;
                // if(index===0 || !!index){
                //     quillEditor.formatLine(index,length,'align',align);
                // }
                quillEditor.format('align',align,'user')
            }
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
        // if(!!header){
        //     header = `h${header}`
        // }else{
        //     header = 'normal';
        // }
        return (
            <span className="ql-formats start-header" style={style}>
                <span className="ql-formats">
                    <HeaderDropDown val={header}/>
                </span>
                <span className="ql-formats">
                    <SizeDropDown size={size}/>
                </span>
                <span className="ql-formats">
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>加粗 ctrl+b</div>}
                    >
                        <button className="ql-bold"></button>
                </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>斜体 ctrl+i</div>}
                    >
                    <button className="ql-italic"></button>
                </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>删除线 ctrl+shift+s</div>}
                    >
                    <button className="ql-strike"></button>
                </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>下划线 ctrl+u</div>}
                    >
                    <button className="ql-underline"></button>
                </ToolTip>
                </span>
                <span className="ql-formats">
                     {/*<ToolTip*/}
                         {/*placement="bottom"*/}
                         {/*mouseEnterDelay={0}*/}
                         {/*mouseLeaveDelay={0}*/}
                         {/*overlay={<div>字体背景</div>}*/}
                     {/*>*/}
                         {/*<span></span>*/}
                     {/*</ToolTip>*/}
                    <HightLight />
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>字体颜色</div>}
                    >
                    <ColorPicker onChangeComplete={this.setColor} defaultColor={color} icon={(
                        <span className="ql-defalut-color">
                            <svg viewBox="0 0 18 18">
                                <line className="ql-color-label ql-stroke" x1="3" x2="15" y1="15" y2="15"
                                      style={{stroke: color}}></line>
                                <polyline className="ql-stroke" points="5.5 11 9 3 12.5 11"
                                          style={{stroke: color === '#FFFFFF' ? '#000000' : color}}></polyline>
                                <line className="ql-stroke" x1="11.63" x2="6.38" y1="9" y2="9"
                                      style={{stroke: color === '#FFFFFF' ? '#000000' : color}}></line>
                            </svg>
                        </span>
                    )}/>
                    </ToolTip>

                    
                </span>
                <span className="ql-formats">
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>有序列表 ctrl+Option+L</div>}
                    >
                        <button className="ql-list" value="ordered"></button>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>无序列表 ctrl+Option+U</div>}
                    >
                        <button className="ql-list" value="bullet"></button>
                    </ToolTip>
                </span>
                <span className="ql-formats">
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>左对齐 Ctrl+Shift+L</div>}
                    >
                        <Icon type="zuoduiqi" onClick={this.align('left')}/>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>居中对齐 Ctrl+Shift+E</div>}
                    >
                        <Icon type="juzhongduiqi" onClick={this.align('center')}/>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>右对齐 Ctrl+Shift+R</div>}
                    >
                        <Icon type="youduiqi" onClick={this.align('right')}/>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>两端对齐 Ctrl+Shift+J</div>}
                    >
                        <Icon type="liangduanduiqi" onClick={this.align('justify')} />
                    </ToolTip>

                    {/*<button className="ql-align"></button>*/}
                    {/*<button className="ql-align" value="center"></button>*/}
                    {/*<button className="ql-align" value="right"></button>*/}
                    {/*<button className="ql-align" value="justify"></button>*/}
                </span>
                <span className="ql-formats">
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>减少缩进</div>}
                    >
                        <button className="ql-indent" value="-1"></button>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>增加缩进</div>}
                    >
                        <button className="ql-indent" value="+1"></button>
                    </ToolTip>
                </span>
            </span>
        )
    }
}
