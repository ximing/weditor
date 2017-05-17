/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/7
 */

'use strict';
import './index.scss';
import React, {Component, PropTypes} from 'react';
import Block from './block';
import Default from './default';
import classnames from 'classnames';
import {inArea, getFromLocalStorage, setIntoLocalStorage, updateDefaultColors} from './tools';
import {COLORS} from './static';
export default class extends Component {
    state               = {
        color: '#000000',
        isHide: true,
        recentlyUsedColors: ['#000000'],
        id: `colorPicker${Math.floor(Math.random() * 10000).toString(16)}`
    };
    static defaultProps = {
        onChangeComplete: (color, e) => {
        },
        onChange: (color, e) => {},
        defaultColor: '#00b050',
        icon: 'picker icon',
        width: '193px'
    };
    static propTypes    = {
        onChangeComplete: PropTypes.func,
        onChange: PropTypes.func,
        defaultColor: PropTypes.string,
        width: PropTypes.string
    };

    componentDidMount() {
        document.addEventListener('click', this._handleAreaClick, false);
        if(getFromLocalStorage('_xmColorPickerDefaultColors').length > 0) {
            this.setState({
                recentlyUsedColors: getFromLocalStorage('_xmColorPickerDefaultColors')
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._handleAreaClick, false);
        setIntoLocalStorage('_xmColorPickerDefaultColors', this.state.recentlyUsedColors);
    }

    _handleClick = (color, e) => {
        let recentlyUsedColors = updateDefaultColors(color, this.state.recentlyUsedColors);
        this.setState({
            color: color,
            isHide: true,
            recentlyUsedColors: recentlyUsedColors
        });
        this.props.onChangeComplete(color, e);
        setIntoLocalStorage('_xmColorPickerDefaultColors', recentlyUsedColors);
    };
    _handleHover = (color, e) => {
        this.setState({
            color: color
        });
        this.props.onChange(color, e);
    };
    _handleIconClick = () => {
        this.setState({
            isHide: !this.state.isHide,
            color: this.props.defaultColor
        });
        document.addEventListener('click', this._handleAreaClick, false);
    };
    _handleAreaClick = (e) => {
        let x = e.clientX;
        let y = e.clientY;
        if(!inArea(x, y, `#${this.state.id} .xm-color-picker`) && !inArea(x, y, `#${this.state.id} .xm-color-picker-icon`)) {
            this.setState({
                isHide: true
            });
            document.removeEventListener('click', this._handleAreaClick, false);
        }
    };
    render () {
        let {isHide, recentlyUsedColors, color} = this.state;
        let {icon, defaultColor, width} = this.props;
        let xmColorPicker = classnames({
            'xm-color-picker': true,
            isHide: isHide
        });
        return (
            <div className="xm-color-picker-container" id={this.state.id}>
                <span className="xm-color-picker-icon"
                    onClick={this._handleIconClick}
                >
                    {icon}
                </span>
                <div className={xmColorPicker} style={{width: width}}>
                    <Default onClick={this._handleClick} recentlyUsedColors={defaultColor} color={color}/>
                    <Block onClick={this._handleClick} onHover={this._handleHover} title="最近使用" colors={recentlyUsedColors}/>
                    <Block onClick={this._handleClick} onHover={this._handleHover} title="主题颜色" colors={COLORS.THEME} noWrap={false} />
                    <Block onClick={this._handleClick} onHover={this._handleHover} title="标准颜色" colors={COLORS.STANDARD}/>
                </div>
            </div>
        );
    }
}
