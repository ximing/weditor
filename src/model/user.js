/**
 * Created by yeanzhi on 17/8/7.
 */
'use strict';
import {observable} from 'mobx';
class User {
    @observable
    name = false;
    @observable
    avatar = '';
    @observable
    uid = '';
    @observable
    sid = '';
}
let user = new User();
export default user;
