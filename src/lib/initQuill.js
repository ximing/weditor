/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';
import Quill from 'quill';
import Delta from 'quill-delta';
import {ImageResize} from './modules/quill-image-resize-module';
import {LineHeightStyle} from './formats/lineHeight';

var SizeStyle = Quill.import('attributors/style/size');
var ColorStyle = Quill.import('attributors/style/color');
var BackgroundStyle = Quill.import('attributors/style/background');
var AlignStyle = Quill.import('attributors/style/align');

SizeStyle.whitelist = [];
ColorStyle.whitelist = null;
BackgroundStyle.whitelist = [
    'yellow', 'green', 'cyan', 'magenta', 'darkYellow', 'darkyellow',
    'darkGray', 'darkgray', 'lightGray', 'lightgray', 'black',
    'blue', 'red', 'darkBlue', 'darkblue', 'darkCyan', 'darkcyan',
    'darkGreen', 'darkgreen', 'darkMagenta', 'darkmagenta', 'darkRed',
    'darkred', 'white'];
AlignStyle.whitelist = ['right', 'center', 'justify', 'left'];

for (let i = 5; i <= 72; i++) {
    SizeStyle.whitelist.push(`${i}pt`);
    SizeStyle.whitelist.push(`${i}.5pt`);
}

Quill.register(SizeStyle, true);
Quill.register(ColorStyle, true);
Quill.register(BackgroundStyle, true);
Quill.register(AlignStyle, true);
Quill.register({
    'modules/imageResize': ImageResize
}, true);

Quill.register(LineHeightStyle);

var Clipboard = Quill.import('modules/clipboard');
class PlainClipboard extends Clipboard {
    // convert(html = null) {
    //     if (typeof html === 'string') {
    //         this.container.innerHTML = html;
    //     }
    //     let text = this.container.innerText;
    //     this.container.innerHTML = '';
    //     return new Delta().insert(text);
    // }

    convert(html) {
        if (typeof html === 'string') {
            this.container.innerHTML = html.replace(/\>\r?\n +\</g, '><'); // Remove spaces between tags
        }
        this.container.innerHTML = this.container.innerHTML
            .replace(/<pre/gi,'<div').replace(/<\/pre>/gi,"</div>");
        let [elementMatchers, textMatchers] = this.prepareMatching();
        let delta = traverse(this.container, elementMatchers, textMatchers);
        // Remove trailing newline
        if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
            delta = delta.compose(new Delta().retain(delta.length() - 1).delete(1));
        }
        console.log('convert', this.container.innerHTML, delta);
        this.container.innerHTML = '';
        return delta;
    }

    onPaste(e) {
        if (e.defaultPrevented || !this.quill.isEnabled()) return;
        let range = this.quill.getSelection();
        let delta = new Delta().retain(range.index);
        let scrollTop = this.quill.scrollingContainer.scrollTop;
        this.container.style.position = 'fixed';
        this.container.style.zIndex = '-1';
        this.container.focus();
        this.quill.selection.update(Quill.sources.SILENT);
        setTimeout(() => {
            delta = delta.concat(this.convert()).delete(range.length);
            this.quill.updateContents(delta, Quill.sources.USER);
      // range.length contributes to delta.length()
            this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
            this.quill.scrollingContainer.scrollTop = scrollTop;
            this.quill.focus();
        }, 1);
    }
};
const DOM_KEY = '__ql-matcher';

function traverse(node, elementMatchers, textMatchers) {  // Post-order
    if (node.nodeType === node.TEXT_NODE) {
        return textMatchers.reduce(function(delta, matcher) {
            return matcher(node, delta);
        }, new Delta());
    } else if (node.nodeType === node.ELEMENT_NODE) {
        return [].reduce.call(node.childNodes || [], (delta, childNode) => {
            let childrenDelta = traverse(childNode, elementMatchers, textMatchers);
            if (childNode.nodeType === node.ELEMENT_NODE) {
                childrenDelta = elementMatchers.reduce(function(childrenDelta, matcher) {
                    return matcher(childNode, childrenDelta);
                }, childrenDelta);
                childrenDelta = (childNode[DOM_KEY] || []).reduce(function(childrenDelta, matcher) {
                    return matcher(childNode, childrenDelta);
                }, childrenDelta);
            }
            return delta.concat(childrenDelta);
        }, new Delta());
    } else {
        return new Delta();
    }
}


function deltaEndsWith(delta, text) {
    let endText = "";
    for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
        let op  = delta.ops[i];
        if (typeof op.insert !== 'string') break;
        endText = op.insert + endText;
    }
    return endText.slice(-1*text.length) === text;
}


Quill.register('modules/clipboard', PlainClipboard, true);

