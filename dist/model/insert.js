/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';

var _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

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
var Insert = (_class = function Insert() {
    _classCallCheck(this, Insert);

    _initDefineProp(this, 'openLinkDialog', _descriptor, this);

    _initDefineProp(this, 'openImageDialog', _descriptor2, this);

    _initDefineProp(this, 'linkTitle', _descriptor3, this);

    _initDefineProp(this, 'linkUrl', _descriptor4, this);

    _initDefineProp(this, 'linkPosition', _descriptor5, this);

    this.linkSelection = {
        length: 0,
        index: 0
    };
    this.imageSelection = {
        length: 0,
        index: 0
    };
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'openLinkDialog', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'openImageDialog', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return false;
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'linkTitle', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'linkUrl', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return '';
    }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'linkPosition', [observable], {
    enumerable: true,
    initializer: function initializer() {
        return {
            left: 0,
            top: 0
        };
    }
})), _class);

var insert = new Insert();
export default insert;