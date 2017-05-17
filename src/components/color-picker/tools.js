/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/7
 */
'use strict';

export let getArea = (selector, type = 'single', index = 0) => {
    try{
        if(type === 'all') {
            return document.querySelectorAll(selector)[index].getBoundingClientRect();
        }else{
            return document.querySelector(selector).getBoundingClientRect();
        }
    }catch(e) {

    }
};

export let inArea = (x, y, selector) => {
    let ele = getArea(selector);
    try{
        return (x >= ele.left && x <= ele.right) && (y >= ele.top && y <= ele.bottom);
    }catch(e) {}
};

export let getFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
};

export let setIntoLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
};

export let updateDefaultColors = (color, colors) => {
    let tmp = colors.slice();
    if(tmp.indexOf(color) === -1) {
        tmp.unshift(color);
    }else{
        let found = tmp.splice(tmp.indexOf(color), 1);
        tmp = found.concat(tmp);
    }
    if(tmp.length > 10) {
        tmp = tmp.slice(0, 10);
    }
    return tmp;
};

let componentToHex = (c) => {
    c = parseInt(c);
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
};

let rgbToHex = (r, g, b) => {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

let getColor = (selector, s, e) => {
    let list = document.querySelectorAll(selector);
    let arr = [];
    for(let i = s; i <= e; i++) {
        let dom = list[i];
        let rgb = getComputedStyle(dom, null)['backgroundColor'];
        let result = /([0-9]+), ?([0-9]+), ?([0-9]+)/i.exec(rgb);
        arr.push(rgbToHex(result[1], result[2], result[3]));
    }
    return JSON.stringify(arr);
};
