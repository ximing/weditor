/**
 * Created by yeanzhi on 17/4/6.
 */
'use strict';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

import {initQuillEditor} from '../../lib/quillEditor';

export default class Editor extends Component {

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        let quillEditor = this.quill = initQuillEditor(ReactDOM.findDOMNode(this.refs.editor));
        quillEditor.enable(!this.props.onlyRead);
    }

    render() {
        return(
            <div ref="editor">
            </div>
        );
    }
}
