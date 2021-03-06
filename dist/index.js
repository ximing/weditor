/**
 * Created by pomy on 07/02/2017.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.layerManager = exports.getEditor = exports.WEditor = exports.help = exports.editor = exports.insert = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _mobx = require('mobx');

require('./style/index.scss');

require('quill/dist/quill.snow.css');

var _quillEditor = require('./lib/quillEditor');

var _weditor = require('./weditor');

var _weditor2 = _interopRequireDefault(_weditor);

var _insert = require('./model/insert');

var _insert2 = _interopRequireDefault(_insert);

var _editor = require('./model/editor');

var _editor2 = _interopRequireDefault(_editor);

var _help = require('./model/help');

var _help2 = _interopRequireDefault(_help);

var _markerLayer = require('./model/markerLayer');

var _hooks = require('./lib/hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _layer = require('./lib/layer');

var _layer2 = _interopRequireDefault(_layer);

var _util = require('./lib/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.RangeFix = require('rangefix');
var Editor = (_temp = _class = function (_Component) {
    _inherits(Editor, _Component);

    function Editor(props) {
        _classCallCheck(this, Editor);

        var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

        _this.getEditor = _quillEditor.getEditor;
        _hooks2.default.onSave = props.hooks.onSave || _util.loop;
        return _this;
    }

    _createClass(Editor, [{
        key: 'setContents',
        value: function setContents(content) {
            if ((0, _quillEditor.getEditor)()) {
                (0, _quillEditor.getEditor)().setContents(content);
            }
        }
    }, {
        key: 'on',
        value: function on(eventName, callback) {
            var disposer = null;
            if (eventName === 'editor-change') {
                disposer = (0, _mobx.observe)(_editor2.default, callback);
            }
            return disposer;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _mobxReact.Provider,
                _extends({}, this.props.models, {
                    insert: _insert2.default,
                    editor: _editor2.default,
                    help: _help2.default,
                    forceUpdate: _markerLayer.forceUpdate
                }),
                _react2.default.createElement(_weditor2.default, { onlyRead: this.props.onlyRead,
                    modules: this.props.modules,
                    options: this.props.options,
                    toolbar: this.props.toolbar,
                    doc: this.props.doc })
            );
        }
    }]);

    return Editor;
}(_react.Component), _class.defaultProps = {
    options: {
        uploadUrl: '',
        helpOptions: [],
        fileOptions: []
    },
    doc: {
        name: '',
        status: ''
    },
    models: {},
    onlyRead: false,
    hooks: {},
    modules: {},
    toolbar: null
}, _temp);
exports.default = Editor;
exports.insert = _insert2.default;
exports.editor = _editor2.default;
exports.help = _help2.default;
exports.WEditor = _weditor2.default;
exports.getEditor = _quillEditor.getEditor;
exports.layerManager = _layer2.default;