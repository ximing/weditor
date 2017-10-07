/**
 * Created by yeanzhi on 17/3/20.
 */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

var _quillDelta = require('quill-delta');

var _quillDelta2 = _interopRequireDefault(_quillDelta);

var _quillImageResizeModule = require('./modules/quill-image-resize-module');

var _lineHeight = require('./formats/lineHeight');

var _mention = require('./formats/mention');

var _mention2 = _interopRequireDefault(_mention);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
_quill2.default.register(_mention2.default, true);
_quill2.default.register({
    'modules/imageResize': _quillImageResizeModule.ImageResize
}, true);

_quill2.default.register(_lineHeight.LineHeightStyle);

var Clipboard = _quill2.default.import('modules/clipboard');

var PlainClipboard = function (_Clipboard) {
    _inherits(PlainClipboard, _Clipboard);

    function PlainClipboard() {
        _classCallCheck(this, PlainClipboard);

        return _possibleConstructorReturn(this, (PlainClipboard.__proto__ || Object.getPrototypeOf(PlainClipboard)).apply(this, arguments));
    }

    _createClass(PlainClipboard, [{
        key: 'convert',

        // convert(html = null) {
        //     if (typeof html === 'string') {
        //         this.container.innerHTML = html;
        //     }
        //     let text = this.container.innerText;
        //     this.container.innerHTML = '';
        //     return new Delta().insert(text);
        // }

        value: function convert(html) {
            if (typeof html === 'string') {
                this.container.innerHTML = html.replace(/\>\r?\n +\</g, '><'); // Remove spaces between tags
            }
            this.container.innerHTML = this.container.innerHTML.replace(/<pre/gi, '<div').replace(/<\/pre>/gi, '</div>');

            var _prepareMatching = this.prepareMatching(),
                _prepareMatching2 = _slicedToArray(_prepareMatching, 2),
                elementMatchers = _prepareMatching2[0],
                textMatchers = _prepareMatching2[1];

            var delta = traverse(this.container, elementMatchers, textMatchers);
            // Remove trailing newline
            if (deltaEndsWith(delta, '\n') && delta.ops[delta.ops.length - 1].attributes == null) {
                delta = delta.compose(new _quillDelta2.default().retain(delta.length() - 1).delete(1));
            }
            console.log('convert', this.container.innerHTML, delta);
            this.container.innerHTML = '';
            return delta;
        }
    }, {
        key: 'onPaste',
        value: function onPaste(e) {
            var _this2 = this;

            if (e.defaultPrevented || !this.quill.isEnabled()) return;
            var range = this.quill.getSelection();
            var delta = new _quillDelta2.default().retain(range.index);
            var scrollTop = this.quill.scrollingContainer.scrollTop;
            this.container.style.position = 'fixed';
            this.container.style.zIndex = '-1';
            this.container.focus();
            this.quill.selection.update(_quill2.default.sources.SILENT);
            setTimeout(function () {
                delta = delta.concat(_this2.convert()).delete(range.length);
                _this2.quill.updateContents(delta, _quill2.default.sources.USER);
                // range.length contributes to delta.length()
                _this2.quill.setSelection(delta.length() - range.length, _quill2.default.sources.SILENT);
                _this2.quill.scrollingContainer.scrollTop = scrollTop;
                _this2.quill.focus();
            }, 1);
        }
    }]);

    return PlainClipboard;
}(Clipboard);

;
var DOM_KEY = '__ql-matcher';

function traverse(node, elementMatchers, textMatchers) {
    // Post-order
    if (node.nodeType === node.TEXT_NODE) {
        return textMatchers.reduce(function (delta, matcher) {
            return matcher(node, delta);
        }, new _quillDelta2.default());
    } else if (node.nodeType === node.ELEMENT_NODE) {
        return [].reduce.call(node.childNodes || [], function (delta, childNode) {
            var childrenDelta = traverse(childNode, elementMatchers, textMatchers);
            if (childNode.nodeType === node.ELEMENT_NODE) {
                childrenDelta = elementMatchers.reduce(function (childrenDelta, matcher) {
                    return matcher(childNode, childrenDelta);
                }, childrenDelta);
                childrenDelta = (childNode[DOM_KEY] || []).reduce(function (childrenDelta, matcher) {
                    return matcher(childNode, childrenDelta);
                }, childrenDelta);
            }
            return delta.concat(childrenDelta);
        }, new _quillDelta2.default());
    } else {
        return new _quillDelta2.default();
    }
}

function deltaEndsWith(delta, text) {
    var endText = '';
    for (var _i2 = delta.ops.length - 1; _i2 >= 0 && endText.length < text.length; --_i2) {
        var op = delta.ops[_i2];
        if (typeof op.insert !== 'string') break;
        endText = op.insert + endText;
    }
    return endText.slice(-1 * text.length) === text;
}

_quill2.default.register('modules/clipboard', PlainClipboard, true);