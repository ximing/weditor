/**
 * Created by yeanzhi on 17/8/3.
 */
'use strict';
import {observable} from 'mobx';
class Comments {
    @observable range = {
        index:0,
        length:0
    };
    /*
   * comment:{
   *   index:0,
   *   length:0
   *   comment:'1,2,3'
   * }
   * */
    @observable list = [
        {
            index:10,
            length:2,
            commentId:'1'
        },{
            index:14,
            length:2,
            commentId:'2'
        },{
            index:17,
            length:2,
            commentId:'3'
        },{
            index:20,
            length:2,
            commentId:'4'
        },{
            index:24,
            length:2,
            commentId:'5'
        }
    ];
    @observable activeCommentId = 0;
}
let comments = new Comments();
export default comments;
