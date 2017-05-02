/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import Quill from 'quill';
import './initQuill';
import initHotKey from './initHotKey';

import insert from '../model/insert';
import format from '../model/format';
import editor from '../model/editor';

import catalogue from '../model/catalogue';
// setInterval(()=>{
//     catalogue.open = !catalogue.open;
// },2000)

var quillEditor = null;
var quillDom = null;
var $quillDom = null;
var $quillEditorDom = null;
var $quillContainer = null;
var $weditorBody = null;
var linkBubble = {
    height: 95,
    width: 380
};
export var initQuillEditor = function initQuillEditor(dom, options) {
    quillDom = dom;
    $quillDom = $(quillDom);
    $quillContainer = $('.content-container');
    quillEditor = new Quill(dom, {
        modules: {
            toolbar: {
                container: '#toolbarOpver',
                handlers: {
                    'link': function link(value) {
                        if (value) {
                            if (insert.openLinkDialog) {
                                insert.openLinkDialog = false;
                                insert.linkTitle = null;
                                insert.linkUrl = null;
                            } else {
                                if (getEditor() && getEditor().getSelection()) {
                                    var _getEditor$getSelecti = getEditor().getSelection(),
                                        index = _getEditor$getSelecti.index,
                                        length = _getEditor$getSelecti.length;

                                    insert.openLinkDialog = true;
                                    insert.linkTitle = getEditor().getText(index, length);
                                    insert.linkUrl = null;
                                    setLinkBubble(index);
                                }
                            }
                            insert.linkSelection = getEditor().getSelection();
                        } else {
                            var _getEditor$getSelecti2 = getEditor().getSelection(),
                                _index = _getEditor$getSelecti2.index,
                                _length = _getEditor$getSelecti2.length;

                            var _quillEditor$getLeaf = quillEditor.getLeaf(_index),
                                _quillEditor$getLeaf2 = _slicedToArray(_quillEditor$getLeaf, 2),
                                leaf = _quillEditor$getLeaf2[0],
                                offset = _quillEditor$getLeaf2[1];

                            var LinkIndex = quillEditor.getIndex(leaf);
                            //getEditor().format('link', false);
                            getEditor().removeFormat(LinkIndex, leaf.text.length);
                        }
                    },
                    'image': function image(args) {
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
        theme: 'snow',
        scrollingContainer: document.querySelector('.weditor-body')
    });
    $quillEditorDom = $(quillDom).find('.ql-editor');
    $weditorBody = $('.weditor-body');
    // quillEditor.on('text-change', (range, oldRange, source) => {
    //     resize();
    // });
    quillEditor.on('selection-change', function (range, oldRange, source) {
        console.log('selection-change', range, source);
        if (range) {
            editor.range = range;
            editor.focus = true;
            editor.format = quillEditor.getFormat(range) || {};
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
                    var index = range.index,
                        length = range.length;

                    quillEditor.removeFormat(index, length, 'user');
                    quillEditor.formatText(index, length, format.currentFormat, 'user');
                    format.currentFormat = null;
                    // Object.keys(format.currentFormat).forEach(item=>{
                    //
                    // })
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
export var resize = function resize() {
    // console.log('resize')
    // let scrollHeight = $quillEditorDom[0].scrollHeight;
    // console.log('scrollHeight',scrollHeight);
    // if ($weditorBody.height() < scrollHeight) {
    //     $quillContainer.height(scrollHeight);
    // } else {
    //     $quillContainer.height($weditorBody.height() - 50);
    // }
};
export var getEditor = function getEditor() {
    return quillEditor;
};

export var getDom = function getDom() {
    return quillDom;
};

export var getEditorBoundingClientRect = function getEditorBoundingClientRect() {
    return quillDom.getBoundingClientRect();
};

export var setLinkBubble = function setLinkBubble(index) {
    var _getEditor$getBounds = getEditor().getBounds(index),
        left = _getEditor$getBounds.left,
        top = _getEditor$getBounds.top,
        height = _getEditor$getBounds.height;

    var linkLeft = getEditorBoundingClientRect().left + left;
    var linkTop = getEditorBoundingClientRect().top + top + height;
    if (linkLeft + linkBubble.width >= window.innerWidth) {
        linkLeft = linkLeft - linkBubble.width;
    }
    if (linkTop + linkBubble.height >= window.innerHeight) {
        linkTop = linkTop - linkBubble.height - height - 10;
    }
    insert.linkPosition = {
        left: linkLeft,
        top: linkTop
    };
};