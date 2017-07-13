/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

var _quillDelta = require('quill-delta');

var _quillDelta2 = _interopRequireDefault(_quillDelta);

var _quillImageResizeModule = require('./quill-image-resize-module');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { ImageDrop } from './quill-image-drop-module';
// Quill.register('modules/imageDrop', ImageDrop);
_quill2.default.register('modules/imageResize', _quillImageResizeModule.ImageResize);

var SizeStyle = _quill2.default.import('attributors/style/size');
var ColorStyle = _quill2.default.import('attributors/style/color');
var BackgroundStyle = _quill2.default.import('attributors/style/background');
var AlignStyle = _quill2.default.import('attributors/style/align');

SizeStyle.whitelist = [];
ColorStyle.whitelist = null;
BackgroundStyle.whitelist = ['yellow', 'green', 'cyan', 'magenta', 'darkYellow', 'darkyellow', 'darkGray', 'darkgray', 'lightGray', 'lightgray', 'black', 'blue', 'red', 'darkBlue', 'darkblue', 'darkCyan', 'darkcyan', 'darkGreen', 'darkgreen', 'darkMagenta', 'darkmagenta', 'darkRed', 'darkred', 'white'];
AlignStyle.whitelist = ['right', 'center', 'justify', 'left'];
for (var i = 5; i <= 72; i++) {
    SizeStyle.whitelist.push(i + 'pt');
    SizeStyle.whitelist.push(i + '.5pt');
}
_quill2.default.register(SizeStyle, true);
_quill2.default.register(ColorStyle, true);
_quill2.default.register(BackgroundStyle, true);
_quill2.default.register(AlignStyle, true);

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