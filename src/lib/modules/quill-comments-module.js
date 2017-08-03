/**
 * Created by yeanzhi on 17/8/3.
 */
'use strict';
import comments from '../../model/comments';

const $ = window.$;

export class Comments {
    constructor(quill, options = {}) {
        $(quill.root).on('click', 'span[data-comments]', function (e) {
            if ($(this).data('comments')) {
                let comments = `${$(this).data('comments')}`.split(',');
                if(comments[0]){
                    let range = quill.getSelection();
                    comments.range = range;
                    comments.activeComment = comments[0];
                }
            }
        });
    }
}
