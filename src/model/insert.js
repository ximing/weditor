/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import {observable} from 'mobx';
class Insert {
    @observable
    openLinkDialog = false;
    @observable
    openImageDialog = false;
    @observable
    linkTitle = '';
    @observable
    linkUrl = '';
    @observable
    linkPosition = {
        left:0,
        top:0
    }
    linkSelection = {
        length:0,
        index:0
    }
    imageSelection = {
        length:0,
        index:0
    }
}
let insert = new Insert();
export default insert;
