/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import  Quill from 'quill';

import insert from '../model/insert';
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
                        if (value) {
                            if (insert.openLinkDialog) {
                                insert.openLinkDialog = false;
                                insert.linkTitle = null;
                                insert.linkUrl = null;
                            } else {
                                if (getEditor() && getEditor().getSelection()) {
                                    const {index, length} = getEditor().getSelection()
                                    const {left, top, height} = getEditor().getBounds(index);
                                    insert.openLinkDialog = true;
                                    insert.linkTitle = getEditor().getText(index, length);
                                    insert.linkUrl = null;
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
                            }
                        } else {
                            getEditor().format('link', false);
                        }
                        // openLinkDialog = true;
                        insert.linkSelection = getEditor().getSelection();
                    },
                    'image': function (args) {
                        console.log('ssss', args);
                        var range = this.quill.getSelection();
                        var value = prompt('What is the image URL');
                        getEditor().insertEmbed(range.index, 'image', value, Quill.sources.USER);
                    }
                }
            },
            history: {
                delay: 1000,
                maxStack: 500,
                userOnly: true
            },
            //'syntax': true        // Enable with default configuration
        },
        placeholder: '输入文档...',
        theme: 'snow'
    });
    quillEditor.on('blur',()=>{
        let selection = quillEditor.getSelection();
        console.log('blur',selection);
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
