/**
 * @Creator: Liuyanqing
 * @Date: 11/9/16
 */
'use strict';
import './index.scss';
import React, {Component} from 'react';

export default class FileListHeader extends Component {

    render() {
        return(
            <div className="yp-file-list-header">
                <span className="list-header-title list-header-title-name">名称</span>
                <div className="list-header-right">
                    <span className="list-header-title list-header-title-size">大小</span>
                    <span className="list-header-title list-header-title-uts">更新时间</span>
                </div>
            </div>
        );
    }
}
