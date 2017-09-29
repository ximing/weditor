'use strict';

import './mention.scss';
import Quill from 'quill';
let Embed = Quill.import('blots/embed');

class Mention extends Embed {
    static create(value, x) {
        // debugger
        let node = super.create(value);
        node.setAttribute('sponsoruid', value.sponsoruid);
        node.setAttribute('receiveruid', value.receiveruid);
        node.setAttribute('name', value.name);
        if (window.userInfo && window.userInfo.uid == value.receiveruid) {
            node.setAttribute('data-me', 'true');
        }
        // debugger
        node.innerHTML = '@' + value.name;
        return node;
    }

    static formats(domNode) {
        let format = {};
        format.sponsoruid = domNode.getAttribute('sponsoruid');
        format.receiveruid = domNode.getAttribute('receiveruid');
        format.name = domNode.getAttribute('name');
        format.f = 'f';
        // debugger
        return format;
    }

    static value(node) {
        let opsInsert = {};
        opsInsert.sponsoruid = node.getAttribute('sponsoruid');
        opsInsert.receiveruid = node.getAttribute('receiveruid');
        opsInsert.name = node.getAttribute('name');
        opsInsert.v = 'v';
        // debugger
        return opsInsert;
    }

    format(name, value) {
        // if (name !== this.statics.blotName || !value) return super.format(name, value);
        // value = this.constructor.sanitize(value);
        // this.domNode.setAttribute('href', value);
    }
}
Mention.blotName = 'mention';
Mention.tagName = 'SPAN';
Mention.className = 'mention-embed';

export default Mention;
