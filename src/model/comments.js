/**
 * Created by yeanzhi on 17/8/3.
 */
'use strict';
import {observable} from 'mobx';

let list = [];
// for (let i = 0; i < 50; i++) {
//     list.push({
//         index: i * 2 + 4,
//         left: 2,
//         commentId: i+1
//     })
// }

class Comments {
    @observable range = {
        index: 0,
        length: 0
    };
    /*
   * comment:{
   *   index:0,
   *   left:0,
   *   top:0,
   *   height:0,
   *   width:0,
   *   comment:'1'
   * }
   * */
    @observable list = list;
    @observable activeCommentId = 0;
}

let comments = new Comments();
export default comments;
