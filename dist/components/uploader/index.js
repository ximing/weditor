/**
 * Author: ximing
 * Date: Mon, 02 Nov 2015 07:45:07 GMT
 */

'use strict';


import EventEmitter from './eventBus.js';
import {Transport} from './transport.js';
import {WUFile} from './file.js';

let _config = {
    timeout: 0,
    accept:null,
    auto: false,
    chunked: false,
    chunkSize: 5242880,
    chunkRetry: 2,
    formData: {},
    headers: {},
    fileVal: 'file',
    method: 'POST',
    fileNumLimit: void 0,
    fileSizeLimit: void 0,
    fileSingleSizeLimit: void 0,
    dnd: void 0,
    pick: void 0,
    paste: void 0,
    server: '',
    linterContiner: document,
    $: null,
    body: document.body,
    multiple: false,
    withCredentials:false,
    setName: function (id) {
        return `${new Date().getTime()}${id}`;
    }
};
export class Uploader {
    constructor(config = {}) {
        this.filesQueue = [];
        this._selectFileTransactionId = 0;
        this.config = Object.assign({}, _config, config);
        this.status = Uploader.Status.INITED;
        if (this.config.$ === null || this.config.$ === void 0) {
            throw new Error('$ 必须定义');
        }
        this.$ = this.config.$;
        this.inputId = `fileUploadBtn-${new Date().getTime()}`;
        this.eventEmitter = new EventEmitter();
        if (this.$.isPlainObject(this.config.accept)) {
            this.config.accept = [ this.config.accept ];
        }
        if (this.config.accept) {
            let arr = [];
            for (let i = 0, len = this.config.accept.length; i < len; i++) {
                let item = this.config.accept[ i ].extensions;
                item && arr.push(item);
            }
            if (arr.length) {
                this.accept = '\\.' + arr.join(',')
                        .replace(/,/g, '$|\\.')
                        .replace(/\*/g, '.*') + '$';
            }
            this.accept = new RegExp(this.accept, 'i');
        }
        this._pickOnChangeBindThis = this._pickOnChange.bind(this);
        this._pickOnClickBindThis = this._pickOnClick.bind(this);
        this._dndHandleDragenterBindThis = this._dndHandleDragenter.bind(this);
        this._dndHandleDragoverBindThis = this._dndHandleDragover.bind(this);
        this._dndHandleDragleaveBindThis = this._dndHandleDragleave.bind(this);
        this._dndHandleDropBindThis = this._dndHandleDrop.bind(this);
        this.init();

    }
    acceptFile(file) {
        //var invalid = !file || !file.size || this.accept &&
        var invalid = !file || this.accept &&
            // 如果名字中有后缀，才做后缀白名单处理。
            /\.\w+$/.exec(file.name) && !this.accept.test(file.name);

        return !invalid;
    }
    init() {
        let input = `<input type="file" id="${this.inputId}" size="30" name="fileselect[]" style="position:absolute;top:-100000px;">`;
        let $input = this.$(input);
        // accept中的中生成匹配正则。
        if (this.config.accept && this.config.accept.length > 0) {
            let arr = [];

            for (let i = 0, len = this.config.accept.length; i < len; i++) {
                arr.push(this.config.accept[ i ].mimeTypes);
            }
            $input.attr('accept', arr.join(','));
        }
        if (!!this.config.multiple) {
            $input.attr('multiple','multiple');
        }
        this.$(`#${this.inputId}`).remove();
        this.$(this.config.body).append($input);
        this.reset();
        if (this.config.pick) {
            this._pickHandle();
        }
        if (this.config.dnd) {
            this._dndHandle();
        }
        if (this.config.paste) {
            this._pasteHandle();
        }
    }

    _resetinput(e) {
        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();
    }

    reset() {
        this._resetinput(this.$(`#${this.inputId}`));
    }

    _pasteHandle() {
        if (this.config.paste) {
            this.$(this.config.linterContiner).on('paste', this.config.paste, (event) => {
                let clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
                if (!!clipboardData) {
                    let items = clipboardData.items;
                    for (let i = 0; i < items.length; ++i) {
                        let item = items[i];
                        let blob = null;
                        if (item.kind !== 'file' || !(blob = item.getAsFile())) {
                            continue;
                        }
                        event.stopPropagation();
                        event.preventDefault();
                        // let wuFile = new WUFile(blob, {eventEmitter:this.eventEmitter,setName:this.config.setName});
                        this._selectFileTransactionId++;
                        this.pushQueue(blob);
                    }
                }
            });
        }
    }

    _pickHandle() {
        this.$(document).on('change', `#${this.inputId}`, this._pickOnChangeBindThis);
        if(this.config.pick) {
            this.$(document).on('click', this.config.pick, this._pickOnClickBindThis);
        }
    }

    async _pickOnChange(event) {
        event.stopPropagation();
        event.preventDefault();
        await this.funGetFiles(event);
    }

    async _pickOnClick (event) {
        event.stopPropagation();
        event.preventDefault();
        this.$(`#${this.inputId}`).click();
    }

    _dndHandle() {
        if (this.config.dnd) {
            this.$(this.config.linterContiner).on('dragenter', this.config.dnd, this._dndHandleDragenterBindThis);
            this.$(this.config.linterContiner).on('dragover', this.config.dnd, this._dndHandleDragoverBindThis);
            this.$(this.config.linterContiner).on('dragleave', this.config.dnd, this._dndHandleDragleaveBindThis);
            this.$(this.config.linterContiner).on('drop', this.config.dnd, this._dndHandleDropBindThis);

        }
    }

    async _dndHandleDragenter(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    async _dndHandleDragover(event) {
        event.originalEvent.dataTransfer.dropEffect = 'copy'; // 兼容圈点APP
        event.stopPropagation();
        event.preventDefault();
        this.eventEmitter.emit('dragover');
    }
    async _dndHandleDragleave(event) {
        event.stopPropagation();
        event.preventDefault();
        this.eventEmitter.emit('dragleave');
    }
    async _dndHandleDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        await this.funGetFiles(event.originalEvent);
    }

    //获取选择文件，file控件或拖放
    async funGetFiles(e) {
        this._selectFileTransactionId++;
        let files = e.target.files || e.dataTransfer.files;
        let items = e.target.items || (e.dataTransfer && e.dataTransfer.items);
        let entrys = [];
        for (let key in items) {
            if (!!items[key] && items.hasOwnProperty(key)) {
                if (items[key].getAsEntry) {
                    entrys.push(items[key].getAsEntry());
                } else if (items[key].webkitGetAsEntry) {
                    entrys.push(items[key].webkitGetAsEntry());
                } else {
                    entrys.push({});
                }
            }
        }
        await this.eventEmitter.emit('beforeFilesQueued', files);
        for (let index = 0, l = Object.keys(files).length; index < l; index++) {
            let file = files[index];
            if (!!file) {
                if (entrys && entrys[index]) {
                    let entry = entrys[index];
                    if (entry !== null && entry.isDirectory) {
                        await this.folderRead(entry);
                        continue;
                    }
                }
                // file.path = '/' + file.name;
                Object.defineProperty(file,'path',{
                    value:'/' + file.name
                });
                if(!!this.config.multiple) {
                    await this.pushQueue(file);
                }else{
                    await this.pushQueue(file);
                    break;
                }

            }
        }
        await this.eventEmitter.emit('filesQueued');
    }

    async folderRead(entry) {
        entry.path = entry.fullPath;
        entry.selectFileTransactionId = this._selectFileTransactionId;
        let res = await this.eventEmitter.emit('selectDir', entry);
        if (res.indexOf(false) === -1) {
            await new Promise((res)=> {
                entry.createReader().readEntries(async(entries) => {
                    for (var i = 0; i < entries.length; i++) {
                        let _entry = entries[i];
                        if (_entry.isFile) {
                            let file = await new Promise((res)=> {
                                _entry.file(async(file) => {
                                    if(process.env.APP_ENV.indexOf('pc') > -1) {
                                        Object.defineProperty(file,'path',{
                                            value:_entry.fullPath
                                        });
                                    }else{
                                        file.path = _entry.fullPath;
                                    }
                                    res(file);
                                });
                            });
                            await this.eventEmitter.emit('beforeChildFileQueued', file, entry);
                            await this.pushQueue(file, entry);
                            await this.eventEmitter.emit('childFileQueued', file);
                        } else if (_entry.isDirectory) {
                            await this.eventEmitter.emit('beforeChildDirQueued', _entry, entry);
                            await this.folderRead(_entry, entry);
                            await this.eventEmitter.emit('childDirQueued', _entry);
                        }
                    }
                    res();
                });
            });
        }
    }

    fileFilter(file) {
        if (!isNaN(Number(this.config.fileNumLimit))) {

        }
        if (!isNaN(Number(this.config.fileSingleSizeLimit))) {
            // if (file.size >= Number(this.config.fileSingleSizeLimit)) {
            //     this.eventEmitter.emit('fileExceeded', file);
            //     return;
            // }
        }
        if(this.acceptFile(file)) {
            return file;
        }else{
            this.eventEmitter.emit('uploadError', file,'不支持的文件格式');
            return false;
        }
    }

    async pushQueue(file) {
        file.selectFileTransactionId = this._selectFileTransactionId;
        file = this.fileFilter(file);
        if (file) {
            let wuFile = new WUFile(file, {eventEmitter: this.eventEmitter, setName: this.config.setName});
            let res = await this.eventEmitter.emit('beforeFileQueued', wuFile);
            if (res.indexOf(false) === -1) {
                wuFile.statusText = WUFile.Status.QUEUED;
                this.filesQueue.push(wuFile);
                await this.eventEmitter.emit('fileQueued', wuFile);
                if (this.config.auto && this.status !== Uploader.Status.UPLOADING) {
                    this.startUpload();
                }
            }
        }
    }

    //特殊需求的私有方法，不建议使用
    async _pushUploaderFile(wuFile) {
        if(!(wuFile instanceof WUFile)) {
            wuFile = new WUFile(wuFile, {eventEmitter: this.eventEmitter, setName: this.config.setName});
        }
        wuFile.selectFileTransactionId = ++this._selectFileTransactionId;
        wuFile = this.fileFilter(wuFile);
        if (wuFile) {
            wuFile.statusText = WUFile.Status.QUEUED;
            this.filesQueue.push(wuFile);
            await this.eventEmitter.emit('fileQueued', wuFile);
            if (this.config.auto && this.status !== Uploader.Status.UPLOADING) {
                this.startUpload();
            }
        }
    }

    on(eventSource, fn) {
        this.eventEmitter.on(eventSource, fn);
    }

    removeEvent(eventSource) {
        this.eventEmitter.removeEvent(eventSource);
    }

    async startUpload() {
        if(this.status !== Uploader.Status.UPLOADING) {
            while (this.filesQueue.filter(item=>item.statusText === WUFile.Status.QUEUED).length > 0) {
                this.status = Uploader.Status.UPLOADING;
                let file = this.filesQueue.filter(item=>item.statusText === WUFile.Status.QUEUED)[0];
                if (file.isFile) {
                    await this.startHandleFile(file);
                } else {
                    await this.startHandleDir(file);
                }
            }
            if (this.filesQueue.filter(item=>item.statusText === WUFile.Status.QUEUED).length === 0) {
                await this.eventEmitter.emit('filesQueuedEmpty');
                this.status = Uploader.Status.INITED;
            }
        }
    }

    async startHandleDir() {
    }

    async startHandleFile(file) {
        let currentShared = 1;
        let currentProgress = 0;
        file.statusText = WUFile.Status.PROGRESS;
        this.eventEmitter.on('uploadBeforeSend', (obj)=> {
            currentShared = obj.currentShard;
        });

        this.eventEmitter.on('uploadBlobProgress', (loaded,total)=> {
            if (currentProgress < (loaded + this.config.chunkSize * (currentShared - 1))) {
                currentProgress = (loaded + this.config.chunkSize * (currentShared - 1));
                this.eventEmitter.emit('uploadProgress', file, currentProgress,loaded,total);
            }
        });
        try {
            await this._upfile(file);
            await this.eventEmitter.emit('uploadComplete', file);
            this.eventEmitter.removeEvent('uploadBlobProgress');
        } catch (err) {
            this.file.statusText = WUFile.Status.ERROR;
            this.status = Uploader.Status.FILEERROR;
            await this.eventEmitter.emit('uploadError', file,err);
            throw err;
        } finally {
            this.file = {};
        }
    }

    async _upfile(file) {
        this.file = file;
        await this.eventEmitter.emit('uploadStart', file);
        //file.statusText = WUFile.Status.PROGRESS;
        if (this.config.chunked) {
            let shardCount = Math.ceil(file.size / this.config.chunkSize);
            if(shardCount === 0) {
                shardCount = 1;
            }
            for (let i = 0; i < shardCount; i++) {
                if (file.statusText === WUFile.Status.PROGRESS) {
                    let start = i * this.config.chunkSize,
                        end = Math.min(file.size, start + this.config.chunkSize);
                    let obj = file.source.slice(start, end);
                    await this.eventEmitter.emit('uploadBeforeSend', {
                        file: file,
                        shard: obj,
                        shardCount: shardCount,
                        currentShard: i + 1
                    });
                    if (this.config.server.trim() === '') {
                        throw new Error('server could not be empty');
                    }
                    try {
                        let res = await this._baseupload(obj, file.name);
                        if (shardCount === i + 1) {
                            this.file.statusText = WUFile.Status.COMPLETE;
                            await this.eventEmitter.emit('uploadSuccess', file);
                            this._removeFileFromQueue(file.id);
                        }
                        await this.eventEmitter.emit('uploadAccept', {
                            file: file,
                            shard: obj,
                            shardCount: shardCount,
                            currentShard: i + 1
                        }, res);
                    } catch (err) {
                        await this._catchUpfileError(err, file);
                    }
                    await this.eventEmitter.emit('uploadEndSend', {
                        file: file,
                        shard: obj,
                        shardCount: shardCount,
                        currentShard: i + 1
                    });
                } else {
                    break;
                }
            }
        } else {
            await this.eventEmitter.emit('uploadBeforeSend', {
                file: file
            });
            try {
                let res = await this._baseupload(file.source, file.name);
                await this.eventEmitter.emit('uploadAccept', {file: file}, res);
                file.statusText = WUFile.Status.COMPLETE;
                await this.eventEmitter.emit('uploadSuccess', file);
                this._removeFileFromQueue(file.id);
            } catch (err) {
                await this._catchUpfileError(err, file);
            }
            await this.eventEmitter.emit('uploadEndSend', {
                file: file
            });
        }
        await this.eventEmitter.emit('fileUploadEnd', file);
    }

    async _catchUpfileError(err, file) {
        if (!(this.file.statusText === WUFile.Status.INTERRUPT
            || this.file.statusText === WUFile.Status.CANCELLED)) {
            this.file.statusText = WUFile.Status.ERROR;
            this.status = Uploader.Status.FILEERROR;
            await this.eventEmitter.emit('uploadError', file,err);
        }
    }

    destory() {
        this.eventEmitter.removeEvents();
        this.filesQueue = [];
        if (this.transport) {
            this.transport.abort();
        }

        if(this.config.dnd) {
            this.$(document).off('dragover', this._dndHandleDragover);
            this.$(document).off('dragleave', this._dndHandleDragleave);
            this.$(document).off('drop', this._dndHandleDrop);
        }
        this.$(document).off('change', this._pickOnChangeBindThis);
        if(this.config.pick) {
            this.$(document).off('click', this._pickOnClickBindThis);
        }
    }

    _removeFileFromQueue(id) {
        this.filesQueue = this.filesQueue.filter((file)=> {
            return file.id !== id;
        });
    }

    removeFile(id) {
        this._removeFileFromQueue(id);
        if (this.file && this.file.id === id) {
            this.file.statusText = WUFile.Status.CANCELLED;
            if (this.transport) {
                this.transport.abort();
            }
        }
    }

    interruptFile(id) {
        if (this.file && this.file.id === id) {
            this.file.statusText = WUFile.Status.INTERRUPT;
            if (this.transport) {
                this.transport.abort();
            }
        }
    }

    //中断所有
    interruptAllFile(ids) {
        this.filesQueue.forEach((file)=> {
            if (this.file && this.file.id === file.id && ids[file.id]) {
                this.interruptFile(file.id);
            }else if(ids[file.id]) {
                file.statusText = WUFile.Status.CANCELLED;
            }
        });
    }

    async resetFile(id) {
        if (this.file && this.file.id !== id) {
            this.filesQueue.forEach((file)=> {
                if (file.id === id) {
                    file.statusText = WUFile.Status.QUEUED;
                }
            });
        }
        if (this.status !== Uploader.Status.UPLOADING) {
            await this.startUpload();
        }
    }

    async _baseupload(blob, fileName) {
        let config = {
            server: this.config.server,
            method: this.config.method,
            fileVal: this.config.fileVal,
            timeout: this.config.timeout,    // 2分钟
            formData: this.config.formData,
            headers: this.config.headers,
            fileName: fileName,
            withCredentials:this.config.withCredentials
        };
        let res = null;
        for (let i = 0; i < this.config.chunkRetry; i++) {
            if (this.file.statusText === WUFile.Status.PROGRESS) {
                try {
                    this.transport = new Transport(blob, this.eventEmitter, config);
                    res = await this.transport.send();
                    break;
                } catch (err) {
                    throw new Error(err);
                }
            } else {
                throw new Error('已取消');
            }
        }
        this.transport = null;
        return res;
    }

}

export let UploaderStatus = Uploader.Status = {
    INITED: 'inited',
    FILEERROR: 'fileError',
    UPLOADING: 'UPLOADING'
};

export let FileStatus = WUFile.Status;
