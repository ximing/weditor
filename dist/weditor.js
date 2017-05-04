/**
 * Created by yeanzhi on 17/3/26.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hotkeysJs = require('hotkeys-js');

var _hotkeysJs2 = _interopRequireDefault(_hotkeysJs);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _catalogue = require('./catalogue');

var _catalogue2 = _interopRequireDefault(_catalogue);

var _linkBubble = require('./components/linkBubble');

var _linkBubble2 = _interopRequireDefault(_linkBubble);

var _insertImage = require('./components/insertImage');

var _insertImage2 = _interopRequireDefault(_insertImage);

var _hotKeysDialog = require('./components/hotKeysDialog');

var _hotKeysDialog2 = _interopRequireDefault(_hotKeysDialog);

var _mobxReact = require('mobx-react');

var _selection = require('./components/selection');

var _selection2 = _interopRequireDefault(_selection);

var _otherSelection = require('./components/otherSelection');

var _otherSelection2 = _interopRequireDefault(_otherSelection);

var _editor = require('./components/editor');

var _editor2 = _interopRequireDefault(_editor);

var _editor3 = require('./model/editor');

var _editor4 = _interopRequireDefault(_editor3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $ = window.jQuery;
var WEditor = (_dec = (0, _mobxReact.inject)(function (state) {
    return {
        insert: state.insert,
        open: state.catalogue.open,
        focus: state.editor.focus,
        help: state.help
    };
}), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
    _inherits(WEditor, _Component);

    function WEditor() {
        _classCallCheck(this, WEditor);

        var _this = _possibleConstructorReturn(this, (WEditor.__proto__ || Object.getPrototypeOf(WEditor)).call(this));

        _this.state = {
            left: window.innerWidth / 2 - 400,
            scrollTop: 0
        };
        return _this;
    }

    _createClass(WEditor, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var editorDom = this.editorDom = $(_reactDom2.default.findDOMNode(this.refs.editor)).find('.ql-editor');
            editorDom.on('blur', function () {
                _editor4.default.focus = false;
            });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this.setState({
                left: nextProps.open ? window.innerWidth / 2 - 300 : window.innerWidth / 2 - 400
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'weditor-wrapper' },
                _react2.default.createElement(_header2.default, { doc: this.props.doc,
                    rightContent: this.props.rightContent,
                    helpOptions: this.props.options.helpOptions }),
                _react2.default.createElement(
                    'div',
                    { className: 'weditor-body' },
                    _react2.default.createElement(_catalogue2.default, null),
                    _react2.default.createElement(
                        'div',
                        { className: 'content-container',
                            style: { left: this.state.left } },
                        !this.props.focus && _react2.default.createElement(_selection2.default, { scrollTop: this.state.scrollTop }),
                        _react2.default.createElement(_editor2.default, null),
                        this.props.coCursors.map(function (item) {
                            return _react2.default.createElement(_otherSelection2.default, { key: item.id, name: item.name, range: item.range });
                        })
                    )
                ),
                this.props.insert.openLinkDialog && _react2.default.createElement(_linkBubble2.default, null),
                this.props.insert.openImageDialog && _react2.default.createElement(_insertImage2.default, { uploadUrl: this.props.options.uploadUrl }),
                this.props.help.hotKeysDialog && _react2.default.createElement(_hotKeysDialog2.default, null)
            );
        }
    }]);

    return WEditor;
}(_react.Component)) || _class) || _class);
exports.default = WEditor;