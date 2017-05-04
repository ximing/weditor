/**
 * Created by yeanzhi on 17/3/20.
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

var _index = require('./components/icon/index');

var _index2 = _interopRequireDefault(_index);

var _quillEditor = require('./lib/quillEditor');

var _mobxReact = require('mobx-react');

var _util = require('./lib/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommonEditor = (_dec = (0, _mobxReact.inject)('catalogue'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
    _inherits(CommonEditor, _Component);

    function CommonEditor() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, CommonEditor);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CommonEditor.__proto__ || Object.getPrototypeOf(CommonEditor)).call.apply(_ref, [this].concat(args))), _this), _this.toggleCatalogue = function () {
            if ((0, _quillEditor.getEditor)()) {
                var ops = (0, _quillEditor.getEditor)().getContents().ops;
                var _ops = [];
                ops = ops.forEach(function (item, i) {
                    if (ops[i + 1] && ops[i + 1].attributes && ops[i + 1].attributes.header && (0, _util.is)('String', item.insert)) {
                        _ops.push({
                            h: ops[i + 1].attributes.header,
                            content: item.insert
                        });
                    }
                });
                console.log(_ops);
                _this.props.catalogue.open = true;
                _this.props.catalogue.list = _ops;
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(CommonEditor, [{
        key: 'render',
        value: function render() {
            var style = this.props.style;

            return _react2.default.createElement(
                'span',
                { className: 'ql-formats view-header', style: style },
                _react2.default.createElement(
                    'span',
                    { className: 'ql-catalogue opver-area', onClick: this.toggleCatalogue },
                    _react2.default.createElement('span', { className: 'opver-icon catalogue-icon' }),
                    _react2.default.createElement(
                        'span',
                        null,
                        '\u663E\u793A\u76EE\u5F55'
                    )
                )
            );
        }
    }]);

    return CommonEditor;
}(_react.Component)) || _class) || _class);
exports.default = CommonEditor;