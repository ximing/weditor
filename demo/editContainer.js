/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import React, {Component} from 'react';
import WEditor from '../src/index';
export default class EditContainer extends Component {
    componentDidMount() {
        window.quillEditor = this.wEditor.getEditor();
        this.wEditor.getEditor().on('text-change',()=>{
            console.log('ssss');
        });
        // this.wEditor.getEditor().setContents({"ops":[{"insert":"标题1"},{"attributes":{"header":1},"insert":"\n"},{"insert":"标题2"},{"attributes":{"header":2},"insert":"\n"},{"insert":"标题3"},{"attributes":{"header":3},"insert":"\n\n"},{"attributes":{"width":"641"},"insert":{"image":"http://static.ximing.ren/978de5229d9655bfef9fb54c48d36f1e.jpg"}},{"attributes":{"header":3},"insert":"\n"},{"insert":"fdsa想线下选择性"},{"attributes":{"header":3},"insert":"\n"},{"insert":"sssss说说¥eq¥¥eq¥¥2321fdjiofds\nfdsa\nfd\nffd撒反倒是sadsadsa"},{"attributes":{"background":"#b8cce4"},"insert":"d"},{"insert":"sa"},{"attributes":{"link":"http://www.baidu.com"},"insert":"我需要安静下来"},{"insert":"想想未来 怎么安排\n\n"}]});
        // this.wEditor.getEditor().setContents({"ops":[{"insert":"你好 没有什么不好的么\nwobuxiang tingtaiduo   na xujia de chengnuuo  o  o o o o o o  meiyou shenme buhao de me \nkkk\n\nj\n"}]})

        // this.wEditor.setContents({'ops':[{'insert':'从前慢 - 刘胡轶'},{'attributes':{'align':'center','header':2},'insert':'\n'},{'attributes':{'color':'#f79646'},'insert':'词：木心 '},{'insert':'\n'},{'attributes':{'width':'371'},'insert':{'image':'http://mssdn.sankuai.com/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1493713913846.png'}},{'attributes':{'align':'center'},'insert':'\n'},{'insert':'记得早先少年时\n大家诚诚恳恳\n说一句 是一句\n清早上火车站\n长街黑暗无行人\n卖豆浆的小店冒着热气\n从前的日色变得慢\n车 马 邮件都慢\n一生只够爱一个人\n从前的锁也好看\n钥匙精美有样子\n你锁了\n人家就懂了\n从前的日色变得慢\n车 马 邮件都慢\n一生只够爱一个人\n从前的锁也好看\n钥匙精美有样子\n你锁了\n人家就懂了\n'}]});

        this.wEditor.setContents({"ops":[{"insert":"从前慢 - 刘胡轶"},{"attributes":{"align":"center","header":2},"insert":"\n"},{"attributes":{"color":"#f79646"},"insert":"词：木心 "},{"insert":"\n"},{"attributes":{"width":"371"},"insert":{"image":"http://mssdn.sankuai.com/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1493713913846.png"}},{"attributes":{"align":"center"},"insert":"\n"},{"insert":"记得早先少年时\n大家诚诚恳恳\n说一句 是一句\n清早上火车站\n长街黑暗无行人\n卖豆浆的小店"},{"attributes":{"link":"https://www.baidu.com"},"insert":"冒着热气"},{"insert":"\n从前的日色变得慢\n车 马 邮件都慢\n一生只够爱一个人\n从前的锁也好看\n钥匙精美有样子\n你锁了\n人家就懂了\n从前的日色变得慢\n车 马 邮件都慢\n一生只够爱一个人\n从前的锁也好看\n钥匙精美有样子\n你锁了\n人家就懂了\n"}]})
    }
// <MenuItem key="1">报告问题(@ximing)</MenuItem>
// <Divider />
// <MenuItem key="3">上报日志</MenuItem>
    render() {
        return(
            <div>
                <WEditor
                doc = {{name:'test.doc',status:'fjdisoaifasdof'
                }}
                ref={(e)=>{this.wEditor = e;}}
                coCursors = {[{name:'yeanzhi',range:{length:1,index:50},id:'123'}]}
                options={{
                    uploadUrl:'http://mind.xm.test.sankuai.com/api/upload',
                    helpOptions:[
                        {key:'nihao',content:'nihaoa',onClick:(key)=>{console.log(key);}}
                    ]
                }}/>
            </div>
        );
    }
}
