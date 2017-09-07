/**
 * Created by yeanzhi on 17/2/28.
 */
'use strict';
import React,{Component} from 'react';
import {connect} from '@rab';

@connect(state=>({
    path:state.file.currentPath
}))
export default class Crumb extends Component {
    constructor() {
        super();
        // this.handleClick = this.handleClick.bind(this);
    }
    handleClick(path) {
        return ()=>{
            this.props.dispatch({type:'file.getList',payload:path});
        };
    }
    render() {
        let pathArr = /(\/person\/\d+)(.*)/.exec(this.props.path);
        if(!pathArr) {
            return <span></span>;
        }
        let childsPath = [];
        if(pathArr[2]) {
            childsPath = pathArr[2].split('/');
        }
        let basePath = pathArr[1];
        return(
            <div className="crumb-container">
                <span onClick={this.handleClick(basePath)}>根目录</span>
                {
                    childsPath.slice(1).map((_,i)=>{
                        basePath = `${basePath}/${_}`;
                        return <span key={i} onClick={this.handleClick(basePath)}>>{_}</span>;
                    })
                }
            </div>
        );
    }
}
