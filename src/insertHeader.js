/**
 * Created by yeanzhi on 17/3/19.
 */
'use strict';
import React, {Component} from "react";
import Icon from './components/icon/index';

export default class CommonEditor extends Component {

    render() {
        const {rangeFormat,style} = this.props;
        return (
            <span className="ql-formats insert-header" style={style}>
                <button className="ql-fengexian">
                    <Icon type="fengexian"/>
                </button>
                <button className="ql-link">
                </button>
                <button className="ql-image">
                </button>
            </span>
        )
    }
}
