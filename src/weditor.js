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

import {inject, observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';

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
                this.setState({rangeFormat});
            } else {
                console.log('Cursor not in the editor');
            }
        });
        quillEditor.setContents({"ops":[{"attributes":{"width":"198"},"insert":{"image":"https://msstest-corp.sankuai.com/v1/mss_5e386b6fb47f4f298f8cba0149245287/mind-image/nt/1490680392374_8fa879de8db1cb13620e83bdd454564e92584b3e.jpg"}},{"insert":"fdsa想线下选择性\nsssss说说¥eq¥¥eq¥¥2321fdjiofds\nfdsa\nfd\nffd撒反倒是\nsadsadsadsa我需要安静下来想想未来 怎么安排\njgfjtyhgftyjfthygtjffhtygjfthgfhyjftygjhgjhgjhgjhgjghjhgjhgjf34t4354eytfhfghr6\nfdsafdsafdsaffffffgfgfgfgfgfgfgfgfgffgfgggggggg\n\nfdsafdsafdsfdsafdsfdsa\nnihaomeiyou\nfdsa想线下选择性\nsssss说说¥eq¥¥eq¥¥2321fdjiofds\nfdsa\nfd\nffd撒反倒是\nsadsadsadsa\n学习型dsadsadasdsadsa\n\ngfdgfdgfdgfdgfdgfdgfdjjafdssoajfda\nfds\nfd\nsa\n\nfd\nsfdsafdsa\nffff12jfidosaj4jfid3osa5jfd43soajfidosajijfidsjaojfdjisajfiodjiosajfiodjsaoijfdiosjaofjdsioajfoidsjaoifjdsioajfiodsjafiodjsaoi\njgfjtyhgftyjfthygtjffhtygjfthgfhyjftygjhgjhgjhgjhgjghjhgjhgjf34t4354eytfhfghr6\nfdsafdsafdsaffffffgfgfgfgfgfgfgfgfgffgfgggggggg\n\nfdsafdsafdsfdsafdsfdsa\n\nfd\ns\n\n"}]})
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
                <DevTools />
            </div>
        );
    }
}
