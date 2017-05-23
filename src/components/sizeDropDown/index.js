/**
 * Created by yeanzhi on 17/3/16.
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';


const $ = window.jQuery;
let fontSizeMap = {
    '': '小四',
    '42pt': '初号',
    '36pt': '小初',
    '26pt': '一号',
    '24pt': '小一',
    '22pt': '二号',
    '18pt': '小二',
    '15pt': '三号',
    '14.5pt': '小三',
    '14pt': '四号',
    '12pt': '小四',
    '10.5pt': '五号',
    '9pt': '小五',
    '7.5pt': '六号',
    '6.5pt': '小六',
    '5.5pt': '七号',
    '5pt': '八号'
};
function changeSize(e) {

}
export default class SizeDropDown extends Component {

    constructor() {
        super();
        this.state = {
            value: 12,
            open: false
        };
    }
    componentDidMount() {
        $('#xm-size-p').on('click', 'p', changeSize);
        this.setState({
            value: this.props.size,
            open: false
        });

    }

    componentWillUnmount() {
        $('#xm-size-p').off('click', 'p', changeSize);
    }

    formatSize = (size) => {
        size = Number.parseFloat(size, 10);
        if (isNaN(size)) {
            return '12pt';
        } else if (size > 72) {
            return '72pt';
        } else if (size < 5) {
            return '5pt';
        } else {
            return `${size}pt`;
        }

    }
    componentWillReceiveProps(nextProps) {
        if (this.input) {
            let val = this.formatSize(nextProps.size);
            this.input.value = fontSizeMap[val] || val;
        }
    }
    changeSize = (value) => {
        this.setState({value: value});
    }
    closePanel = () => {
        this.setState({open: false});
        $(document).off('click', this.closePanel);
    }
    inputClick = (e) => {
        e.stopPropagation();
        e
            .nativeEvent
            .stopImmediatePropagation();
        $(document).on('click', this.closePanel);
        this.setState({open: true});
    }
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.closePanel();
            if (getEditor()) {
                getEditor().format('size', this.formatSize(this.input.value), 'user');
            }
        }
    }
    //                       {/*onChange={this.changeSize}*/}

    render() {
        return (
            <div className="xm-size">
                <input
                    className="xm-size-input"
                    onClick={this.inputClick}
                    onKeyPress={this.handleKeyPress}
                    ref={(input) => this.input = input}
                    type="text"/>
                <div className="xm-size-button-dropdown"></div>
                <div
                    className="xm-size-p"
                    id="xm-size-p"
                    style={{
                        display: this.state.open
                        ? 'block'
                        : 'none'
                    }}>
                    <p data-size="42pt">初号</p>
                    <p data-size="36pt">小初</p>
                    <p data-size="26pt">一号</p>
                    <p data-size="24pt">小一</p>
                    <p data-size="22pt">二号</p>
                    <p data-size="18pt">小二</p>
                    <p data-size="15pt">三号</p>
                    <p data-size="14.5pt">小三</p>
                    <p data-size="14pt">四号</p>
                    <p data-size="12pt">小四</p>
                    <p data-size="10.5pt">五号</p>
                    <p data-size="9pt">小五</p>
                    <p data-size="7.5pt">六号</p>
                    <p data-size="6.5pt">小六</p>
                    <p data-size="5.5pt">七号</p>
                    <p data-size="5pt">八号</p>
                    <p data-size="5pt">5</p>
                    <p data-size="5.5pt">5.5</p>
                    <p data-size="6.5pt">6.5</p>
                    <p data-size="7.5pt">7.5</p>
                    <p data-size="8pt">8</p>
                    <p data-size="9pt">9</p>
                    <p data-size="10pt">10</p>
                    <p data-size="10.5pt">10.5</p>
                    <p data-size="11pt">11</p>
                    <p data-size="12pt">12</p>
                    <p data-size="14pt">14</p>
                    <p data-size="16pt">16</p>
                    <p data-size="18pt">18</p>
                    <p data-size="20pt">20</p>
                    <p data-size="22pt">22</p>
                    <p data-size="24pt">24</p>
                    <p data-size="26pt">26</p>
                    <p data-size="28pt">28</p>
                    <p data-size="36pt">36</p>
                    <p data-size="48pt">48</p>
                    <p data-size="72pt">72</p>
                </div>
            </div>
        );
    }
}
