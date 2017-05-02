/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';

var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3;

function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { observable, autorun } from 'mobx';

/*
* 编辑器的一些状态集合
* */
var Editor = (_class = function Editor() {
    _classCallCheck(this, Editor);

    _initDefineProp(this, 'range', _descriptor, this);

    _initDefineProp(this, 'focus', _descriptor2, this);

    _initDefineProp(this, 'format', _descriptor3, this);
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'range', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'focus', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'format', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return {};
    }
})), _class);


var editor = new Editor();

export default editor;