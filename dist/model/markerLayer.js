/**
 * Created by yeanzhi on 17/8/7.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.forceUpdate = exports.incrementId = exports.backendMarkerLayer = exports.frontendMarkerLayer = undefined;

var _mobx = require('mobx');

var frontendMarkerLayer = (0, _mobx.observable)({});
var backendMarkerLayer = (0, _mobx.observable)({});
var incrementId = (0, _mobx.observable)(0);
var forceUpdate = (0, _mobx.observable)(0);
exports.frontendMarkerLayer = frontendMarkerLayer;
exports.backendMarkerLayer = backendMarkerLayer;
exports.incrementId = incrementId;
exports.forceUpdate = forceUpdate;