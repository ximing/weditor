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

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.contains = contains;
exports.is = is;
exports.platform = platform;
exports.getCtrl = getCtrl;
exports.loop = loop;
exports.stopPropagation = stopPropagation;
function contains(a, b) {
    return a == b || (a && a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16));
}
function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

function platform() {
    var p = navigator.platform;
    return p.indexOf('Win') === 0 ? 'windows' : 'mac';
}

function getCtrl() {
    //⌘
    return platform() === 'mac' ? 'Cmd' : 'Ctrl';
}

function loop() {}

function stopPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}