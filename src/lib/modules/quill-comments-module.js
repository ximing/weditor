/**
 * Created by yeanzhi on 17/8/3.
 */
'use strict';
import Quill from 'quill';

const Parchment = Quill.import('parchment');

import comments from '../../model/comments';

const $ = window.$;

export class Comments {
    constructor(quill, options = {}) {
        this.quill = quill;
        const that = this;
        $(quill.root).on('click', 'span[data-comments]', function (e) {
            if ($(this).data('comments')) {
                let comments = `${$(this).data('comments')}`.split(',');
                console.log('ssaabbvvcc', comments);
                if (comments[0]) {
                    // let range = quill.getSelection();
                    // comments.range = range;
                    /*
                    The reason I say unofficially is because quill.scroll is not documented, and the variable name or visibility may change in the future (though none is planned). But find and offset are both part of Parchment's API. There may be an official API for Quill in the future for this use case as well.
                    Not quill.root is the DOM node, quill.container is the DOM parent of quill.root and elements not just the editor part but any for modules like the clipboard. quill.scroll is the blot counterpart of quill.root (Parchment.find(quill.root) === quill.scroll).
                    * */
                    // let blot = Parchment.find(event.target);
                    // let index = blot.offset(quill.scroll);
                    comments.activeCommentId = comments[0];
                    console.log('comments.activeCommentId',comments.activeCommentId);
                    that.reflushComments(comments[0]);
                }
            }
        });
        this.initListener()
    }

    initListener() {
        this.quill.on('text-change', this.textChange)
    }

    /*
    * delta 首字符的话  只有  insert delete
    * 其他地方，会有 retain ，insert delete 两个
    * insert是往后插入的retain
    * delete是往前删除的retain
    *
    * */
    textChange = (delta, oldDelta, source) => {
        console.log('text change')
        let hasAttributes = false;
        delta.ops.forEach(item => {
            if (item.attributes) {
                if (item.attributes['comments']) {
                    hasAttributes = true;
                } else if (item.attributes['comments'] === null) {
                    hasAttributes = true;
                }
            }
        });
        if(hasAttributes){
            this.reflushComments();
        }
    };
    
    reflushComments = (activeCommentId = '') => {
        let _comments = [];
        $('span[data-comments]').toArray().forEach(item=>{
                let blot = Parchment.find(item);
                let index = blot.offset(this.quill.scroll);
                let {top,left,height,width} = this.quill.getBounds(index,0);
                let commentId = `${item.dataset['comments']}`;
                _comments.push({
                    index:index,
                    top:top,
                    left:left,
                    height:height,
                    width:width,
                    commentId:commentId
                });
                console.log('commentId === activeCommentId',commentId , activeCommentId)
                if(commentId === activeCommentId){
                    comments.activeCommentIndex = _comments.length-1;
                }
            });
            comments.list = _comments;
    };

}
