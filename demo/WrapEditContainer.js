/**
 * Created by yeanzhi on 17/4/10.
 */
'use strict';
import React, {Component} from 'react';

export default class WrapEditContainer extends Component {
    render() {
        return(
            <div>
                {this.props.children}
            </div>
        );
    }
}
