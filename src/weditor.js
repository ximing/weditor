/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Header from './header';
import Toolbar from './toolbar';
import Catalogue from './catalogue';
import LinkBubble from './components/linkBubble';
import InsertImage from './components/insertImage';
import HotKeysDialog from './components/hotKeysDialog';
import CommentBtn from './components/comment/button';
import CommentList from './components/comment/list';
import BubbleToolbar from './components/bubble-toolbar';

import {inject, observer} from 'mobx-react';
import Selection from './components/selection';
import Editor from './components/editor';
const $ = window.jQuery;
import editor from './model/editor';


@inject(state => ({
    insert: state.insert,
    open: state.catalogue.open,
    focus: state.editor.focus,
    help:state.help
})) @observer
export default class WEditor extends Component {
    state = {
        left: window.innerWidth / 2 - 400,
        scrollTop: 0
    };

    constructor() {
        super();
    }
    onWindowResize = ()=>{
        this.setState({
            left: this.props.open ? window.innerWidth / 2 - 300 : window.innerWidth / 2 - 400
        });
    };
    componentDidMount() {
        let editorDom = this.editorDom = $(ReactDOM.findDOMNode(this.refs.editor)).find('.ql-editor');
        editorDom.on('blur', () => {
            editor.focus = false;
        });
        $(window).on('resize',this.onWindowResize)
    }

    componentWillUnmount() {
        $(window).off('resize',this.onWindowResize)

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
                    !this.props.onlyRead&&(
                        <Header doc={this.props.doc}
                                fileOptions={this.props.options.fileOptions}
                                helpOptions={this.props.options.helpOptions}/>
                    )
                }
                {
                    !this.props.onlyRead&&(
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
                        <Editor onlyRead={this.props.onlyRead}/>
                        <div className="img-selection">
                            <div className="docs-squarehandleselectionbox-handle docx-selection-topleft"></div>
                            <div className="docs-squarehandleselectionbox-handle docx-selection-topright"></div>
                            <div className="docs-squarehandleselectionbox-handle docx-selection-bottomleft"></div>
                            <div className="docs-squarehandleselectionbox-handle docx-selection-bottomright"></div>
                        </div>
                        {
                            this.props.insert.openLinkDialog &&
                            <LinkBubble insert={this.props.insert}/>
                        }
                        <CommentBtn/>
                        <CommentList/>
                        <BubbleToolbar/>
                    </div>
                </div>
                {
                    this.props.insert.openImageDialog &&
                    <InsertImage uploadUrl={this.props.options.uploadUrl}/>
                }
                {
                    this.props.help.hotKeysDialog &&
                    <HotKeysDialog />
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
