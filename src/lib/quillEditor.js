/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import  Quill from 'quill';

import insert from '../model/insert';

let quillEditor = null;
let quillDom = null;
export const initQuillEditor = function (dom, options) {
    quillDom = dom;
    quillEditor = new Quill(dom, {
        modules: {
            toolbar: {
                container: '#toolbarOpver',
                handlers: {
                    'link': function (value, ...args) {
                        if (value) {
                            let {openLinkDialog, linkTitle, linkUrl, linkPosition} = insert;
                            if (openLinkDialog) {
                                openLinkDialog = false;
                                linkTitle = null;
                                linkUrl = null;
                            } else {
                                if (getEditor()) {
                                    if (getEditor().getSelection()) {
                                        const {index, length} = getEditor().getSelection()
                                        const {left, top, height} = getEditor().getBounds(index);
                                        openLinkDialog = true;
                                        linkTitle = getEditor().getText(index, length);
                                        linkUrl = null;
                                        linkPosition = {
                                            left: getEditorBoundingClientRect().left + left,
                                            top: getEditorBoundingClientRect().top + top
                                        }
                                    }
                                }
                            }
                            // var value = prompt('What is the image URL');
                            // quill.format('link', value);
                        } else {
                            getEditor().format('link', false);
                        }
                        console.log(value, args);
                        console.log(getEditor().getSelection(), getEditor().getBounds(7))
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
