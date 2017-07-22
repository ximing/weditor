/**
 * Created by yeanzhi on 17/7/20.
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import {getEditor} from '../../lib/quillEditor'
import editor from '../../model/editor';
import Icon from '../icon';
const $ = window.$;
const bubbleToolbarWidth = 206;
export default class BubbleToolbar extends Component {

    constructor() {
        super();
        this.onSelectionChangeDebounce = debounce(this.onSelectionChange, 150)
    }

    state = {
        show: true,
        bubbleStyle: {
            left: 0,
            top: 0,
            marginTop: 0,
            display: 'block'
        },
        arrowStyle: {
            marginLeft: 0
        },
        bubbleOpacity: false
    };

    componentDidMount() {
        if (getEditor()) {
            getEditor().on('editor-change', this.onSelectionChangeDebounce);
            getEditor().on('text-change', this.onTextChange);
        }
        this.$editor = $('.ql-editor');
    }

    componentWillUnmount() {
        getEditor().off('editor-change', this.onSelectionChangeDebounce);
        getEditor().off('text-change', this.onTextChange);
        this.clearTransition();
    }

    onTextChange = () => {
        if (this.state.bubbleStyle.display !== 'none') {
            this.setState({
                bubbleStyle: Object.assign({},
                    this.state.bubbleStyle, {
                        display: 'none'
                    })
            });
        }
    };

    onSelectionChange = (eventName, ...args) => {
        if (eventName === 'selection-change') {
            let [range] = args;
            if (!!getEditor() && !!range && !!range.length &&
                !!getEditor().getText(range.index, range.length).trim()) {
                let {left, top, height, width, right} = getEditor().getBounds(range.index + Math.floor(range.length / 2));
                let bubbleLeft = Math.max(0, left - bubbleToolbarWidth/ 2),
                    marginLeft = 0;
                if (bubbleLeft === 0) {
                    marginLeft = -(bubbleToolbarWidth / 2 - left + width);
                } else {
                    let maxLeft = this.$editor[0].getBoundingClientRect().width - bubbleToolbarWidth;
                    if (bubbleLeft > maxLeft) {
                        bubbleLeft = maxLeft;
                        marginLeft = left - maxLeft - bubbleToolbarWidth / 2;
                    }
                }
                this.setState({
                    show: true,
                    bubbleStyle: {
                        left: bubbleLeft,
                        top,
                        marginTop: -(height + 20),
                        display: 'block',
                    },
                    arrowStyle: {
                        marginLeft
                    },
                    bubbleOpacity: true
                });
                //this.transition();
            } else {
                this.setState({
                    bubbleStyle: Object.assign({},
                        this.state.bubbleStyle, {
                            display: 'none'
                        })
                });
                this.clearTransition();
            }
        }
    };

    clearTransition = () => {
        clearTimeout(this.timer);
        clearTimeout(this.bubbleOpacityTimer);
    };

    transition = () => {
        this.clearTransition();
        this.timer = setTimeout(() => {
            this.setState({
                bubbleStyle: Object.assign({},
                    this.state.bubbleStyle, {
                        display: 'none'
                    })
            });
        }, 4100);
        this.bubbleOpacityTimer = setTimeout(() => {
            this.setState({
                bubbleOpacity: false
            });
        }, 1000);
    };

    hasMark = (type) => {
        return editor.format[type]
    };

    hasBlock = (type, val) => {
        if (val) {
            return editor.format[type] === val;
        } else {
            return editor.format[type]
        }
    };

    renderMarkButton = (type, icon) => {
        const isActive = this.hasMark(type);
        const onMouseDown = e => this.onClickMark(e, type);
        const classname = classnames({
            button: true,
            active: isActive
        })
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type={icon}/>
            </button>
        )
    };

    renderBlockButton = (type, icon, val) => {
        const isActive = this.hasBlock(type, val)
        const onMouseDown = e => this.onClickBlock(e, type, val);
        const classname = classnames({
            button: true,
            active: isActive
        })
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type={icon}/>
            </button>
        )
    };

    onClickMark = (e, type) => {
        e.preventDefault();
        const quillEditor = getEditor();
        if (quillEditor) {
            if (this.hasMark(type)) {
                quillEditor.format(type, false, 'user');
            } else {
                quillEditor.format(type, true, 'user');
            }
        }
    };

    onClickBlock = (e, type, val) => {
        e.preventDefault();
        const quillEditor = getEditor();
        if (quillEditor) {
            if (this.hasBlock(type)) {
                if (editor.format[type] === val) {
                    quillEditor.format(type, false, 'user');
                } else {
                    quillEditor.format(type, val, 'user');
                }
            } else {
                if (val) {
                    quillEditor.format(type, val, 'user');
                } else {
                    quillEditor.format(type, true, 'user');
                }
            }

        }
    };

    renderLinkBtn = () => {
        const isActive = this.hasMark('link');
        const onMouseDown = e => {
            if (getEditor()) {
                let toolbar = getEditor().getModule('toolbar');
                toolbar.handlers['link'].call(toolbar, !editor.format['link']);
            }
        };
        const classname = classnames({
            button: true,
            active: isActive
        });
        return (
            <button className={classname} onMouseDown={onMouseDown}>
                <Icon type="link"/>
            </button>
        )
    };

    render() {
        let classname = classnames({
            'weditor-bubble-toolbar': true,
            'bubble-opacity': this.state.bubbleOpacity
        })
        return (
            <div className={classname} style={this.state.bubbleStyle}>
                <span className="weditor-tooltip-arrow" style={this.state.arrowStyle}/>
                <div className="weditor-bubble-toolbar-inner">
                    {this.renderMarkButton('bold', 'bold')}
                    {this.renderMarkButton('italic', 'italic')}
                    {this.renderLinkBtn()}
                    <Icon type="vertical"/>
                    {this.renderBlockButton('header', 'h1', 1)}
                    {this.renderBlockButton('header', 'h2', 2)}
                    {this.renderBlockButton('header', 'h3', 3)}
                </div>
            </div>
        )
    }
}
