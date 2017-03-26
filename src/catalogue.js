/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';
import './catalogue.scss';
import React, {Component} from "react";
import Icon from './components/icon/index';


export default class CommonEditor extends Component {

    renderCalogue(){
        //let {list} = this.props.catalogue;
        return [].map((_,i)=>{
            return <p key={i} className={`catalogue-h${_.h}`}>{_.content}</p>
        })
    }
    render() {
        const {style,catalogue} = this.props;
        return (
            <div className="catalogue-container" style={style}>
                <div className="catalogue-header">
                    <span>目录</span>
                    <Icon type="close" />
                </div>
                <div className="catalogue-body">
                    {this.renderCalogue()}
                </div>
            </div>
        )
    }
}
