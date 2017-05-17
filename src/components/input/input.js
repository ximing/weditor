/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React,{Component} from 'react';
import omit from 'omit.js';
import classnames from 'classnames';

export default class Input extends Component {

    render() {
        let props = omit(this.props,['style','className']);
        const {className,style} = this.props;
        const classname = classnames({
            [className]:true,
            'weditor-input':true
        });
        return(
            <input type="text" className={classname}  {...props} style={style}/>
        );
    }
}
