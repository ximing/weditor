/**
 * Created by yeanzhi on 17/4/2.
 */
'use strict';
export default function (quill) {
    quill.keyboard.addBinding({
        key: 'b',
        shortKey: true
    }, function(range, context) {
        this.quill.formatText(range, 'bold', !context.format.bold,'user');
    });
    quill.keyboard.addBinding({
        key: 'i',
        shortKey: true
    }, function(range, context) {
        this.quill.formatText(range, 'italic', !context.format.italic,'user');
    });
    quill.keyboard.addBinding({
        key: 'u',
        shortKey: true
    }, function(range, context) {
        this.quill.formatText(range, 'underline', !context.format.underline,'user');
    });
    quill.keyboard.addBinding({
        key: 's',
        shortKey: true,
        shiftKey: true
    }, function(range, context) {
        this.quill.formatText(range, 'strike', !context.format.strike,'user');
    });
    quill.keyboard.addBinding({
        key: 'u',
        shortKey: true,
        shiftKey: true
    }, function(range, context) {
        if(!context.format.list){
            this.quill.formatLine(range, 'list', 'bullet','user');
        }else{
            this.quill.formatLine(range, 'list', false,'user');
        }    });
    quill.keyboard.addBinding({
        key: 'l',
        shortKey: true,
        shiftKey: true
    }, function(range, context) {
        if(!context.format.list){
            this.quill.formatLine(range, 'list', 'ordered','user');
        }else{
            this.quill.formatLine(range, 'list', false,'user');
        }
    });
    quill.keyboard.addBinding({
        key: '1',
        shortKey: true,
        shiftKey: true
    }, function(range, context) {
        if(!context.format.header){
            this.quill.formatLine(range, 'header', 1,'user');
        }else{
            this.quill.formatLine(range, 'header', false,'user');
        }
    });
    quill.keyboard.addBinding({
        key: '2',
        shortKey: true,
        shiftKey: true
    }, function(range, context) {
        if(!context.format.header){
            this.quill.formatLine(range, 'header', 2,'user');
        }else{
            this.quill.formatLine(range, 'header', false,'user');
        }
    });
    quill.keyboard.addBinding({
        key: '3',
        shortKey: true,
        shiftKey: true
    }, function(range, context) {
        if(!context.format.header){
            this.quill.formatLine(range, 'header', 3,'user');
        }else{
            this.quill.formatLine(range, 'header', false,'user');
        }
    });
}
