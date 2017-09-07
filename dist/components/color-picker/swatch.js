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
        color: 'red',
        onClick: (color, e) => {
        },
        onHover: (color, e) => {
        }
    };
    static propTypes    = {
        color: PropTypes.string,
        onClick: PropTypes.func
    };

    _handleClick = (e) => {
        let {color, onClick} = this.props;
        onClick(color, e);
    };

    _handlehover = (e) => {
        let {color, onHover} = this.props;
        onHover(color, e);
    };

    render () {
        let {color} = this.props;
        return (
            <div className="xm-color-picker-swatch"
                onClick={this._handleClick}
                onMouseEnter={this._handlehover}
                style={{backgroundColor: color}}
            >
            </div>
        );
    }
}
