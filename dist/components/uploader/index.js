/**
 * Author: ximing
 * Date: Mon, 02 Nov 2015 07:45:07 GMT
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FileStatus = exports.UploaderStatus = exports.Uploader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventBus = require('./eventBus.js');

var _eventBus2 = _interopRequireDefault(_eventBus);

var _transport = require('./transport.js');

var _file = require('./file.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config = {
    timeout: 0,
    accept: null,
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
    withCredentials: false,
    setName: function setName(id) {
        return '' + new Date().getTime() + id;
    }
};

var Uploader = exports.Uploader = function () {
    function Uploader() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Uploader);

        this.filesQueue = [];
        this._selectFileTransactionId = 0;
        this.config = Object.assign({}, _config, config);
        this.status = Uploader.Status.INITED;
        if (this.config.$ === null || this.config.$ === void 0) {
            throw new Error('$ 必须定义');
        }
        this.$ = this.config.$;
        this.inputId = 'fileUploadBtn-' + new Date().getTime();
        this.eventEmitter = new _eventBus2.default();
        if (this.$.isPlainObject(this.config.accept)) {
            this.config.accept = [this.config.accept];
        }
        if (this.config.accept) {
            var arr = [];
            for (var i = 0, len = this.config.accept.length; i < len; i++) {
                var item = this.config.accept[i].extensions;
                item && arr.push(item);
            }
            if (arr.length) {
                this.accept = '\\.' + arr.join(',').replace(/,/g, '$|\\.').replace(/\*/g, '.*') + '$';
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

    _createClass(Uploader, [{
        key: 'acceptFile',
        value: function acceptFile(file) {
            //var invalid = !file || !file.size || this.accept &&
            var invalid = !file || this.accept &&
            // 如果名字中有后缀，才做后缀白名单处理。
            /\.\w+$/.exec(file.name) && !this.accept.test(file.name);

            return !invalid;
        }
    }, {
        key: 'init',
        value: function init() {
            var input = '<input type="file" id="' + this.inputId + '" size="30" name="fileselect[]" style="position:absolute;top:-100000px;">';
            var $input = this.$(input);
            // accept中的中生成匹配正则。
            if (this.config.accept && this.config.accept.length > 0) {
                var arr = [];

                for (var i = 0, len = this.config.accept.length; i < len; i++) {
                    arr.push(this.config.accept[i].mimeTypes);
                }
                $input.attr('accept', arr.join(','));
            }
            if (!!this.config.multiple) {
                $input.attr('multiple', 'multiple');
            }
            this.$('#' + this.inputId).remove();
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
    }, {
        key: '_resetinput',
        value: function _resetinput(e) {
            e.wrap('<form>').closest('form').get(0).reset();
            e.unwrap();
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._resetinput(this.$('#' + this.inputId));
        }
    }, {
        key: '_pasteHandle',
        value: function _pasteHandle() {
            var _this = this;

            if (this.config.paste) {
                this.$(this.config.linterContiner).on('paste', this.config.paste, function (event) {
                    var clipboardData = event.clipboardData || event.originalEvent.clipboardData;
                    if (!!clipboardData) {
                        var items = clipboardData.items;
                        for (var i = 0; i < items.length; ++i) {
                            var item = items[i];
                            var blob = null;
                            if (item.kind !== 'file' || !(blob = item.getAsFile())) {
                                continue;
                            }
                            event.stopPropagation();
                            event.preventDefault();
                            // let wuFile = new WUFile(blob, {eventEmitter:this.eventEmitter,setName:this.config.setName});
                            _this._selectFileTransactionId++;
                            _this.pushQueue(blob);
                        }
                    }
                });
            }
        }
    }, {
        key: '_pickHandle',
        value: function _pickHandle() {
            this.$(document).on('change', '#' + this.inputId, this._pickOnChangeBindThis);
            if (this.config.pick) {
                this.$(document).on('click', this.config.pick, this._pickOnClickBindThis);
            }
        }
    }, {
        key: '_pickOnChange',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(event) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                event.stopPropagation();
                                event.preventDefault();
                                _context.next = 4;
                                return this.funGetFiles(event);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function _pickOnChange(_x2) {
                return _ref.apply(this, arguments);
            }

            return _pickOnChange;
        }()
    }, {
        key: '_pickOnClick',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(event) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                event.stopPropagation();
                                event.preventDefault();
                                this.$('#' + this.inputId).click();

                            case 3:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function _pickOnClick(_x3) {
                return _ref2.apply(this, arguments);
            }

            return _pickOnClick;
        }()
    }, {
        key: '_dndHandle',
        value: function _dndHandle() {
            if (this.config.dnd) {
                this.$(this.config.linterContiner).on('dragenter', this.config.dnd, this._dndHandleDragenterBindThis);
                this.$(this.config.linterContiner).on('dragover', this.config.dnd, this._dndHandleDragoverBindThis);
                this.$(this.config.linterContiner).on('dragleave', this.config.dnd, this._dndHandleDragleaveBindThis);
                this.$(this.config.linterContiner).on('drop', this.config.dnd, this._dndHandleDropBindThis);
            }
        }
    }, {
        key: '_dndHandleDragenter',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(event) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                event.stopPropagation();
                                event.preventDefault();

                            case 2:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function _dndHandleDragenter(_x4) {
                return _ref3.apply(this, arguments);
            }

            return _dndHandleDragenter;
        }()
    }, {
        key: '_dndHandleDragover',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(event) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                event.originalEvent.dataTransfer.dropEffect = 'copy'; // 兼容圈点APP
                                event.stopPropagation();
                                event.preventDefault();
                                this.eventEmitter.emit('dragover');

                            case 4:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function _dndHandleDragover(_x5) {
                return _ref4.apply(this, arguments);
            }

            return _dndHandleDragover;
        }()
    }, {
        key: '_dndHandleDragleave',
        value: function () {
            var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(event) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                event.stopPropagation();
                                event.preventDefault();
                                this.eventEmitter.emit('dragleave');

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function _dndHandleDragleave(_x6) {
                return _ref5.apply(this, arguments);
            }

            return _dndHandleDragleave;
        }()
    }, {
        key: '_dndHandleDrop',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(event) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                event.stopPropagation();
                                event.preventDefault();
                                _context6.next = 4;
                                return this.funGetFiles(event.originalEvent);

                            case 4:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function _dndHandleDrop(_x7) {
                return _ref6.apply(this, arguments);
            }

            return _dndHandleDrop;
        }()

        //获取选择文件，file控件或拖放

    }, {
        key: 'funGetFiles',
        value: function () {
            var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(e) {
                var files, items, entrys, key, index, l, file, entry;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                this._selectFileTransactionId++;
                                files = e.target.files || e.dataTransfer.files;
                                items = e.target.items || e.dataTransfer && e.dataTransfer.items;
                                entrys = [];

                                for (key in items) {
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
                                _context7.next = 7;
                                return this.eventEmitter.emit('beforeFilesQueued', files);

                            case 7:
                                index = 0, l = Object.keys(files).length;

                            case 8:
                                if (!(index < l)) {
                                    _context7.next = 29;
                                    break;
                                }

                                file = files[index];

                                if (!file) {
                                    _context7.next = 26;
                                    break;
                                }

                                if (!(entrys && entrys[index])) {
                                    _context7.next = 17;
                                    break;
                                }

                                entry = entrys[index];

                                if (!(entry !== null && entry.isDirectory)) {
                                    _context7.next = 17;
                                    break;
                                }

                                _context7.next = 16;
                                return this.folderRead(entry);

                            case 16:
                                return _context7.abrupt('continue', 26);

                            case 17:
                                // file.path = '/' + file.name;
                                Object.defineProperty(file, 'path', {
                                    value: '/' + file.name
                                });

                                if (!this.config.multiple) {
                                    _context7.next = 23;
                                    break;
                                }

                                _context7.next = 21;
                                return this.pushQueue(file);

                            case 21:
                                _context7.next = 26;
                                break;

                            case 23:
                                _context7.next = 25;
                                return this.pushQueue(file);

                            case 25:
                                return _context7.abrupt('break', 29);

                            case 26:
                                index++;
                                _context7.next = 8;
                                break;

                            case 29:
                                _context7.next = 31;
                                return this.eventEmitter.emit('filesQueued');

                            case 31:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function funGetFiles(_x8) {
                return _ref7.apply(this, arguments);
            }

            return funGetFiles;
        }()
    }, {
        key: 'folderRead',
        value: function () {
            var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(entry) {
                var _this2 = this;

                var res;
                return regeneratorRuntime.wrap(function _callee10$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                entry.path = entry.fullPath;
                                entry.selectFileTransactionId = this._selectFileTransactionId;
                                _context11.next = 4;
                                return this.eventEmitter.emit('selectDir', entry);

                            case 4:
                                res = _context11.sent;

                                if (!(res.indexOf(false) === -1)) {
                                    _context11.next = 8;
                                    break;
                                }

                                _context11.next = 8;
                                return new Promise(function (res) {
                                    entry.createReader().readEntries(function () {
                                        var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(entries) {
                                            var _loop, i;

                                            return regeneratorRuntime.wrap(function _callee9$(_context10) {
                                                while (1) {
                                                    switch (_context10.prev = _context10.next) {
                                                        case 0:
                                                            _loop = regeneratorRuntime.mark(function _loop() {
                                                                var _entry, file;

                                                                return regeneratorRuntime.wrap(function _loop$(_context9) {
                                                                    while (1) {
                                                                        switch (_context9.prev = _context9.next) {
                                                                            case 0:
                                                                                _entry = entries[i];

                                                                                if (!_entry.isFile) {
                                                                                    _context9.next = 13;
                                                                                    break;
                                                                                }

                                                                                _context9.next = 4;
                                                                                return new Promise(function (res) {
                                                                                    _entry.file(function () {
                                                                                        var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(file) {
                                                                                            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                                                                                while (1) {
                                                                                                    switch (_context8.prev = _context8.next) {
                                                                                                        case 0:
                                                                                                            if (process.env.APP_ENV.indexOf('pc') > -1) {
                                                                                                                Object.defineProperty(file, 'path', {
                                                                                                                    value: _entry.fullPath
                                                                                                                });
                                                                                                            } else {
                                                                                                                file.path = _entry.fullPath;
                                                                                                            }
                                                                                                            res(file);

                                                                                                        case 2:
                                                                                                        case 'end':
                                                                                                            return _context8.stop();
                                                                                                    }
                                                                                                }
                                                                                            }, _callee8, _this2);
                                                                                        }));

                                                                                        return function (_x11) {
                                                                                            return _ref10.apply(this, arguments);
                                                                                        };
                                                                                    }());
                                                                                });

                                                                            case 4:
                                                                                file = _context9.sent;
                                                                                _context9.next = 7;
                                                                                return _this2.eventEmitter.emit('beforeChildFileQueued', file, entry);

                                                                            case 7:
                                                                                _context9.next = 9;
                                                                                return _this2.pushQueue(file, entry);

                                                                            case 9:
                                                                                _context9.next = 11;
                                                                                return _this2.eventEmitter.emit('childFileQueued', file);

                                                                            case 11:
                                                                                _context9.next = 20;
                                                                                break;

                                                                            case 13:
                                                                                if (!_entry.isDirectory) {
                                                                                    _context9.next = 20;
                                                                                    break;
                                                                                }

                                                                                _context9.next = 16;
                                                                                return _this2.eventEmitter.emit('beforeChildDirQueued', _entry, entry);

                                                                            case 16:
                                                                                _context9.next = 18;
                                                                                return _this2.folderRead(_entry, entry);

                                                                            case 18:
                                                                                _context9.next = 20;
                                                                                return _this2.eventEmitter.emit('childDirQueued', _entry);

                                                                            case 20:
                                                                            case 'end':
                                                                                return _context9.stop();
                                                                        }
                                                                    }
                                                                }, _loop, _this2);
                                                            });
                                                            i = 0;

                                                        case 2:
                                                            if (!(i < entries.length)) {
                                                                _context10.next = 7;
                                                                break;
                                                            }

                                                            return _context10.delegateYield(_loop(), 't0', 4);

                                                        case 4:
                                                            i++;
                                                            _context10.next = 2;
                                                            break;

                                                        case 7:
                                                            res();

                                                        case 8:
                                                        case 'end':
                                                            return _context10.stop();
                                                    }
                                                }
                                            }, _callee9, _this2);
                                        }));

                                        return function (_x10) {
                                            return _ref9.apply(this, arguments);
                                        };
                                    }());
                                });

                            case 8:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function folderRead(_x9) {
                return _ref8.apply(this, arguments);
            }

            return folderRead;
        }()
    }, {
        key: 'fileFilter',
        value: function fileFilter(file) {
            if (!isNaN(Number(this.config.fileNumLimit))) {}
            if (!isNaN(Number(this.config.fileSingleSizeLimit))) {
                // if (file.size >= Number(this.config.fileSingleSizeLimit)) {
                //     this.eventEmitter.emit('fileExceeded', file);
                //     return;
                // }
            }
            if (this.acceptFile(file)) {
                return file;
            } else {
                this.eventEmitter.emit('uploadError', file, '不支持的文件格式');
                return false;
            }
        }
    }, {
        key: 'pushQueue',
        value: function () {
            var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(file) {
                var wuFile, res;
                return regeneratorRuntime.wrap(function _callee11$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                file.selectFileTransactionId = this._selectFileTransactionId;
                                file = this.fileFilter(file);

                                if (!file) {
                                    _context12.next = 13;
                                    break;
                                }

                                wuFile = new _file.WUFile(file, { eventEmitter: this.eventEmitter, setName: this.config.setName });
                                _context12.next = 6;
                                return this.eventEmitter.emit('beforeFileQueued', wuFile);

                            case 6:
                                res = _context12.sent;

                                if (!(res.indexOf(false) === -1)) {
                                    _context12.next = 13;
                                    break;
                                }

                                wuFile.statusText = _file.WUFile.Status.QUEUED;
                                this.filesQueue.push(wuFile);
                                _context12.next = 12;
                                return this.eventEmitter.emit('fileQueued', wuFile);

                            case 12:
                                if (this.config.auto && this.status !== Uploader.Status.UPLOADING) {
                                    this.startUpload();
                                }

                            case 13:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function pushQueue(_x12) {
                return _ref11.apply(this, arguments);
            }

            return pushQueue;
        }()

        //特殊需求的私有方法，不建议使用

    }, {
        key: '_pushUploaderFile',
        value: function () {
            var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(wuFile) {
                return regeneratorRuntime.wrap(function _callee12$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                if (!(wuFile instanceof _file.WUFile)) {
                                    wuFile = new _file.WUFile(wuFile, { eventEmitter: this.eventEmitter, setName: this.config.setName });
                                }
                                wuFile.selectFileTransactionId = ++this._selectFileTransactionId;
                                wuFile = this.fileFilter(wuFile);

                                if (!wuFile) {
                                    _context13.next = 9;
                                    break;
                                }

                                wuFile.statusText = _file.WUFile.Status.QUEUED;
                                this.filesQueue.push(wuFile);
                                _context13.next = 8;
                                return this.eventEmitter.emit('fileQueued', wuFile);

                            case 8:
                                if (this.config.auto && this.status !== Uploader.Status.UPLOADING) {
                                    this.startUpload();
                                }

                            case 9:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function _pushUploaderFile(_x13) {
                return _ref12.apply(this, arguments);
            }

            return _pushUploaderFile;
        }()
    }, {
        key: 'on',
        value: function on(eventSource, fn) {
            this.eventEmitter.on(eventSource, fn);
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent(eventSource) {
            this.eventEmitter.removeEvent(eventSource);
        }
    }, {
        key: 'startUpload',
        value: function () {
            var _ref13 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
                var file;
                return regeneratorRuntime.wrap(function _callee13$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                if (!(this.status !== Uploader.Status.UPLOADING)) {
                                    _context14.next = 17;
                                    break;
                                }

                            case 1:
                                if (!(this.filesQueue.filter(function (item) {
                                    return item.statusText === _file.WUFile.Status.QUEUED;
                                }).length > 0)) {
                                    _context14.next = 13;
                                    break;
                                }

                                this.status = Uploader.Status.UPLOADING;
                                file = this.filesQueue.filter(function (item) {
                                    return item.statusText === _file.WUFile.Status.QUEUED;
                                })[0];

                                if (!file.isFile) {
                                    _context14.next = 9;
                                    break;
                                }

                                _context14.next = 7;
                                return this.startHandleFile(file);

                            case 7:
                                _context14.next = 11;
                                break;

                            case 9:
                                _context14.next = 11;
                                return this.startHandleDir(file);

                            case 11:
                                _context14.next = 1;
                                break;

                            case 13:
                                if (!(this.filesQueue.filter(function (item) {
                                    return item.statusText === _file.WUFile.Status.QUEUED;
                                }).length === 0)) {
                                    _context14.next = 17;
                                    break;
                                }

                                _context14.next = 16;
                                return this.eventEmitter.emit('filesQueuedEmpty');

                            case 16:
                                this.status = Uploader.Status.INITED;

                            case 17:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function startUpload() {
                return _ref13.apply(this, arguments);
            }

            return startUpload;
        }()
    }, {
        key: 'startHandleDir',
        value: function () {
            var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
                return regeneratorRuntime.wrap(function _callee14$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function startHandleDir() {
                return _ref14.apply(this, arguments);
            }

            return startHandleDir;
        }()
    }, {
        key: 'startHandleFile',
        value: function () {
            var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(file) {
                var _this3 = this;

                var currentShared, currentProgress;
                return regeneratorRuntime.wrap(function _callee15$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                currentShared = 1;
                                currentProgress = 0;

                                file.statusText = _file.WUFile.Status.PROGRESS;
                                this.eventEmitter.on('uploadBeforeSend', function (obj) {
                                    currentShared = obj.currentShard;
                                });

                                this.eventEmitter.on('uploadBlobProgress', function (loaded, total) {
                                    if (currentProgress < loaded + _this3.config.chunkSize * (currentShared - 1)) {
                                        currentProgress = loaded + _this3.config.chunkSize * (currentShared - 1);
                                        _this3.eventEmitter.emit('uploadProgress', file, currentProgress, loaded, total);
                                    }
                                });
                                _context16.prev = 5;
                                _context16.next = 8;
                                return this._upfile(file);

                            case 8:
                                _context16.next = 10;
                                return this.eventEmitter.emit('uploadComplete', file);

                            case 10:
                                this.eventEmitter.removeEvent('uploadBlobProgress');
                                _context16.next = 20;
                                break;

                            case 13:
                                _context16.prev = 13;
                                _context16.t0 = _context16['catch'](5);

                                this.file.statusText = _file.WUFile.Status.ERROR;
                                this.status = Uploader.Status.FILEERROR;
                                _context16.next = 19;
                                return this.eventEmitter.emit('uploadError', file, _context16.t0);

                            case 19:
                                throw _context16.t0;

                            case 20:
                                _context16.prev = 20;

                                this.file = {};
                                return _context16.finish(20);

                            case 23:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee15, this, [[5, 13, 20, 23]]);
            }));

            function startHandleFile(_x14) {
                return _ref15.apply(this, arguments);
            }

            return startHandleFile;
        }()
    }, {
        key: '_upfile',
        value: function () {
            var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(file) {
                var shardCount, i, start, end, obj, res, _res;

                return regeneratorRuntime.wrap(function _callee16$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                this.file = file;
                                _context17.next = 3;
                                return this.eventEmitter.emit('uploadStart', file);

                            case 3:
                                if (!this.config.chunked) {
                                    _context17.next = 42;
                                    break;
                                }

                                shardCount = Math.ceil(file.size / this.config.chunkSize);

                                if (shardCount === 0) {
                                    shardCount = 1;
                                }
                                i = 0;

                            case 7:
                                if (!(i < shardCount)) {
                                    _context17.next = 40;
                                    break;
                                }

                                if (!(file.statusText === _file.WUFile.Status.PROGRESS)) {
                                    _context17.next = 36;
                                    break;
                                }

                                start = i * this.config.chunkSize, end = Math.min(file.size, start + this.config.chunkSize);
                                obj = file.source.slice(start, end);
                                _context17.next = 13;
                                return this.eventEmitter.emit('uploadBeforeSend', {
                                    file: file,
                                    shard: obj,
                                    shardCount: shardCount,
                                    currentShard: i + 1
                                });

                            case 13:
                                if (!(this.config.server.trim() === '')) {
                                    _context17.next = 15;
                                    break;
                                }

                                throw new Error('server could not be empty');

                            case 15:
                                _context17.prev = 15;
                                _context17.next = 18;
                                return this._baseupload(obj, file.name);

                            case 18:
                                res = _context17.sent;

                                if (!(shardCount === i + 1)) {
                                    _context17.next = 24;
                                    break;
                                }

                                this.file.statusText = _file.WUFile.Status.COMPLETE;
                                _context17.next = 23;
                                return this.eventEmitter.emit('uploadSuccess', file);

                            case 23:
                                this._removeFileFromQueue(file.id);

                            case 24:
                                _context17.next = 26;
                                return this.eventEmitter.emit('uploadAccept', {
                                    file: file,
                                    shard: obj,
                                    shardCount: shardCount,
                                    currentShard: i + 1
                                }, res);

                            case 26:
                                _context17.next = 32;
                                break;

                            case 28:
                                _context17.prev = 28;
                                _context17.t0 = _context17['catch'](15);
                                _context17.next = 32;
                                return this._catchUpfileError(_context17.t0, file);

                            case 32:
                                _context17.next = 34;
                                return this.eventEmitter.emit('uploadEndSend', {
                                    file: file,
                                    shard: obj,
                                    shardCount: shardCount,
                                    currentShard: i + 1
                                });

                            case 34:
                                _context17.next = 37;
                                break;

                            case 36:
                                return _context17.abrupt('break', 40);

                            case 37:
                                i++;
                                _context17.next = 7;
                                break;

                            case 40:
                                _context17.next = 62;
                                break;

                            case 42:
                                _context17.next = 44;
                                return this.eventEmitter.emit('uploadBeforeSend', {
                                    file: file
                                });

                            case 44:
                                _context17.prev = 44;
                                _context17.next = 47;
                                return this._baseupload(file.source, file.name);

                            case 47:
                                _res = _context17.sent;
                                _context17.next = 50;
                                return this.eventEmitter.emit('uploadAccept', { file: file }, _res);

                            case 50:
                                file.statusText = _file.WUFile.Status.COMPLETE;
                                _context17.next = 53;
                                return this.eventEmitter.emit('uploadSuccess', file);

                            case 53:
                                this._removeFileFromQueue(file.id);
                                _context17.next = 60;
                                break;

                            case 56:
                                _context17.prev = 56;
                                _context17.t1 = _context17['catch'](44);
                                _context17.next = 60;
                                return this._catchUpfileError(_context17.t1, file);

                            case 60:
                                _context17.next = 62;
                                return this.eventEmitter.emit('uploadEndSend', {
                                    file: file
                                });

                            case 62:
                                _context17.next = 64;
                                return this.eventEmitter.emit('fileUploadEnd', file);

                            case 64:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee16, this, [[15, 28], [44, 56]]);
            }));

            function _upfile(_x15) {
                return _ref16.apply(this, arguments);
            }

            return _upfile;
        }()
    }, {
        key: '_catchUpfileError',
        value: function () {
            var _ref17 = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(err, file) {
                return regeneratorRuntime.wrap(function _callee17$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                if (this.file.statusText === _file.WUFile.Status.INTERRUPT || this.file.statusText === _file.WUFile.Status.CANCELLED) {
                                    _context18.next = 5;
                                    break;
                                }

                                this.file.statusText = _file.WUFile.Status.ERROR;
                                this.status = Uploader.Status.FILEERROR;
                                _context18.next = 5;
                                return this.eventEmitter.emit('uploadError', file, err);

                            case 5:
                            case 'end':
                                return _context18.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function _catchUpfileError(_x16, _x17) {
                return _ref17.apply(this, arguments);
            }

            return _catchUpfileError;
        }()
    }, {
        key: 'destory',
        value: function destory() {
            this.eventEmitter.removeEvents();
            this.filesQueue = [];
            if (this.transport) {
                this.transport.abort();
            }

            if (this.config.dnd) {
                this.$(document).off('dragover', this._dndHandleDragover);
                this.$(document).off('dragleave', this._dndHandleDragleave);
                this.$(document).off('drop', this._dndHandleDrop);
            }
            this.$(document).off('change', this._pickOnChangeBindThis);
            if (this.config.pick) {
                this.$(document).off('click', this._pickOnClickBindThis);
            }
        }
    }, {
        key: '_removeFileFromQueue',
        value: function _removeFileFromQueue(id) {
            this.filesQueue = this.filesQueue.filter(function (file) {
                return file.id !== id;
            });
        }
    }, {
        key: 'removeFile',
        value: function removeFile(id) {
            this._removeFileFromQueue(id);
            if (this.file && this.file.id === id) {
                this.file.statusText = _file.WUFile.Status.CANCELLED;
                if (this.transport) {
                    this.transport.abort();
                }
            }
        }
    }, {
        key: 'interruptFile',
        value: function interruptFile(id) {
            if (this.file && this.file.id === id) {
                this.file.statusText = _file.WUFile.Status.INTERRUPT;
                if (this.transport) {
                    this.transport.abort();
                }
            }
        }

        //中断所有

    }, {
        key: 'interruptAllFile',
        value: function interruptAllFile(ids) {
            var _this4 = this;

            this.filesQueue.forEach(function (file) {
                if (_this4.file && _this4.file.id === file.id && ids[file.id]) {
                    _this4.interruptFile(file.id);
                } else if (ids[file.id]) {
                    file.statusText = _file.WUFile.Status.CANCELLED;
                }
            });
        }
    }, {
        key: 'resetFile',
        value: function () {
            var _ref18 = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(id) {
                return regeneratorRuntime.wrap(function _callee18$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                if (this.file && this.file.id !== id) {
                                    this.filesQueue.forEach(function (file) {
                                        if (file.id === id) {
                                            file.statusText = _file.WUFile.Status.QUEUED;
                                        }
                                    });
                                }

                                if (!(this.status !== Uploader.Status.UPLOADING)) {
                                    _context19.next = 4;
                                    break;
                                }

                                _context19.next = 4;
                                return this.startUpload();

                            case 4:
                            case 'end':
                                return _context19.stop();
                        }
                    }
                }, _callee18, this);
            }));

            function resetFile(_x18) {
                return _ref18.apply(this, arguments);
            }

            return resetFile;
        }()
    }, {
        key: '_baseupload',
        value: function () {
            var _ref19 = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(blob, fileName) {
                var config, res, i;
                return regeneratorRuntime.wrap(function _callee19$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                config = {
                                    server: this.config.server,
                                    method: this.config.method,
                                    fileVal: this.config.fileVal,
                                    timeout: this.config.timeout, // 2分钟
                                    formData: this.config.formData,
                                    headers: this.config.headers,
                                    fileName: fileName,
                                    withCredentials: this.config.withCredentials
                                };
                                res = null;
                                i = 0;

                            case 3:
                                if (!(i < this.config.chunkRetry)) {
                                    _context20.next = 22;
                                    break;
                                }

                                if (!(this.file.statusText === _file.WUFile.Status.PROGRESS)) {
                                    _context20.next = 18;
                                    break;
                                }

                                _context20.prev = 5;

                                this.transport = new _transport.Transport(blob, this.eventEmitter, config);
                                _context20.next = 9;
                                return this.transport.send();

                            case 9:
                                res = _context20.sent;
                                return _context20.abrupt('break', 22);

                            case 13:
                                _context20.prev = 13;
                                _context20.t0 = _context20['catch'](5);
                                throw new Error(_context20.t0);

                            case 16:
                                _context20.next = 19;
                                break;

                            case 18:
                                throw new Error('已取消');

                            case 19:
                                i++;
                                _context20.next = 3;
                                break;

                            case 22:
                                this.transport = null;
                                return _context20.abrupt('return', res);

                            case 24:
                            case 'end':
                                return _context20.stop();
                        }
                    }
                }, _callee19, this, [[5, 13]]);
            }));

            function _baseupload(_x19, _x20) {
                return _ref19.apply(this, arguments);
            }

            return _baseupload;
        }()
    }]);

    return Uploader;
}();

var UploaderStatus = exports.UploaderStatus = Uploader.Status = {
    INITED: 'inited',
    FILEERROR: 'fileError',
    UPLOADING: 'UPLOADING'
};

var FileStatus = exports.FileStatus = _file.WUFile.Status;