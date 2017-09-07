/**
 * Created by yeanzhi on 17/3/28.
 */
'use strict';
/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
import React from 'react';
import interact from 'interactjs';
import Parchment from 'parchment';
import layer from '../../lib/layer';
const $ = window.$;
export class ImageResize {

    constructor(quill, options = {}) {
        console.log(options);
        // save the quill reference and options
        this.quill = quill;
        this.options = options;
        let imageRect = {};
        if(!options.readOnly){
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
                        imageRect = event.rect;
                        const rect = this.img.getBoundingClientRect();
                        const rootRect = this.quill.root.getBoundingClientRect();

                        target.style.top = `${rect.top - rootRect.top}px`;
                        target.style.left = `${rect.left - rootRect.left}px`;
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';
                    }
                })
                .on('resizeend', (event) => {
                    this.img.width = imageRect.width || undefined;
                    this.img.height = imageRect.height  || undefined;
                });
            this.handleClick = this.handleClick.bind(this);
            this.quill.root.addEventListener('click', this.handleClick, false);
            $(window).on('resize',this.onWindowResize);
            layer.addFrontendMarker(function (props) {
                return (
                    <div className="img-selection">
                        <div className="docs-squarehandleselectionbox-handle docx-selection-topleft"></div>
                        <div className="docs-squarehandleselectionbox-handle docx-selection-topright"></div>
                        <div className="docs-squarehandleselectionbox-handle docx-selection-bottomleft"></div>
                        <div className="docs-squarehandleselectionbox-handle docx-selection-bottomright"></div>
                    </div>
                );
            });
        }

    }

    onWindowResize = ()=>{
        this.hide();
    };

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
        this.showBox(rect, rootRect);
        // 移动游标到图片右侧
        let blot = Parchment.find(img);
        let index = blot.offset(this.quill.scroll);
        console.log('image index', index);
        this.quill.setSelection(index + 1, 0);
        //鼠标点击，删除键等操作的时候，去掉选中态
        this.quill.once('editor-change',()=>{this.hide();});
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
        $(this.options.imgSelection).hide();
    }

}
