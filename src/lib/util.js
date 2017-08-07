/**
 * Created by yeanzhi on 17/3/27.
 */
'use strict';
/**
 * 检测某个节点是否包含在另一节点中
 * @param a 父节点
 * @param b 子节点
 * @returns {boolean|*}
 */
export function contains(a, b) {
    return (a == b) || (a && a.contains ?
            (a != b && a.contains(b)) :
            !!(a.compareDocumentPosition(b) & 16));
}
export function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

export function platform() {
    var p = navigator.platform;
    return p.indexOf("Win") === 0?'windows':'mac';
}

export function getCtrl() {
    //⌘
    return platform()==='mac'?'Cmd':'Ctrl';
}

export function loop() {
}

export function stopPropagation(e) {
    e.stopPropagation();
    e
        .nativeEvent
        .stopImmediatePropagation();
}
