/**
 * Created by yeanzhi on 17/4/4.
 */
'use strict';
import {observable} from 'mobx';
class Help {
    @observable
    hotKeysDialog = false;
}
let help = new Help();
export default help;
