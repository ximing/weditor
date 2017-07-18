/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

var _quillDelta = require('quill-delta');

var _quillDelta2 = _interopRequireDefault(_quillDelta);

var _quillImageResizeModule = require('./quill-image-resize-module');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Clipboard = _quill2.default.import('modules/clipboard');

var PlainClipboard = function (_Clipboard) {
    _inherits(PlainClipboard, _Clipboard);

    function PlainClipboard() {
        _classCallCheck(this, PlainClipboard);

        return _possibleConstructorReturn(this, (PlainClipboard.__proto__ || Object.getPrototypeOf(PlainClipboard)).apply(this, arguments));
    }

    _createClass(PlainClipboard, [{
        key: 'convert',
        value: function convert() {
            var html = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (typeof html === 'string') {
                this.container.innerHTML = html;
            }
            var text = this.container.innerText;
            this.container.innerHTML = '';
            return new _quillDelta2.default().insert(text);
        }
    }]);

    return PlainClipboard;
}(Clipboard);

_quill2.default.register('modules/clipboard', PlainClipboard, true);