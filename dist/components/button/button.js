/**
 * Created by yeanzhi on 17/2/16.
 */
'use strict';

import React, {Component} from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
export default class extends Component {

    constructor() {
        super();

        this.state = {
            processing: false
        };

        this.onClick = this.onClick.bind(this);
    }

    static defaultProps = {
        prefixCls: 'nx-btn',
        color:'blue',
        type:'',
        onClick: function() {},
        disabled: false
    };

    // 重置,回到初始状态
    reset() {
        this.setState({processing: false});
    }

    onClick(SyntheticEvent) {
        var {disabled, onClick, async} = this.props;
        if(disabled) {
            return;
        }

        if(async) {
            if(!this.state.processing) {
                this.setState({processing: true});
            } else {
                return;
            }
        }
        onClick(SyntheticEvent,this);

    }
    render() {
        var {prefixCls,color,type} = this.props;
        let otherProps = omit(this.props,['prefixCls','color','type','children']);
        let classes = classNames({
            [prefixCls]: true,
            [`${prefixCls}-${color}`]: color
            //[`${prefixCls}-${type}`]: type,
            //[`${prefixCls}-disabled`]: disabled,
            //[`${prefixCls}-${sizeCls}`]: sizeCls,
            //[`${prefixCls}-mix-icon`]: kids && (!loading && icon),
            //[`${prefixCls}-icon-only`]: !kids && icon,
            //[`${prefixCls}-icon-right`]: kids && (loading || icon) && iconRight,
            //[`${prefixCls}-loading`]: loading,
        });
        return <input type="button"
                      value={this.props.children}
                      onClick={this.onClick}
                      className={classes}
                      {...otherProps}
        />;
    }
}

