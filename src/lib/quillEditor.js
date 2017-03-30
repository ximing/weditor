/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import  Quill from 'quill';
import './initQuill'

import insert from '../model/insert';
import format from '../model/format';
import editor from '../model/editor';

import catalogue from '../model/catalogue';
// setInterval(()=>{
//     catalogue.open = !catalogue.open;
// },2000)

let quillEditor = null;
let quillDom = null;
const linkBubble = {
    height:95,
    width:380
};
export const initQuillEditor = function (dom, options) {
    quillDom = dom;
    quillEditor = new Quill(dom, {
        modules: {
            toolbar: {
                container: '#toolbarOpver',
                handlers: {
                    'link': function (value, ...args) {
                        console.log('link',value,args)
                        if (value) {
                            if (insert.openLinkDialog) {
                                insert.openLinkDialog = false;
                                insert.linkTitle = null;
                                insert.linkUrl = null;
                            } else {
                                if (getEditor() && getEditor().getSelection()) {
                                    const {index, length} = getEditor().getSelection()
                                    insert.openLinkDialog = true;
                                    insert.linkTitle = getEditor().getText(index, length);
                                    insert.linkUrl = null;
                                    setLinkBubble(index)
                                }
                            }
                            insert.linkSelection = getEditor().getSelection();
                        } else {
                            const {index, length} = getEditor().getSelection()
                            let [leaf, offset]  = quillEditor.getLeaf(index);
                            let LinkIndex= quillEditor.getIndex(leaf);
                            //getEditor().format('link', false);
                            getEditor().removeFormat(LinkIndex, leaf.text.length);
                        }
                        // openLinkDialog = true;
                    },
                    'image': function (args) {
                        console.log('ssss', args);
                        // var range = this.quill.getSelection();
                        // var value = prompt('What is the image URL');
                        insert.imageSelection = getEditor().getSelection();
                        insert.openImageDialog = true;
                    }
                }
            },
            history: {
                delay: 1000,
                maxStack: 500,
                userOnly: true
            },
            //'syntax': true        // Enable with default configuration
            //imageDrop: true,
            imageResize: true
        },
        placeholder: '输入文档...',
        theme: 'snow'

    });
    quillEditor.on('blur',()=>{
        let selection = quillEditor.getSelection();
        console.log('blur',selection);
    });
    quillEditor.on('selection-change',(range)=>{
        if (range) {
            editor.range = range;
            editor.focus = true;
            let rangeFormat = quillEditor.getFormat(range);
            if (rangeFormat.link) {
                insert.openLinkDialog = true;
                insert.linkUrl = rangeFormat.link;
                let [leaf, offset] = quillEditor.getLeaf(range.index);
                insert.linkTitle = leaf.text;
                // let index= quillEditor.getIndex(leaf);
                setLinkBubble(range.index)
            }
            if (range.length !== 0) {
                //处理格式刷
                if(format.currentFormat){
                    const {index,length} = range;
                    quillEditor.removeFormat(index,length,'user');
                    quillEditor.formatText(index,length,format.currentFormat,'user')
                    format.currentFormat = null;
                    // Object.keys(format.currentFormat).forEach(item=>{
                    //
                    // })
                } else {
                    console.log('Cursor not in the editor');
                }
                console.log('fdsafdsafdsf',range)
            }
        }else{
            editor.focus = false;
            console.log('blur')
        }
    });
    return quillEditor;
};

export const getEditor = function () {
    return quillEditor;
};

export const getDom = function () {
    return quillDom;
}

export const getEditorBoundingClientRect = function () {
    return quillDom.getBoundingClientRect();
}

export const setLinkBubble = function (index) {
    const {left, top, height} = getEditor().getBounds(index);
    let linkLeft = getEditorBoundingClientRect().left + left;
    let linkTop = getEditorBoundingClientRect().top + top+height;
    if(linkLeft + linkBubble.width>= window.innerWidth){
        linkLeft = linkLeft - linkBubble.width;
    }
    if(linkTop + linkBubble.height >= window.innerHeight){
        linkTop = linkTop - linkBubble.height - height - 10;
    }
    insert.linkPosition = {
        left: linkLeft,
        top: linkTop
    }
}
