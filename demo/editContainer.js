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
        // this.wEditor.getEditor().setContents({"ops":[{"insert":"标题1"},{"attributes":{"header":1},"insert":"\n"},{"insert":"标题2"},{"attributes":{"header":2},"insert":"\n"},{"insert":"标题3"},{"attributes":{"header":3},"insert":"\n\n"},{"attributes":{"width":"641"},"insert":{"image":"http://static.ximing.ren/978de5229d9655bfef9fb54c48d36f1e.jpg"}},{"attributes":{"header":3},"insert":"\n"},{"insert":"fdsa想线下选择性"},{"attributes":{"header":3},"insert":"\n"},{"insert":"sssss说说¥eq¥¥eq¥¥2321fdjiofds\nfdsa\nfd\nffd撒反倒是sadsadsa"},{"attributes":{"background":"#b8cce4"},"insert":"d"},{"insert":"sa"},{"attributes":{"link":"http://www.baidu.com"},"insert":"我需要安静下来"},{"insert":"想想未来 怎么安排\n\n"}]});
        // this.wEditor.getEditor().setContents({"ops":[{"insert":"你好 没有什么不好的么\nwobuxiang tingtaiduo   na xujia de chengnuuo  o  o o o o o o  meiyou shenme buhao de me \nkkk\n\nj\n"}]})
        setTimeout(()=>{
            this.wEditor.setContents({"ops":[{"insert":"本周工作"},{"attributes":{"header":1},"insert":"\n"},{"insert":"外勤，客服管理后台，大象管理后台 需求会，开放能力的会"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"团队内部review工作"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"实时协作、文档编辑 线上和预发环境"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"word支持实时光标提示"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"kms nodejs问题修复"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"修复word编辑器的几个bug，改版word编辑器 展示形式"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"大象接入实时协作插件，灰度几个用户"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"完成实时协作引擎json接入算法，并将脑图接入新版实时协作引擎"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"富应用错误上报机制"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"下周计划"},{"attributes":{"header":1},"insert":"\n"},{"insert":"实时协作("},{"attributes":{"color":"#4bacc6"},"insert":"word编辑器，脑图"},{"insert":")上线上环境"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"通用预览接入脑图"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"oauth nodejs SDK"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"实时协作 对接云盘引起的数据同步问题 需要再讨论一下"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"三方应用接入云盘 涉及到群组文件操作权限的问题 ，需要再确认一下方案"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"感想"},{"attributes":{"header":1},"insert":"\n"},{"insert":"协作的大框架"},{"attributes":{"background":"#ffffff"},"insert":"终于都"},{"insert":"搞定了，并且都放到实际的项目中应用了一下，涉及到纯文本，富文本，json三种协作的算法都基于ot算法的理论上完善出来了。后面就要在生产环境上面 验证一下还有没有别的问题。"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"插件化的问题挺坑的，设计到"},{"attributes":{"background":"#ffffff"},"insert":"各种读写的"},{"insert":"权限，这周讨论了几个方案都不是很满意，后面再调研一下业界都是怎么做的 ，然后在看看我们的业务场景上面会不会有更好的方案"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":"内部团队建设的事情 下周如果有空闲也要拿一个草案出来"},{"attributes":{"list":"ordered"},"insert":"\n"},{"insert":{"image":"https://mss.sankuai.com/v1/mss_f20b28c4592e489eafafa4a68cf5feea/mind-image/nt/1491300696240_978de5229d9655bfef9fb54c48d36f1e.jpg"}},{"insert":"\n"}]})
        },1500)
    }
    render() {
        return(
            <div>
                <WEditor 
                doc = {{name:'test.doc',status:'fjdisoaifasdof'
                }}
                ref={(e)=>{this.wEditor = e}}
                coCursors = {[{name:'yeanzhi',range:{length:10,index:15},id:'123'}]}
                options={{
                    uploadUrl:'http://mind.xm.test.sankuai.com/api/upload'
                }}/>
            </div>
        );
    }
}
