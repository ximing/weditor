/**
 * Created by yeanzhi on 17/4/4.
 */
'use strict';
import React,{Component} from 'react';
import {getEditor} from '../../lib/quillEditor';

export default class OtherSelection extends Component{
    render(){
        let {name,range} = this.props;
        const editor = getEditor();
        const {index, length} = range;
        let sLeft = 0, sHeight = 0, sWidth = 0, sTop = 0;
        if (editor) {
            if (index) {
                const {left, height, top, width} = editor.getBounds(index, length || 0);
                sLeft = left;
                sHeight = height;
                sTop = top;
                sWidth = width;
            }
            return(
                <div className="weditor-other-selection"
                     style={{
                         diplay:'block',
                         height: sHeight,
                         width: 0,
                         left: sLeft,
                         top: sTop,
                         borderLeft:'1px solid black'
                     }}>
                    <div style={{width:sWidth}}>
                        <span className="weditor-other-selection-name">{name}</span>
                    </div>
                </div>
            )
        }else{
            return (<span></span>)
        }
    }
}
