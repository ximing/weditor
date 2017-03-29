/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from "react";
import $ from 'jquery';
import hotkeys from 'hotkeys-js';
import ReactDOM from 'react-dom';
import Header from './header';
import Catalogue from './catalogue';
import {initQuillEditor} from './lib/quillEditor'
import LinkBubble from './components/linkBubble';
import InsertImage from './components/insertImage';
import {setLinkBubble} from './lib/quillEditor'
import {inject, observer} from 'mobx-react';

@inject('insert') @observer
export default class WEditor extends Component {
    state = {
        rangeFormat: {}
    }

    constructor() {
        super();
        this.w = $(window);
    }

    componentDidMount() {
        let quillEditor = this.quill = initQuillEditor(ReactDOM.findDOMNode(this.refs.editor));
        window.quillEditor = quillEditor;
        quillEditor.on('selection-change', (range, oldRange, source) => {
            if (range) {
                let rangeFormat = quillEditor.getFormat(range);
                if(rangeFormat.link){
                    this.props.insert.openLinkDialog = true;
                    this.props.insert.linkUrl = rangeFormat.link;
                    let [leaf, offset]  = quillEditor.getLeaf(range.index);
                    this.props.insert.linkTitle = leaf.text;
                    // let index= quillEditor.getIndex(leaf);
                    setLinkBubble(range.index)
                }
                this.setState({rangeFormat});
            }
            if(range && range.length){}
        });
        quillEditor.setContents({"ops":[{"attributes":{"width":"198"},"insert":{"image":"https://msstest-corp.sankuai.com/v1/mss_5e386b6fb47f4f298f8cba0149245287/mind-image/nt/1490680392374_8fa879de8db1cb13620e83bdd454564e92584b3e.jpg"}},{"insert":"fdsa想线下选择性\nsssss说说¥eq¥¥eq¥¥2321fdjiofds\nfdsa\nfd\nffd撒反倒是sadsadsadsa"},{"attributes":{"link":"http://www.baidu.com"},"insert":"我需要安静下来"},{"insert":"想想未来 怎么安排\n"}]})
        // quillEditor.updateContents(op2);
        // quillEditor.setContents({"ops":op})
        this.w.on('resize', this.onResize)
    }

    componentWillUnmount() {
        this.w.off('resize', this.onResize)
    }

    onResize = () => {
        console.log(window.innerWidth)
    };

    render() {
        console.log('weditor render',this.props.insert)
        return (
            <div className="weditor-wrapper">
                <Header rangeFormat={this.state.rangeFormat}/>
                <div className="weditor-body">
                    <Catalogue style={{}}/>
                    <div className="content-container">
                        <div ref="editor">
                        </div>
                    </div>
                </div>
                {
                    this.props.insert.openLinkDialog &&
                    <LinkBubble />
                }
                {
                    this.props.insert.openImageDialog &&
                    <InsertImage uploadUrl={this.props.options.uploadUrl}/>
                }
            </div>
        );
    }
}
