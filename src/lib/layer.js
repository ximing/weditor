/**
 * Created by yeanzhi on 17/8/7.
 */
'use strict';
import React, {createElement} from 'react';
import {backendMarkerLayer, frontendMarkerLayer, incrementId, forceUpdate} from '../model/markerLayer'

class Layer {

    update() {
        forceUpdate.set(forceUpdate.get() + 1);
    }

    addBackendMarker(marker) {
        if(!marker){
            throw new Error('marker param require')
        }
        incrementId.set(incrementId.get() + 1)
        backendMarkerLayer[incrementId.get()] = marker;
        this.update();
        return incrementId.get();
    }

    addFrontendMarker(marker) {
        if(!marker){
            throw new Error('marker param require')
        }
        incrementId.set(incrementId.get() + 1)
        frontendMarkerLayer[incrementId.get()] = marker;
        console.log('addFrontendMarker',frontendMarkerLayer)
        this.update();
        return incrementId.get();
    }

    removeBackendMarker(id) {
        delete backendMarkerLayer[id];
        this.update();
    }

    removeFrontendMarker(id) {
        delete frontendMarkerLayer[id];
        this.update();
    }

    renderBackend(props) {
        return Object.values(backendMarkerLayer).map((item, index) => createElement(item, {key: index, ...props}));
    }

    renderFrontend(props) {
        return Object.values(frontendMarkerLayer).map((item, index) => createElement(item, {key: index, ...props}));
    }
}

const layer = new Layer();

export default layer;
