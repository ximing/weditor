/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {inject, observer} from 'mobx-react';

import LinkBubble from './components/linkBubble';
import InsertImage from './components/insertImage';
import HotKeysDialog from './components/hotKeysDialog';
import CommentBtn from './components/comment/button';
import CommentList from './components/comment/list';
import CreateComment from './components/comment/create';
import BubbleToolbar from './components/bubble-toolbar';
import Selection from './components/selection';
import Editor from './components/editor';

import Header from './header';
import Toolbar from './toolbar';

const $ = window.jQuery;

import editor from './model/editor';

import layer from './lib/layer';

@inject(state => ({
    insert: state.insert,
    open: state.catalogue.open,
    focus: state.editor.focus,
    createPanelPosition: state.comments.createPanelPosition,
    help: state.help,
    forceUpdate:state.forceUpdate
})) @observer
export default class WEditor extends Component {
    state = {
        left: window.innerWidth / 2 - 400,
        scrollTop: 0
    };

    constructor() {
        super();
    }

    onWindowResize = () => {
        this.setState({
            left: this.props.open ? window.innerWidth / 2 - 300 : window.innerWidth / 2 - 400
        });
    };

    componentDidMount() {
        let editorDom = this.editorDom = $(ReactDOM.findDOMNode(this.refs.editor)).find('.ql-editor');
        editorDom.on('blur', () => {
            editor.focus = false;
        });
        $(window).on('resize', this.onWindowResize)
    }

    componentWillUnmount() {
        $(window).off('resize', this.onWindowResize)

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            left: nextProps.open ? window.innerWidth / 2 - 300 : window.innerWidth / 2 - 400
        });
    }

    render() {
        return (
            <div className="weditor-wrapper">
                {
                    !this.props.onlyRead && (
                        <Header doc={this.props.doc}
                                fileOptions={this.props.options.fileOptions}
                                helpOptions={this.props.options.helpOptions}/>
                    )
                }
                {
                    !this.props.onlyRead && (
                        <div className="editor-toolbar" id="toolbar">
                            <Toolbar/>
                        </div>
                    )
                }
                <div className="weditor-body">
                    <div className="content-container">
                        {
                            !this.props.focus && <Selection scrollTop={this.state.scrollTop}/>
                        }
                        {
                            this.props.title
                        }
                        <div className="backend-marker-layer" dangerouslySetInnerHTML={{__html:layer.renderBackend()}}>
                        </div>
                        <Editor onlyRead={this.props.onlyRead}/>
                        <div className="frontend-marker-layer" dangerouslySetInnerHTML={{__html:layer.renderFrontend()}}>
                        </div>
                        {
                            this.props.insert.openLinkDialog &&
                            <LinkBubble insert={this.props.insert}/>
                        }
                        <CommentBtn/>
                        <CommentList/>
                        {
                            this.props.createPanelPosition.display !== 'none' && (
                                <CreateComment/>
                            )
                        }
                        <BubbleToolbar/>
                    </div>
                </div>
                {
                    this.props.insert.openImageDialog &&
                    <InsertImage uploadUrl={this.props.options.uploadUrl}/>
                }
                {
                    this.props.help.hotKeysDialog &&
                    <HotKeysDialog/>
                }
            </div>
        );
    }
}

// export const call = function () {
//style={{left: this.state.left}}
// }
// {
//     this.props.coCursors.map(item=>{
//         return <OtherSelection key={item.id} name={item.name} range={item.range} />;
//     })
// }
