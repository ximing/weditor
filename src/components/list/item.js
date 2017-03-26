/**
 * Created by yeanzhi on 17/2/22.
 */
'use strict';
import React, {Component} from 'react';
import {formatDate} from '../../lib/timeRelated';
import {fileBigIconJudge} from '../../lib/filejudge';
import {isImg} from '../../lib/fileTypeJudge.js';

let sizeConvert = (size)=>{
    return size / 1000 > 1000 ? `${(size / 1000 / 1000).toFixed(2)}M` : `${(size / 1000).toFixed(1)}K`;
};

export default class extends Component {
    render() {
        try{
            let {item,clickItem} = this.props;
            return (
                <div className= {'yp-file-list-item'}
                     onDoubleClick={clickItem}>
                    <span className="list-item-checkbox-container">
                    </span>
                    <span className={`list-item-icon ${isImg(item.name) && item.thumbUrl && !item.isDir && 'list-item-icon-border'}`}>
                        {
                        isImg(item.name) && item.thumbUrl ? <ImgLoader src={item.thumbUrl}/> :
                        <span className={fileBigIconJudge(item.isDir,item.name)}></span>
                    }
                    </span>
                    <div className="list-item-title">
                        <span title={item.name} className="list-item-title-name"
                              onClick={clickItem}>{item.name}</span>
                    </div>
                    <div className="list-item-right">
                        <span className="list-item-size">{item.isDir ? '-' : sizeConvert(item.size)}</span>
                        <span className="list-item-uts">{formatDate('yyyy/MM/dd HH:mm',item.uts)}</span>
                    </div>
                </div>
            );
        }catch(err) {
            console.log(err);
        }
    }
}
