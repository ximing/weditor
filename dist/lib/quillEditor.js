/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resize = exports.initQuillEditor = exports.setLinkBubble = exports.getEditorBoundingClientRect = exports.getDom = exports.getEditor = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

require('./initQuill');

var _initHotKey = require('./initHotKey');

var _initHotKey2 = _interopRequireDefault(_initHotKey);

var _insert = require('../model/insert');

var _insert2 = _interopRequireDefault(_insert);

var _format = require('../model/format');

var _format2 = _interopRequireDefault(_format);

var _editor = require('../model/editor');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var quillEditor = null;
var quillDom = null;
var $quillEditorDom = null;
var $quillContainer = null;
var $weditorBody = null;

var linkBubble = {
    height: 95,
    width: 380
};
var getEditor = exports.getEditor = function getEditor() {
    return quillEditor;
};

var getDom = exports.getDom = function getDom() {
    return quillDom;
};

var getEditorBoundingClientRect = exports.getEditorBoundingClientRect = function getEditorBoundingClientRect() {
    return quillDom.getBoundingClientRect();
};

var setLinkBubble = exports.setLinkBubble = function setLinkBubble(index) {
    // const {left, top, height} = getEditor().getBounds(index);
    // let linkLeft = getEditorBoundingClientRect().left + left;
    // let linkTop = getEditorBoundingClientRect().top + top + height;
    // if (linkLeft + linkBubble.width >= window.innerWidth) {
    //     linkLeft = linkLeft - linkBubble.width;
    // }
    // if (linkTop + linkBubble.height >= window.innerHeight) {
    //     linkTop = linkTop - linkBubble.height - height - 10;
    // }
    // console.log(top,linkTop,height,getEditorBoundingClientRect().top);
    // insert.linkPosition = {
    //     left: linkLeft,
    //     top: linkTop
    // };
    //======================badk end========================
    var _getEditor$getBounds = getEditor().getBounds(index),
        left = _getEditor$getBounds.left,
        top = _getEditor$getBounds.top,
        height = _getEditor$getBounds.height;
    //120 是body 到浏览器顶部的高度


    console.log('link left', left, window.innerWidth);
    if (top + getEditorBoundingClientRect().top > window.innerHeight - linkBubble.height - 20) {
        _insert2.default.linkPosition = {
            left: left + 430 > window.innerWidth ? window.innerWidth - 430 : left,
            top: top,
            isAbove: true,
            textHeight: height
        };
    } else {
        _insert2.default.linkPosition = {
            left: left + 430 > window.innerWidth ? window.innerWidth - 430 : left,
            top: top,
            isAbove: false,
            textHeight: height
        };
    }
};

var initQuillEditor = exports.initQuillEditor = function initQuillEditor(dom, options) {
    quillDom = dom;
    $quillContainer = $('.content-container');
    quillEditor = new _quill2.default(dom, {
        modules: {
            toolbar: {
                container: '#toolbarOpver',
                handlers: {
                    'link': function link(value) {
                        if (value) {
                            if (_insert2.default.openLinkDialog) {
                                _insert2.default.openLinkDialog = false;
                                _insert2.default.linkTitle = null;
                                _insert2.default.linkUrl = null;
                            } else if (_editor2.default.range) {
                                var _editor$range = _editor2.default.range,
                                    index = _editor$range.index,
                                    length = _editor$range.length;

                                _insert2.default.openLinkDialog = true;
                                _insert2.default.linkTitle = getEditor().getText(index, length);
                                _insert2.default.linkUrl = null;
                                setLinkBubble(index);
                            }
                            _insert2.default.linkSelection = _editor2.default.range;
                            _insert2.default.isCreateNewLink = true;
                        } else {
                            var _editor$range2 = _editor2.default.range,
                                _index = _editor$range2.index,
                                _length = _editor$range2.length;

                            var _quillEditor$getLeaf = quillEditor.getLeaf(_index),
                                _quillEditor$getLeaf2 = _slicedToArray(_quillEditor$getLeaf, 2),
                                leaf = _quillEditor$getLeaf2[0],
                                offset = _quillEditor$getLeaf2[1];

                            var LinkIndex = quillEditor.getIndex(leaf);
                            //getEditor().format('link', false);
                            getEditor().removeFormat(LinkIndex, leaf.text.length, 'user');
                            _insert2.default.isCreateNewLink = false;
                        }
                    },
                    'image': function image(args) {
                        // var range = this.quill.getSelection();
                        // var value = prompt('What is the image URL');
                        _insert2.default.imageSelection = getEditor().getSelection();
                        _insert2.default.openImageDialog = true;
                    }
                }
            },
            history: {
                delay: 1000,
                maxStack: 500,
                userOnly: true
            },
            //'syntax': true        // Enable with default configuration
            //imageDrop: true,
            imageResize: {
                container: '.weditor-body',
                imgSelection: '.img-selection',
                top: 102,
                left: 0
            }
        },
        placeholder: '输入文档...',
        //theme: 'snow',
        scrollingContainer: document.querySelector('.weditor-body')
        // scrollingContainer: document.querySelector('.ql-container')
    });
    $quillEditorDom = $(quillDom).find('.ql-editor');
    $weditorBody = $('.weditor-body');
    // quillEditor.on('text-change', (range, oldRange, source) => {
    //     resize();
    // });
    quillEditor.on('editor-change', function (eventName) {
        if (eventName === 'text-change') {
            _editor2.default.focus = true;
            if (_editor2.default.range) {
                _editor2.default.format = quillEditor.getFormat(_editor2.default.range) || {};
            } else {
                _editor2.default.format = {};
            }
        } else if (eventName === 'selection-change') {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            // args[0] will be old range
            var range = args[0],
                oldRange = args[1],
                source = args[2];

            if (range) {
                _editor2.default.range = range;
                _editor2.default.focus = true;
                _editor2.default.format = quillEditor.getFormat(range) || {};
                if (_editor2.default.format.link) {
                    var _quillEditor$getLeaf3 = quillEditor.getLeaf(range.index),
                        _quillEditor$getLeaf4 = _slicedToArray(_quillEditor$getLeaf3, 2),
                        leaf = _quillEditor$getLeaf4[0],
                        offset = _quillEditor$getLeaf4[1];
                    // let linkIndex = quillEditor.getIndex(leaf);
                    //在文本最开始的时候，拿不到 link format 所以不用判断左区间的问题了。


                    if (offset < leaf.length()) {
                        _insert2.default.openLinkDialog = true;
                        _insert2.default.linkUrl = _editor2.default.format.link;
                        _insert2.default.isReadOnlyLink = true;
                        _insert2.default.linkTitle = leaf.text;
                        setLinkBubble(range.index);
                    }
                }
                if (range.length !== 0) {
                    //处理格式刷
                    if (_format2.default.currentFormat) {
                        var index = range.index,
                            length = range.length;

                        quillEditor.removeFormat(index, length, 'user');
                        quillEditor.formatLine(index, length, _format2.default.currentFormat, 'user');
                        quillEditor.formatText(index, length, _format2.default.currentFormat, 'user');

                        _format2.default.currentFormat = null;
                    }
                }
            } else {
                console.log('blur');
            }
        }
    });

    // quillEditor.on('text-change', function (delta, oldDelta, source) {
    //     editor.focus = true;
    //     if (editor.range) {
    //         editor.format = quillEditor.getFormat(editor.range) || {};
    //     } else {
    //         editor.format = {};
    //     }
    // });
    // quillEditor.on('selection-change', (range, oldRange, source) => {
    //     console.log('selection-change', range, oldRange,source);
    //     if (range) {
    //         editor.range = range;
    //         editor.focus = true;
    //         editor.format = quillEditor.getFormat(range) || {};
    //         if (editor.format.link) {
    //             let [leaf, offset] = quillEditor.getLeaf(range.index);
    //             // let linkIndex = quillEditor.getIndex(leaf);
    //             //在文本最开始的时候，拿不到 link format 所以不用判断左区间的问题了。
    //             if (offset < leaf.length()) {
    //                 insert.openLinkDialog = true;
    //                 insert.linkUrl = editor.format.link;
    //                 insert.isReadOnlyLink = true;
    //                 insert.linkTitle = leaf.text;
    //                 setLinkBubble(range.index)
    //             }
    //
    //         }
    //         if (range.length !== 0) {
    //             //处理格式刷
    //             if (format.currentFormat) {
    //                 const {index, length} = range;
    //                 quillEditor.removeFormat(index, length, 'user');
    //                 quillEditor.formatLine(index, length, format.currentFormat, 'user');
    //                 quillEditor.formatText(index, length, format.currentFormat, 'user');
    //
    //                 format.currentFormat = null;
    //             }
    //         }
    //     } else {
    //         console.log('blur');
    //     }
    // });

    (0, _initHotKey2.default)(quillEditor);

    //$(window).on('resize', resize);
    //fix有图片的时候高度问题
    // $( window ).on("load", resize);
    return quillEditor;
};
var resize = exports.resize = function resize() {
    // console.log('resize')
    // let scrollHeight = $quillEditorDom[0].scrollHeight;
    // console.log('scrollHeight',scrollHeight);
    // if ($weditorBody.height() < scrollHeight) {
    //     $quillContainer.height(scrollHeight);
    // } else {
    //     $quillContainer.height($weditorBody.height() - 50);
    // }
};