/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from "react";
import WEditor from '../src/index';
export default class EditContainer extends Component {
    componentDidMount(){
        console.log(this.wEditor)
        window.quillEditor = this.wEditor.getEditor();
        this.wEditor.getEditor().setContents({"ops":[{"insert":"标题1"},{"attributes":{"header":1},"insert":"\n"},{"insert":"标题2"},{"attributes":{"header":2},"insert":"\n"},{"insert":"标题3"},{"attributes":{"header":3},"insert":"\n\n"},{"attributes":{"width":"198"},"insert":{"image":"https://msstest-corp.sankuai.com/v1/mss_5e386b6fb47f4f298f8cba0149245287/mind-image/nt/1490680392374_8fa879de8db1cb13620e83bdd454564e92584b3e.jpg"}},{"attributes":{"header":3},"insert":"\n"},{"insert":"fdsa想线下选择性"},{"attributes":{"header":3},"insert":"\n"},{"insert":"sssss说说¥eq¥¥eq¥¥2321fdjiofds\nfdsa\nfd\nffd撒反倒是sadsadsa"},{"attributes":{"background":"#b8cce4"},"insert":"d"},{"insert":"sa"},{"attributes":{"link":"http://www.baidu.com"},"insert":"我需要安静下来"},{"insert":"想想未来 怎么安排\n\n"}]})
    }
    render() {
        return(
            <div>
                <WEditor ref={a=>this.wEditor = a} options={{uploadUrl:'http://mind.xm.test.sankuai.com/api/upload'}}/>
            </div>
        );
    }
}
