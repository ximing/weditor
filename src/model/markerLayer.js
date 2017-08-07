/**
 * Created by yeanzhi on 17/8/7.
 */
'use strict';
import {observable} from 'mobx';
let frontendMarkerLayer = observable({});
let backendMarkerLayer = observable({});
let incrementId = observable(0);
let forceUpdate = observable(0);
export{
    frontendMarkerLayer,
    backendMarkerLayer,
    incrementId,
    forceUpdate
};
