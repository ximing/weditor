/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import {observable} from 'mobx';
class Catalogue {
    @observable open = false;
    @observable list = [];
}
let catalogue = new Catalogue();
export default catalogue;
