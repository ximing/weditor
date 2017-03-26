/**
 * Created by yeanzhi on 17/2/20.
 */
'use strict';
import './style/item.scss';
import './style/file.scss';
import React,{Component} from 'react';
import FileItem from './item';
import FileListHeader from './fileListHeader';
import {routerRedux} from '@rab/router';
const {push} = routerRedux;
import {connect} from '@rab';
import Crumb from './crumb';

@connect((state)=>({
    file:state.file
}))
export default class List extends Component {
    constructor() {
        super();
    }

    edit(item) {
        return()=>{
            if(item.isDir) {
                this.props.dispatch({type: 'file.getList',payload:item.path});
            }else{
                this.props.dispatch(push(`/ot/edit?path=${item.path}`));
            }
        };
    }

    render() {
        try{
            return(
                <div className="file-list-container">
                    <Crumb />
                    <FileListHeader />
                    <div className="file-list-view">
                        {this.props.file.list.map((_,i)=>{
                            return <FileItem onSelect={()=>{}}
                                             clickItem={this.edit(_)}
                                             item={_} key={i}/>;
                        })}
                    </div>
                </div>
            );
        }catch (err) {
            console.log(err);
        }
    }
}
