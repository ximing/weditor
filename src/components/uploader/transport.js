/**
 * Created by yeanzhi on 15/11/3.
 */
import assign from 'lodash.assign';
import eventEmitter from './eventBus.js';
/**
 * @fileOverview Transport
 */


let _options = {
    server: '',
    method: 'POST',
    fileVal: 'file',
    timeout: 2 * 60 * 1000,    // 2分钟
    formData: {},
    headers: {},
    fileName:void 0
};

export class Transport {

    constructor (_blob, eventEmitter,opts = {}) {
        if (!_blob) {
            throw new Error('blob should not empty');
        }
        this.eventEmitter = eventEmitter;
        this.config = assign({}, _options, opts);
        this._blob = _blob;
    }

    // 添加其他字段
    append (key, value) {
        if (typeof key === 'object') {
            assign(this.config.formData, key);
        } else {
            this.config.formData[key] = value;
        }
    }

    setRequestHeader (key, value) {
        if (typeof key === 'object') {
            assign(this._headers, key);
        } else {
            this.config.headers[key] = value;
        }
    }

    abort () {
        this.xhr.abort();
    }

    send () {
        return new Promise((res, rej)=> {
            let xhr = new XMLHttpRequest();
            this.xhr = xhr;
            let formData = new FormData();
            xhr.upload.addEventListener('progress', (e) => {
                //TODO 这里total给的超过文件大小了
                this.eventEmitter.emit('uploadBlobProgress', e.loaded, e.total);
            }, false);
            if(this.config.timeout !== 0) {
                xhr.timeout = this.config.timeout;
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status <= 300) {
                        this.eventEmitter.emit('_uploadSuccess', this._blob, xhr.responseText);
                        res(xhr.responseText);
                    } else {
                        this.eventEmitter.emit('_uploadError', xhr.statusText);
                        rej(xhr.response);
                    }
                }
            };
            xhr.ontimeout = function (event) {
                eventEmitter.emit('timeout', event);
            };
            if(this.config.withCredentials) {
                xhr.withCredentials = true;
            }
            Object.keys(this.config.formData).forEach((key)=>{
                formData.append(key, this.config.formData[key]);
            });
            formData.append(this.config.fileVal, this._blob, this.config.fileName);
            xhr.open(this.config.method, this.config.server, true);
            Object.keys(this.config.headers).forEach((key)=>{
                xhr.setRequestHeader(key, this.config.headers[key]);
            });
            xhr.send(formData);
        });
    }
}


