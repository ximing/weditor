/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import  Quill from 'quill';
import './initQuill'
import initHotKey from './initHotKey'

import insert from '../model/insert';
import format from '../model/format';
import editor from '../model/editor';

import catalogue from '../model/catalogue';
// setInterval(()=>{
//     catalogue.open = !catalogue.open;
// },2000)

let quillEditor = null;
let quillDom = null;
let $quillDom = null;
let $quillEditorDom = null;
let $quillContainer = null;
let $weditorBody = null;
const linkBubble = {
    height: 95,
    width: 380
};
export const initQuillEditor = function (dom, options) {
    quillDom = dom;
    $quillDom = $(quillDom);
    $quillContainer = $('.content-container')
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
                                    insert.openLinkDialog = true;
                                    insert.linkTitle = getEditor().getText(index, length);
                                    insert.linkUrl = null;
                                    setLinkBubble(index)
                                }
                            }
                            insert.linkSelection = getEditor().getSelection();
                        } else {
                            const {index, length} = getEditor().getSelection()
                            let [leaf, offset] = quillEditor.getLeaf(index);
                            let LinkIndex = quillEditor.getIndex(leaf);
                            //getEditor().format('link', false);
                            getEditor().removeFormat(LinkIndex, leaf.text.length);
                        }
                    },
                    'image': function (args) {
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
    $quillEditorDom = $(quillDom).find('.ql-editor');
    $weditorBody = $('.weditor-body');
    quillEditor.on('text-change', (range, oldRange, source) => {
        resize();
    });
    quillEditor.on('selection-change', (range, oldRange, source) => {
        console.log('selection-change', range, source)
        if (range) {
            editor.range = range;
            editor.focus = true;
            editor.format = quillEditor.getFormat(range)||{};
            //let rangeFormat = quillEditor.getFormat(range);
            // if (rangeFormat.link) {
            //     insert.openLinkDialog = true;
            //     insert.linkUrl = rangeFormat.link;
            //     let [leaf, offset] = quillEditor.getLeaf(range.index);
            //     insert.linkTitle = leaf.text;
            //     // let index= quillEditor.getIndex(leaf);
            //     setLinkBubble(range.index)
            // }
            if (range.length !== 0) {
                //处理格式刷
                if (format.currentFormat) {
                    const {index, length} = range;
                    quillEditor.removeFormat(index, length, 'user');
                    quillEditor.formatText(index, length, format.currentFormat, 'user')
                    format.currentFormat = null;
                    // Object.keys(format.currentFormat).forEach(item=>{
                    //
                    // })
                }
            }
        } else {
            console.log('blur')
        }
    });
    initHotKey(quillEditor);

    $(window).on('resize', resize);
    //fix有图片的时候高度问题
    $( window ).on("load", resize);
    return quillEditor;
};
function resize() {
    let scrollHeight = $quillEditorDom[0].scrollHeight;
    console.log(scrollHeight);
    if ($weditorBody.height() < scrollHeight) {
        $quillContainer.height(scrollHeight);
    } else {
        $quillContainer.height($weditorBody.height() - 50);
    }
}
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
    let linkTop = getEditorBoundingClientRect().top + top + height;
    if (linkLeft + linkBubble.width >= window.innerWidth) {
        linkLeft = linkLeft - linkBubble.width;
    }
    if (linkTop + linkBubble.height >= window.innerHeight) {
        linkTop = linkTop - linkBubble.height - height - 10;
    }
    insert.linkPosition = {
        left: linkLeft,
        top: linkTop
    }
}
