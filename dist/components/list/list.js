/**
 * Created by yeanzhi on 17/2/20.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

require('./style/item.scss');

require('./style/file.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _fileListHeader = require('./fileListHeader');

var _fileListHeader2 = _interopRequireDefault(_fileListHeader);

var _router = require('@rab/router');

var _rab = require('@rab');

var _crumb = require('./crumb');

var _crumb2 = _interopRequireDefault(_crumb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var push = _router.routerRedux.push;
var List = (_dec = (0, _rab.connect)(function (state) {
    return {
        file: state.file
    };
}), _dec(_class = function (_Component) {
    _inherits(List, _Component);

    function List() {
        _classCallCheck(this, List);

        return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this));
    }

    _createClass(List, [{
        key: 'edit',
        value: function edit(item) {
            var _this2 = this;

            return function () {
                if (item.isDir) {
                    _this2.props.dispatch({ type: 'file.getList', payload: item.path });
                } else {
                    _this2.props.dispatch(push('/ot/edit?path=' + item.path));
                }
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            try {
                return _react2.default.createElement(
                    'div',
                    { className: 'file-list-container' },
                    _react2.default.createElement(_crumb2.default, null),
                    _react2.default.createElement(_fileListHeader2.default, null),
                    _react2.default.createElement(
                        'div',
                        { className: 'file-list-view' },
                        this.props.file.list.map(function (_, i) {
                            return _react2.default.createElement(_item2.default, { onSelect: function onSelect() {},
                                clickItem: _this3.edit(_),
                                item: _, key: i });
                        })
                    )
                );
            } catch (err) {
                console.log(err);
            }
        }
    }]);

    return List;
}(_react.Component)) || _class);
exports.default = List;