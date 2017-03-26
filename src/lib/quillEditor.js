/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import  Quill from 'quill';

let quillEditor = null;

export const initQuillEditor = function (dom,options) {
    quillEditor = new Quill(dom, {
        modules: {
            toolbar: {
                container: '#toolbarOpver',
                handlers: {
                    'link': function (value, ...args) {
                        if (value) {
                            var value = prompt('What is the image URL');
                            quill.format('link', value);
                        } else {
                            quill.format('link', false);
                        }
                        console.log(value, args);
                        console.log(quill.getSelection(), quill.getBounds(7))
                    },
                    'image': function (args) {
                        console.log('ssss', args);
                        var range = this.quill.getSelection();
                        var value = prompt('What is the image URL');
                        quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
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
}
export const getEditor = function(){
    return quillEditor
};
