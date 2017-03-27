/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import {observable, autorun} from 'mobx';
class Catalogue {
    @observable open = false;
    @observable list = [];
}
const catalogue = new Catalogue();
export default catalogue;
