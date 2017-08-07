/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import  Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill-cursors/dist/quill-cursors.css'
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
    const {left, top, height} = getEditor().getBounds(index);
    //120 是body 到浏览器顶部的高度
    console.log('link left', left, window.innerWidth);
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
                        console.log('link', value, insert.openLinkDialog, editor.range);
                        if (value) {
                            if (insert.openLinkDialog) {
                                insert.openLinkDialog = false;
                                insert.linkTitle = null;
                                insert.linkUrl = null;
                            } else if (editor.range && (editor.range.index === 0 || !!editor.range.index)) {
                                let {index, length} = editor.range;
                                insert.openLinkDialog = true;
                                insert.linkTitle = getEditor().getText(index, length);
                                insert.linkUrl = null;
                                setLinkBubble(index);
                                insert.isCreateNewLink = false;
                            } else {
                                insert.openLinkDialog = true;
                                insert.linkTitle = '';
                                insert.linkUrl = null;
                                setLinkBubble(0);
                                insert.isCreateNewLink = true;
                            }
                            insert.linkSelection = editor.range;
                        } else {
                            const {index, length} = editor.range;
                            let [leaf, offset] = quillEditor.getLeaf(index);
                            let LinkIndex = quillEditor.getIndex(leaf);
                            // getEditor().format('link', false,'user');
                            getEditor().formatText(LinkIndex,leaf.text.length,'link', false,'user');
                            console.log('format')
                            // getEditor().removeFormat(LinkIndex, leaf.text.length, 'user');
                            insert.isCreateNewLink = false;
                        }
                    },
                    'image': function (args) {
                        console.log('select img', args);
                        insert.imageSelection = editor.range;
                        insert.openImageDialog = true;
                    }
                }
            },
            history: {
                delay: 1000,
                maxStack: 500,
                userOnly: true
            },
            cursors: {
                autoRegisterListener: false
            },
            syntax: false,        // Enable with default configuration
            //imageDrop: true,
            imageResize: {
                container: '.weditor-body',
                imgSelection: '.img-selection',
                top: 102,
                left: 0
            },
            clipboard: {
                matchers: []
            },
            comments:{

            }
        },
        placeholder: '输入文档...',
        //theme: 'snow',
        scrollingContainer: document.querySelector('.weditor-body')
        // scrollingContainer: document.querySelector('.ql-container')
    });
    var cursorsModule = quillEditor.getModule('cursors');

    quillEditor.on('editor-change', function (eventName, ...args) {
        if (eventName === 'text-change') {
            editor.focus = true;
            if (editor.range) {
                editor.format = Object.assign({}, quillEditor.getFormat(editor.range));
            } else {
                editor.format = {};
            }
        } else if (eventName === 'selection-change') {
            let [range, oldRange, source] = args;
            console.log('selection-change', range);
            try {
                if (range) {
                    editor.range = Object.assign({}, range);
                    editor.focus = true;
                    editor.format = Object.assign({}, quillEditor.getFormat(range));
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
                    editor.focus = false;
                }
            }catch (err){
                console.error(err);
            }
        }
    });
    cursorsModule.registerTextChangeListener();
    initHotKey(quillEditor);
    return quillEditor;
};
