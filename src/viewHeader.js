/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';
import React, {Component} from "react";
import Icon from './components/icon/index';
import quillEditor from './lib/quillEditor'

export default class CommonEditor extends Component {

    toggleCatalogue = () => {
        if (quillEditor) {
            let ops = quillEditor.getContents().ops;
            let _ops = [];
            ops = ops.forEach((item, i) => {
                if (ops[i + 1] && ops[i + 1].attributes && ops[i + 1].attributes.header) {
                    _ops.push({
                        h: ops[i + 1].attributes.header,
                        content: item.insert
                    })
                }
            });
            // this.props.dispatch({
            //     type: 'catalogue.setCatalogue',
            //     payload: _ops
            // })
            this.props.call('catalogue.setCatalogue', _ops);
        }
    }

    render() {
        const {style} = this.props;
        return (
            <span className="ql-formats view-header" style={style}>
                <span className="ql-catalogue opver-area" onClick={this.toggleCatalogue}>
                    <span className="opver-icon catalogue-icon"></span>
                    <span>显示目录</span>
                </span>
            </span>
        )
    }
}
