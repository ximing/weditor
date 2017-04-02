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
import editor from './model/editor';

@inject(state=>({
    rangeFormat:state.editor.range
})) @observer
export default class StartHeader extends Component {
    //行高
    // quill.addStyles({
    //     'div': { 'line-height': '24px' }
    // });

    setColor = (color) => {
        if (getEditor()) {
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
            console.log('align',align,quillEditor);

            if(quillEditor){
                // const {index,length} = editor.range;
                // if(index===0 || !!index){
                //     quillEditor.formatLine(index,length,'align',align);
                // }
                quillEditor.format('align',align)
            }
        }
    }
    render() {
        let {rangeFormat, style} = this.props;
        console.log(rangeFormat,'rangeFormat')
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
                     <ToolTip
                         placement="bottom"
                         mouseEnterDelay={0}
                         mouseLeaveDelay={0}
                         overlay={<div>字体背景</div>}
                     >
                        <ColorPicker onChangeComplete={this.setBackgroundColor} defaultColor={background} icon={(
                            <span className="ql-defalut-color">
                            <svg viewBox="0 0 18 18">
                            <g className="ql-fill ql-color-label" style={{fill: background}}>
                                <polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868"></polygon>
                                <rect height="1" width="1" x="4" y="4"></rect>
                                <polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5"></polygon>
                                <rect height="1" width="1" x="2" y="6"></rect>
                                <rect height="1" width="1" x="3" y="5"></rect>
                                <rect height="1" width="1" x="4" y="7"></rect>
                                <polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439"></polygon>
                                <rect height="1" width="1" x="2" y="12"></rect>
                                <rect height="1" width="1" x="2" y="9"></rect>
                                <rect height="1" width="1" x="2" y="15"></rect>
                                <polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10"></polygon>
                                <rect height="1" width="1" x="3" y="8"></rect>
                                <path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z"></path>
                                <path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z"></path>
                                <path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z"></path>
                                <rect height="1" width="1" x="12" y="2"></rect>
                                <rect height="1" width="1" x="11" y="3"></rect>
                                <path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z"></path>
                                <rect height="1" width="1" x="2" y="3"></rect>
                                <rect height="1" width="1" x="6" y="2"></rect>
                                <rect height="1" width="1" x="3" y="2"></rect>
                                <rect height="1" width="1" x="5" y="3"></rect>
                                <rect height="1" width="1" x="9" y="2"></rect>
                                <rect height="1" width="1" x="15" y="14"></rect>
                                <polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174"></polygon>
                                <rect height="1" width="1" x="13" y="7"></rect>
                                <rect height="1" width="1" x="15" y="5"></rect>
                                <rect height="1" width="1" x="14" y="6"></rect>
                                <rect height="1" width="1" x="15" y="8"></rect>
                                <rect height="1" width="1" x="14" y="9"></rect>
                                <path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z"></path>
                                <rect height="1" width="1" x="14" y="3"></rect>
                                <polygon points="12 6.868 12 6 11.62 6 12 6.868"></polygon>
                                <rect height="1" width="1" x="15" y="2"></rect>
                                <rect height="1" width="1" x="12" y="5"></rect>
                                <rect height="1" width="1" x="13" y="4"></rect>
                                <polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9"></polygon>
                                <rect height="1" width="1" x="9" y="14"></rect>
                                <rect height="1" width="1" x="8" y="15"></rect>
                                <path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z"></path>
                                <rect height="1" width="1" x="5" y="15"></rect>
                                <path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z"></path>
                                <rect height="1" width="1" x="11" y="15"></rect>
                                <path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z"></path>
                                <rect height="1" width="1" x="14" y="15"></rect>
                                <rect height="1" width="1" x="15" y="11"></rect>
                            </g>
                            <polyline className="ql-stroke" points="5.5 13 9 5 12.5 13"></polyline>
                            <line className="ql-stroke" x1="11.63" x2="6.38" y1="11" y2="11"></line>
                            </svg>
                        </span>
                        )}/>
                     </ToolTip>
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
                        overlay={<div>有序列表 ctrl+shift+l</div>}
                    >
                        <button className="ql-list" value="ordered"></button>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>无序列表 ctrl+shift+u</div>}
                    >
                        <button className="ql-list" value="bullet"></button>
                    </ToolTip>
                </span>
                <span className="ql-formats">
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>左对齐</div>}
                    >
                        <Icon type="zuoduiqi" onClick={this.align('left')}/>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>居中对齐</div>}
                    >
                        <Icon type="juzhongduiqi" onClick={this.align('center')}/>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>右对齐</div>}
                    >
                        <Icon type="youduiqi" onClick={this.align('right')}/>
                    </ToolTip>
                    <ToolTip
                        placement="bottom"
                        mouseEnterDelay={0}
                        mouseLeaveDelay={0}
                        overlay={<div>两端对齐</div>}
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
