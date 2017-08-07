/**
 * Created by yeanzhi on 17/8/7.
 */
'use strict';
import {backendMarkerLayer,frontendMarkerLayer,incrementId,forceUpdate} from '../model/markerLayer'

class Layer {

    update(){
        forceUpdate.set(forceUpdate.get()+1);
    }

    addBackendMarker(marker){
        if(!marker['update']){
            throw new Error('marker must has update function')
        }
        backendMarkerLayer[incrementId.set(incrementId.get()+1)] = marker;
        this.update();
        return incrementId.get();
    }

    addFrontendMarker(marker){
        console.log('fffff'.repeat(10))
        if(!marker['update']){
            throw new Error('marker must has update function')
        }
        frontendMarkerLayer[incrementId.set(incrementId.get()+1)] = marker;
        this.update();
        return incrementId.get();
    }

    removeBackendMarker(id){
        delete backendMarkerLayer[id];
        this.update();
    }

    removeFrontendMarker(id){
        delete frontendMarkerLayer[id];
        this.update();
    }

    renderBackend(){
        let backendHtml = [];
        Object.values(backendMarkerLayer).forEach(item=>item.update(backendHtml));
        return backendHtml;
    }

    renderFrontend(){
        let frontendHtml = [];
        Object.values(frontendMarkerLayer).forEach(item=>item.update(frontendHtml));
        return frontendHtml;
    }
}

const layer = new Layer();

export default layer;
