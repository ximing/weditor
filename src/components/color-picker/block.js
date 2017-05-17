/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/7
 */

'use strict';
import './index.scss';
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import Swatch from './swatch';

export default class extends Component {
    static defaultProps = {
        colors: [],
        onClick: (color, e) => {
        },
        onHover: (color, e) => {
        },
        title: '默认title',
        noWrap: true
    };
    static propTypes    = {
        colors: PropTypes.array,
        onClick: PropTypes.func,
        title: PropTypes.string,
        noWrap: PropTypes.bool
    };

    render () {
        let {colors, onClick, title, noWrap, onHover} = this.props;
        let body = colors.map((color, i) => {
            return <Swatch color={color} onClick={onClick} onHover={onHover} key={i}/>;
        });
        let xmColorPickerBlock = classnames({
            'xm-color-picker-block': true,
            noWrap: noWrap
        });
        return (
            <div className={xmColorPickerBlock}>
                <div className="xm-color-picker-block-title">
                    {title}
                </div>
                {body}
            </div>
        );
    }
}
