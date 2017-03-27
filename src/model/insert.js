/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';
import {observable,autorun} from 'mobx'
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
}
const insert = new Insert();
export default insert;
