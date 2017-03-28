/**
 * Created by yeanzhi on 15/11/2.
 */
//import {Uploader} from '../index.scss.js'
//
//var up = new Uploader();

//var Readable = require('stream').Readable;
//var arr = [
//    {
//        "etag": "79ce020d6db6b793c8204c140bd040a3",
//        "path": "allfilecontainer/79ce020d6db6b793c8204c140bd040a3",
//        "size_bytes": "20480"
//    }
//];
//var rs = new Readable;
//rs.push(JSON.stringify(arr));
//rs.push(null);
//
//rs.pipe(process.stdo
'use strict';
//
//async function hello(){
//    var res = await new Promise((res, rej)=>{
//        setTimeout(()=>{
//            res(1);
//        },2000);
//    });
//    logger.log(res);
//}
//'11'
//'席铭'
//hello();
var b1 = new Buffer('111111');
var bytes = Array.prototype.slice.call(b1, 0);
logger.log(bytes.length);
let a = {a:'123',b:'fsfs'}
a.forEach((key,val)=>{
    logger.log(key,val);
})
