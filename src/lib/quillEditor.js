/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import  Quill from 'quill';
import './initQuill';
import initHotKey from './initHotKey';

import insert from '../model/insert';
import format from '../model/format';
import editor from '../model/editor';

let quillEditor = null;
let quillDom = null;
let $quillEditorDom = null;
let $quillContainer = null;
let $weditorBody = null;

const linkBubble = {
    height: 95,
    width: 380
};
export const getEditor = function () {
    return quillEditor;
};

export const getDom = function () {
    return quillDom;
};

export const getEditorBoundingClientRect = function () {
    return quillDom.getBoundingClientRect();
};

export const setLinkBubble = function (index) {
    // const {left, top, height} = getEditor().getBounds(index);
    // let linkLeft = getEditorBoundingClientRect().left + left;
    // let linkTop = getEditorBoundingClientRect().top + top + height;
    // if (linkLeft + linkBubble.width >= window.innerWidth) {
    //     linkLeft = linkLeft - linkBubble.width;
    // }
    // if (linkTop + linkBubble.height >= window.innerHeight) {
    //     linkTop = linkTop - linkBubble.height - height - 10;
    // }
    // console.log(top,linkTop,height,getEditorBoundingClientRect().top);
    // insert.linkPosition = {
    //     left: linkLeft,
    //     top: linkTop
    // };
    //======================badk end========================
    const {left, top, height} = getEditor().getBounds(index);
    //120 是body 到浏览器顶部的高度
    console.log('link left', left,window.innerWidth);
    if (top + getEditorBoundingClientRect().top > window.innerHeight - linkBubble.height - 20) {
        insert.linkPosition = {
            left: left + 430 > window.innerWidth ? window.innerWidth - 430 : left,
            top: top,
            isAbove: true,
            textHeight: height
        };
    } else {
        insert.linkPosition = {
            left: left + 430 > window.innerWidth ? window.innerWidth - 430 : left,
            top: top,
            isAbove: false,
            textHeight: height
        };
    }
};


export const initQuillEditor = function (dom, options) {
    quillDom = dom;
    $quillContainer = $('.content-container');
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
                            } else if (editor.range) {
                                const {index, length} = editor.range;
                                insert.openLinkDialog = true;
                                insert.linkTitle = getEditor().getText(index, length);
                                insert.linkUrl = null;
                                setLinkBubble(index);
                            }
                            insert.linkSelection = editor.range;
                            insert.isCreateNewLink = true;
                        } else {
                            const {index, length} = editor.range;
                            let [leaf, offset] = quillEditor.getLeaf(index);
                            let LinkIndex = quillEditor.getIndex(leaf);
                            //getEditor().format('link', false);
                            getEditor().removeFormat(LinkIndex, leaf.text.length, 'user');
                            insert.isCreateNewLink = false;
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
            imageResize: {
                container: '.weditor-body',
                imgSelection: '.img-selection',
                top: 102,
                left: 0
            }
        },
        placeholder: '输入文档...',
        //theme: 'snow',
        scrollingContainer: document.querySelector('.weditor-body')
    });
    $quillEditorDom = $(quillDom).find('.ql-editor');
    $weditorBody = $('.weditor-body');
    // quillEditor.on('text-change', (range, oldRange, source) => {
    //     resize();
    // });
    quillEditor.on('text-change', function (delta, oldDelta, source) {
        editor.focus = true;
        if (editor.range) {
            editor.format = quillEditor.getFormat(editor.range) || {};
        } else {
            editor.format = {};
        }
    });
    quillEditor.on('selection-change', (range, oldRange, source) => {
        console.log('selection-change', range, source);
        if (range) {
            editor.range = range;
            editor.focus = true;
            editor.format = quillEditor.getFormat(range) || {};
            if (editor.format.link) {
                let [leaf, offset] = quillEditor.getLeaf(range.index);
                // let linkIndex = quillEditor.getIndex(leaf);
                //在文本最开始的时候，拿不到 link format 所以不用判断左区间的问题了。
                if (offset < leaf.length()) {
                    insert.openLinkDialog = true;
                    insert.linkUrl = editor.format.link;
                    insert.isReadOnlyLink = true;
                    insert.linkTitle = leaf.text;
                    setLinkBubble(range.index)
                }

            }
            if (range.length !== 0) {
                //处理格式刷
                if (format.currentFormat) {
                    const {index, length} = range;
                    quillEditor.removeFormat(index, length, 'user');
                    quillEditor.formatLine(index, length, format.currentFormat, 'user');
                    quillEditor.formatText(index, length, format.currentFormat, 'user');

                    format.currentFormat = null;
                }
            }
        } else {
            console.log('blur');
        }
    });
    initHotKey(quillEditor);

    //$(window).on('resize', resize);
    //fix有图片的时候高度问题
    // $( window ).on("load", resize);
    return quillEditor;
};
export const resize = function () {
    // console.log('resize')
    // let scrollHeight = $quillEditorDom[0].scrollHeight;
    // console.log('scrollHeight',scrollHeight);
    // if ($weditorBody.height() < scrollHeight) {
    //     $quillContainer.height(scrollHeight);
    // } else {
    //     $quillContainer.height($weditorBody.height() - 50);
    // }
};
