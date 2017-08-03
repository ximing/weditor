/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';
import Quill from 'quill';
import Delta from 'quill-delta';
import {ImageResize} from './modules/quill-image-resize-module';
import {Comments} from './modules/quill-comments-module';
import {LineHeightStyle} from './formats/lineHeight';
import {CommentsAttribute} from './formats/comments';

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
    'modules/imageResize': ImageResize,
    'modules/comments': Comments
}, true);
Quill.register(LineHeightStyle);
Quill.register(CommentsAttribute);

var Clipboard = Quill.import('modules/clipboard');
class PlainClipboard extends Clipboard {
    convert(html = null) {
        if (typeof html === 'string') {
            this.container.innerHTML = html;
        }
        let text = this.container.innerText;
        this.container.innerHTML = '';
        return new Delta().insert(text);
    }
};
Quill.register('modules/clipboard', PlainClipboard, true);
