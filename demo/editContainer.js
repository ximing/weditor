/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from "react";
import WEditor from '../src/index';
export default class EditContainer extends Component {
    componentDidMount(){
        console.log(this.wEditor)
    }
    render() {
        return(
            <div>
                <WEditor ref={a=>this.wEditor = a} options={{uploadUrl:'http://mind.xm.test.sankuai.com/api/upload'}}/>
            </div>
        );
    }
}
