/**
 * Created by yeanzhi on 17/3/30.
 */
'use strict';
import {observable,autorun} from 'mobx'

/*
* 编辑器的一些状态集合
* */
class Editor{

    @observable
    range={};

    @observable
    focus=false;

}

const editor = new Editor();

export default editor;
