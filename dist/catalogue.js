/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';
import './style/catalogue.scss';
import React, {Component} from 'react';
import Icon from './components/icon/index';
import {observer,inject} from 'mobx-react';

@inject('catalogue') @observer
export default class CommonEditor extends Component {

    closeCatalogue = ()=>{
        this.props.catalogue.open = false;
    };

    render() {
        const {style, catalogue} = this.props;
        const {open} = catalogue;
        return (
            <div className="catalogue-container" style={{display:open ? 'block' : 'none'}}>
                <div className="catalogue-header">
                    <span>目录</span>
                    <Icon type="close" onClick={this.closeCatalogue}/>
                </div>
                <div className="catalogue-body">
                    {
                        this.props.catalogue.list.map((_,i)=>{
                            return <p key={i} className={`catalogue-h${_.h}`}>{_.content}</p>;
                        })
                    }
                </div>
            </div>
        );
    }
}
