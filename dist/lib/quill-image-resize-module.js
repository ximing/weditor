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
exports.ImageResize = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interactjs = require('interactjs');

var _interactjs2 = _interopRequireDefault(_interactjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageResize = exports.ImageResize = function () {
    function ImageResize(quill) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, ImageResize);

        console.log(options);
        // save the quill reference and options
        this.quill = quill;
        this.options = options;
        var imageRect = {};
        (0, _interactjs2.default)('.img-selection').resizable({
            // preserveAspectRatio: true,
            edges: { left: true, right: true, bottom: true, top: true }
        }).on('resizemove', function (event) {
            var target = event.target;
            if (_this.img) {
                _this.img.style.width = event.rect.width + 'px';
                _this.img.style.height = event.rect.height + 'px';
                imageRect = event.rect;
                var rect = _this.img.getBoundingClientRect();
                var rootRect = _this.quill.root.getBoundingClientRect();

                target.style.top = rect.top - rootRect.top + 'px';
                target.style.left = rect.left - rootRect.left + 'px';
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';
            }
        }).on('resizeend', function (event) {
            _this.img.width = imageRect.width || undefined;
            _this.img.height = imageRect.height || undefined;
        });
        this.handleClick = this.handleClick.bind(this);
        this.quill.root.addEventListener('click', this.handleClick, false);
    }

    _createClass(ImageResize, [{
        key: 'handleClick',
        value: function handleClick(evt) {
            if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'IMG') {
                if (this.img === evt.target) {
                    return;
                }
                if (this.img) {
                    this.hide();
                }
                this.show(evt.target);
            } else if (this.img) {
                this.hide();
            }
        }
    }, {
        key: 'show',
        value: function show(img) {
            // keep track of this img element
            this.img = img;
            var rect = this.img.getBoundingClientRect();
            var rootRect = this.quill.root.getBoundingClientRect();
            this.showBox(rect, rootRect);
        }
    }, {
        key: 'showBox',
        value: function showBox(rect, rootRect) {
            $(this.options.imgSelection).css('top', rect.top - rootRect.top).css('left', rect.left - rootRect.left).css('width', rect.width).css('height', rect.height).show();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.img = undefined;
            $(this.options.imgSelection).hide();
        }
    }]);

    return ImageResize;
}();