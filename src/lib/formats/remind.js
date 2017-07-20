/**
 * Created by yeanzhi on 17/7/18.
 */
'use strict';
import Quill from 'quill';
let Embed = Quill.import('blots/block/embed');
class Remind extends Embed {
    static create(value) {
        let node = super.create(value);
        // give it some margin
        //node.setAttribute('style', "height:0px; margin-top:10px; margin-bottom:10px;");
        return node;
    }
}
Remind.blotName = 'remind'; //now you can use .ql-hr classname in your toolbar
Remind.className = 'ql-span';
Remind.tagName = 'span';
export default Remind;
