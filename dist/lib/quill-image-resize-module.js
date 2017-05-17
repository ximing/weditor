/**
 * Created by yeanzhi on 17/3/28.
 */
'use strict';
/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageResize = exports.ImageResize = function () {
    function ImageResize(quill) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, ImageResize);

        // save the quill reference and options
        this.quill = quill;
        this.options = options;
        // bind handlers to this instance
        this.handleClick = this.handleClick.bind(this);
        this.handleMousedown = this.handleMousedown.bind(this);
        this.handleMouseup = this.handleMouseup.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.checkImage = this.checkImage.bind(this);
        // track resize handles
        this.boxes = [];
        // disable native image resizing on firefox
        document.execCommand('enableObjectResizing', false, 'false');
        // respond to clicks inside the editor
        this.quill.root.addEventListener('click', this.handleClick, false);
    }

    _createClass(ImageResize, [{
        key: 'handleClick',
        value: function handleClick(evt) {
            if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() == 'IMG') {
                if (this.img === evt.target) {
                    // we are already focused on this image
                    return;
                }
                if (this.img) {
                    // we were just focused on another image
                    this.hide();
                }
                // clicked on an image inside the editor
                this.show(evt.target);
            } else if (this.img) {
                // clicked on a non image
                this.hide();
            }
        }
    }, {
        key: 'show',
        value: function show(img) {
            // keep track of this img element
            this.img = img;
            this.showResizers();
            this.showSizeDisplay();
            // position the resize handles at the corners
            var rect = this.img.getBoundingClientRect();
            this.positionBoxes(rect);
            this.positionSizeDisplay(rect);
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.hideResizers();
            this.hideSizeDisplay();
            this.img = undefined;
        }
    }, {
        key: 'showResizers',
        value: function showResizers() {
            // prevent spurious text selection
            this.setUserSelect('none');
            // add 4 resize handles
            this.addBox('nwse-resize'); // top left
            this.addBox('nesw-resize'); // top right
            this.addBox('nwse-resize'); // bottom right
            this.addBox('nesw-resize'); // bottom left
            // listen for the image being deleted or moved
            document.addEventListener('keyup', this.checkImage, true);
            this.quill.root.addEventListener('input', this.checkImage, true);
        }
    }, {
        key: 'hideResizers',
        value: function hideResizers() {
            // stop listening for image deletion or movement
            document.removeEventListener('keyup', this.checkImage);
            this.quill.root.removeEventListener('input', this.checkImage);
            // reset user-select
            this.setUserSelect('');
            this.setCursor('');
            // remove boxes
            this.boxes.forEach(function (box) {
                return document.body.removeChild(box);
            });
            // release memory
            this.dragBox = undefined;
            this.dragStartX = undefined;
            this.preDragWidth = undefined;
            this.boxes = [];
        }
    }, {
        key: 'addBox',
        value: function addBox(cursor) {
            // create div element for resize handle
            var box = document.createElement('div');
            // apply styles
            var styles = {
                position: 'absolute',
                height: '12px',
                width: '12px',
                backgroundColor: 'white',
                border: '1px solid #777',
                boxSizing: 'border-box',
                opacity: '0.80',
                cursor: cursor
            };
            this.extend(box.style, styles, this.options.handleStyles || {});
            // listen for mousedown on each box
            box.addEventListener('mousedown', this.handleMousedown, false);
            // add drag handle to document
            document.body.appendChild(box);
            // keep track of drag handle
            this.boxes.push(box);
        }
    }, {
        key: 'extend',
        value: function extend(destination) {
            for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                sources[_key - 1] = arguments[_key];
            }

            sources.forEach(function (source) {
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        destination[prop] = source[prop];
                    }
                }
            });
            return destination;
        }
    }, {
        key: 'positionBoxes',
        value: function positionBoxes(rect) {
            var _this = this;

            // set the top and left for each drag handle
            [{ left: rect.left - 6, top: rect.top - 6 }, // top left
            { left: rect.left + rect.width - 6, top: rect.top - 6 }, // top right
            { left: rect.left + rect.width - 6, top: rect.top + rect.height - 6 }, // bottom right
            { left: rect.left - 6, top: rect.top + rect.height - 6 } // bottom left
            ].forEach(function (pos, idx) {
                _this.extend(_this.boxes[idx].style, {
                    top: Math.round(pos.top + window.pageYOffset) + 'px',
                    left: Math.round(pos.left + window.pageXOffset) + 'px'
                });
            });
        }
    }, {
        key: 'handleMousedown',
        value: function handleMousedown(evt) {
            // note which box
            this.dragBox = evt.target;
            // note starting mousedown position
            this.dragStartX = evt.clientX;
            // store the width before the drag
            this.preDragWidth = this.img.width || this.img.naturalWidth;
            // set the proper cursor everywhere
            this.setCursor(this.dragBox.style.cursor);
            // listen for movement and mouseup
            document.addEventListener('mousemove', this.handleDrag, false);
            document.addEventListener('mouseup', this.handleMouseup, false);
        }
    }, {
        key: 'handleMouseup',
        value: function handleMouseup() {
            // reset cursor everywhere
            this.setCursor('');
            // stop listening for movement and mouseup
            document.removeEventListener('mousemove', this.handleDrag);
            document.removeEventListener('mouseup', this.handleMouseup);
        }
    }, {
        key: 'handleDrag',
        value: function handleDrag(evt) {
            if (!this.img) {
                // image not set yet
                return;
            }
            // update image size
            if (this.dragBox == this.boxes[0] || this.dragBox == this.boxes[3]) {
                // left-side resize handler; draging right shrinks image
                this.img.width = Math.round(this.preDragWidth - evt.clientX - this.dragStartX);
            } else {
                // right-side resize handler; draging right enlarges image
                this.img.width = Math.round(this.preDragWidth + evt.clientX - this.dragStartX);
            }
            // reposition the drag handles around the image
            var rect = this.img.getBoundingClientRect();
            this.positionBoxes(rect);
            this.positionSizeDisplay(rect);
        }
    }, {
        key: 'setUserSelect',
        value: function setUserSelect(value) {
            var _this2 = this;

            ['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'].forEach(function (prop) {
                // set on contenteditable element and <html>
                _this2.quill.root.style[prop] = value;
                document.documentElement.style[prop] = value;
            });
        }
    }, {
        key: 'setCursor',
        value: function setCursor(value) {
            [document.body, this.img, this.quill.root].forEach(function (el) {
                return el.style.cursor = value;
            });
        }
    }, {
        key: 'checkImage',
        value: function checkImage() {
            if (this.img) {
                this.hide();
            }
        }
    }, {
        key: 'showSizeDisplay',
        value: function showSizeDisplay() {
            if (!this.options.displaySize) {
                return;
            }
            this.display = document.createElement('div');
            // apply styles
            var styles = {
                position: 'absolute',
                font: '12px/1.0 Arial, Helvetica, sans-serif',
                padding: '4px 8px',
                textAlign: 'center',
                backgroundColor: 'white',
                color: '#333',
                border: '1px solid #777',
                boxSizing: 'border-box',
                opacity: '0.80',
                cursor: 'default'
            };
            this.extend(this.display.style, styles, this.options.displayStyles || {});
            document.body.appendChild(this.display);
        }
    }, {
        key: 'hideSizeDisplay',
        value: function hideSizeDisplay() {
            if (this.display) {
                document.body.removeChild(this.display);
            }
            this.display = undefined;
        }
    }, {
        key: 'positionSizeDisplay',
        value: function positionSizeDisplay(rect) {
            if (!this.display || !this.img) {
                return;
            }
            var size = this.getCurrentSize();
            this.display.innerHTML = size.join(' &times; ');
            if (size[0] > 120 && size[1] > 30) {
                // position on top of image
                var dispRect = this.display.getBoundingClientRect();
                this.extend(this.display.style, {
                    left: Math.round(rect.left + rect.width + window.pageXOffset - dispRect.width - 8) + 'px',
                    top: Math.round(rect.top + rect.height + window.pageYOffset - dispRect.height - 8) + 'px'
                });
            } else {
                // position off bottom right
                this.extend(this.display.style, {
                    left: Math.round(rect.left + rect.width + window.pageXOffset + 8) + 'px',
                    top: Math.round(rect.top + rect.height + window.pageYOffset + 8) + 'px'
                });
            }
        }
    }, {
        key: 'getCurrentSize',
        value: function getCurrentSize() {
            return [this.img.width, Math.round(this.img.width / this.img.naturalWidth * this.img.naturalHeight)];
        }
    }]);

    return ImageResize;
}();