/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import {observable, autorun} from 'mobx';
export default class Catalogue {
    @observable open = false;
    @observable list = [];
}
