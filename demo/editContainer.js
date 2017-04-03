/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from "react";
import WEditor from '../src/index';
export default class EditContainer extends Component {
    componentDidMount(){
        window.quillEditor = this.wEditor.getEditor();
        this.wEditor.getEditor().on('text-change',()=>{
            console.log('ssss')
        })
        this.wEditor.getEditor().setContents({"ops":[{"insert":"标题1"},{"attributes":{"header":1},"insert":"\n"},{"insert":"标题2"},{"attributes":{"header":2},"insert":"\n"},{"insert":"标题3"},{"attributes":{"header":3},"insert":"\n\n"},{"attributes":{"width":"641"},"insert":{"image":"http://static.ximing.ren/978de5229d9655bfef9fb54c48d36f1e.jpg"}},{"attributes":{"header":3},"insert":"\n"},{"insert":"fdsa想线下选择性"},{"attributes":{"header":3},"insert":"\n"},{"insert":"sssss说说¥eq¥¥eq¥¥2321fdjiofds\nfdsa\nfd\nffd撒反倒是sadsadsa"},{"attributes":{"background":"#b8cce4"},"insert":"d"},{"insert":"sa"},{"attributes":{"link":"http://www.baidu.com"},"insert":"我需要安静下来"},{"insert":"想想未来 怎么安排\n\n"}]})
    }
    render() {
        return(
            <div>
                <WEditor 
                doc = {{name:'test.doc',status:'fjdisoaifasdof'
                }}
                ref={a=>this.wEditor = a} 
                options={{uploadUrl:'http://mind.xm.test.sankuai.com/api/upload'}}/>
            </div>
        );
    }
}
