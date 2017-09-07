/**
 * Created by yeanzhi on 17/8/7.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _markerLayer = require('../model/markerLayer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Layer = function () {
    function Layer() {
        _classCallCheck(this, Layer);
    }

    _createClass(Layer, [{
        key: 'update',
        value: function update() {
            _markerLayer.forceUpdate.set(_markerLayer.forceUpdate.get() + 1);
        }
    }, {
        key: 'addBackendMarker',
        value: function addBackendMarker(marker) {
            if (!marker) {
                throw new Error('marker param require');
            }
            _markerLayer.incrementId.set(_markerLayer.incrementId.get() + 1);
            _markerLayer.backendMarkerLayer[_markerLayer.incrementId.get()] = marker;
            this.update();
            return _markerLayer.incrementId.get();
        }
    }, {
        key: 'addFrontendMarker',
        value: function addFrontendMarker(marker) {
            if (!marker) {
                throw new Error('marker param require');
            }
            _markerLayer.incrementId.set(_markerLayer.incrementId.get() + 1);
            _markerLayer.frontendMarkerLayer[_markerLayer.incrementId.get()] = marker;
            console.log('addFrontendMarker', _markerLayer.frontendMarkerLayer);
            this.update();
            return _markerLayer.incrementId.get();
        }
    }, {
        key: 'removeBackendMarker',
        value: function removeBackendMarker(id) {
            delete _markerLayer.backendMarkerLayer[id];
            this.update();
        }
    }, {
        key: 'removeFrontendMarker',
        value: function removeFrontendMarker(id) {
            delete _markerLayer.frontendMarkerLayer[id];
            this.update();
        }
    }, {
        key: 'renderBackend',
        value: function renderBackend(props) {
            return Object.values(_markerLayer.backendMarkerLayer).map(function (item, index) {
                return (0, _react.createElement)(item, _extends({ key: index }, props));
            });
        }
    }, {
        key: 'renderFrontend',
        value: function renderFrontend(props) {
            return Object.values(_markerLayer.frontendMarkerLayer).map(function (item, index) {
                return (0, _react.createElement)(item, _extends({ key: index }, props));
            });
        }
    }]);

    return Layer;
}();

var layer = new Layer();

exports.default = layer;