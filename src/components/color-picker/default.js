/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/7
 */

'use strict';
import './index.scss';
import React, {Component, PropTypes} from 'react';

export default class extends Component {
    static defaultProps = {
        defaultColor: 'green',
        onClick: () => {}
    };
    static propTypes    = {
        defaultColor: PropTypes.string,
        color: PropTypes.string,
        onClick: PropTypes.func
    };

    _handleClick = (e) => {
        let {defaultColor, onClick} = this.props;
        onClick(defaultColor, e);
    };
    render () {
        let {color, defaultColor} = this.props;
        return (
            <div className="xm-color-picker-default">
                <div className="xm-color-picker-default-show"
                     style={{backgroundColor: color || defaultColor}}
                ></div>
                <div className="xm-color-picker-default-button"
                     onClick={this._handleClick}
                >默认颜色</div>
            </div>
        );
    }
}
