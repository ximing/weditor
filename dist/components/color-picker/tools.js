/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/7
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getArea = exports.getArea = function getArea(selector) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'single';
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    try {
        if (type === 'all') {
            return document.querySelectorAll(selector)[index].getBoundingClientRect();
        } else {
            return document.querySelector(selector).getBoundingClientRect();
        }
    } catch (e) {}
};

var inArea = exports.inArea = function inArea(x, y, selector) {
    var ele = getArea(selector);
    try {
        return x >= ele.left && x <= ele.right && y >= ele.top && y <= ele.bottom;
    } catch (e) {}
};

var getFromLocalStorage = exports.getFromLocalStorage = function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
};

var setIntoLocalStorage = exports.setIntoLocalStorage = function setIntoLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
};

var updateDefaultColors = exports.updateDefaultColors = function updateDefaultColors(color, colors) {
    var tmp = colors.slice();
    if (tmp.indexOf(color) === -1) {
        tmp.unshift(color);
    } else {
        var found = tmp.splice(tmp.indexOf(color), 1);
        tmp = found.concat(tmp);
    }
    if (tmp.length > 10) {
        tmp = tmp.slice(0, 10);
    }
    return tmp;
};

var componentToHex = function componentToHex(c) {
    c = parseInt(c);
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
};

var rgbToHex = function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

var getColor = function getColor(selector, s, e) {
    var list = document.querySelectorAll(selector);
    var arr = [];
    for (var i = s; i <= e; i++) {
        var dom = list[i];
        var rgb = getComputedStyle(dom, null)['backgroundColor'];
        var result = /([0-9]+), ?([0-9]+), ?([0-9]+)/i.exec(rgb);
        arr.push(rgbToHex(result[1], result[2], result[3]));
    }
    return JSON.stringify(arr);
};