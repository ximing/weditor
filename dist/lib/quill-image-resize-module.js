/**
 * Created by yeanzhi on 17/3/28.
 */
'use strict';
/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
import interact from 'interactjs';

export class ImageResize {

    constructor(quill, options = {}) {
        console.log(options)
        // save the quill reference and options
        this.quill = quill;
        this.options = options;
        interact('.img-selection')
            .resizable({
                // preserveAspectRatio: true,
                edges: {left: true, right: true, bottom: true, top: true}
            })
            .on('resizemove', (event) => {
                var target = event.target;
                if (this.img) {
                    this.img.style.width = event.rect.width + 'px';
                    this.img.style.height = event.rect.height + 'px';

                    const rect = this.img.getBoundingClientRect();
                    const rootRect = this.quill.root.getBoundingClientRect();

                    target.style.top = `${rect.top - rootRect.top}px`;
                    target.style.left = `${rect.left - rootRect.left}px`;
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';
                }
            })
            .on('resizestart', (event) => {
            });
        this.handleClick = this.handleClick.bind(this);
        this.quill.root.addEventListener('click', this.handleClick, false);
    }

    handleClick(evt) {
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

    show(img) {
        // keep track of this img element
        this.img = img;
        const rect = this.img.getBoundingClientRect();
        const rootRect = this.quill.root.getBoundingClientRect();
        this.showBox(rect, rootRect)
    }

    showBox(rect, rootRect) {
        $(this.options.imgSelection)
            .css('top', rect.top - rootRect.top)
            .css('left', rect.left - rootRect.left)
            .css('width', rect.width)
            .css('height', rect.height)
            .show();

    }

    hide() {
        this.img = undefined;
        $(this.options.imgSelection).hide()
    }

}
