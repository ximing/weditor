/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';
import Quill from 'quill';
import Delta from 'quill-delta';
import {ImageResize} from './quill-image-resize-module';
// import { ImageDrop } from './quill-image-drop-module';
// Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

var SizeStyle = Quill.import('attributors/style/size');
var ColorStyle = Quill.import('attributors/style/color');
var BackgroundStyle = Quill.import('attributors/style/background');
var AlignStyle = Quill.import('attributors/style/align');

SizeStyle.whitelist = [];
ColorStyle.whitelist = null;
BackgroundStyle.whitelist = ['yellow','green','cyan','magenta','darkYellow','darkGray','lightGray','black',
    'blue','red','darkBlue','darkCyan','darkGreen','darkMagenta','darkRed'];
AlignStyle.whitelist = ['right', 'center', 'justify','left'];
for (let i = 5; i <= 72; i++) {
    SizeStyle.whitelist.push(`${i}pt`);
    SizeStyle.whitelist.push(`${i}.5pt`);
}
Quill.register(SizeStyle, true);
Quill.register(ColorStyle, true);
Quill.register(BackgroundStyle, true);
Quill.register(AlignStyle, true);

// var Clipboard = Quill.import('modules/clipboard');
// class PlainClipboard extends Clipboard {
//     convert(html = null) {
//         if (typeof html === 'string') {
//             this.container.innerHTML = html;
//         }
//         return new Delta().insert(this.container.innerText);
//     }
// }
//
// Quill.register('modules/clipboard', PlainClipboard, true);
