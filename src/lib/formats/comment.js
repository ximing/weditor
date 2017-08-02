/**
 * Created by yeanzhi on 17/7/19.
 */
'use strict';
import Quill from 'quill';
const Parchment = Quill.import('parchment');
let config = {
    scope: Parchment.Scope.INLINE,
    whitelist: null
};
let CommentAttribute = new Parchment.Attributor.Attribute('comment', 'data-comment', config);
export { CommentAttribute };
