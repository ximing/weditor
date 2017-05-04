/**
 * Created by yeanzhi on 17/2/28.
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

var _rab = require('@rab');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Crumb = (_dec = (0, _rab.connect)(function (state) {
    return {
        path: state.file.currentPath
    };
}), _dec(_class = function (_Component) {
    _inherits(Crumb, _Component);

    function Crumb() {
        _classCallCheck(this, Crumb);

        return _possibleConstructorReturn(this, (Crumb.__proto__ || Object.getPrototypeOf(Crumb)).call(this));
        // this.handleClick = this.handleClick.bind(this);
    }

    _createClass(Crumb, [{
        key: 'handleClick',
        value: function handleClick(path) {
            var _this2 = this;

            return function () {
                _this2.props.dispatch({ type: 'file.getList', payload: path });
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var pathArr = /(\/person\/\d+)(.*)/.exec(this.props.path);
            if (!pathArr) {
                return _react2.default.createElement('span', null);
            }
            var childsPath = [];
            if (pathArr[2]) {
                childsPath = pathArr[2].split('/');
            }
            var basePath = pathArr[1];
            return _react2.default.createElement(
                'div',
                { className: 'crumb-container' },
                _react2.default.createElement(
                    'span',
                    { onClick: this.handleClick(basePath) },
                    '\u6839\u76EE\u5F55'
                ),
                childsPath.slice(1).map(function (_, i) {
                    basePath = basePath + '/' + _;
                    return _react2.default.createElement(
                        'span',
                        { key: i, onClick: _this3.handleClick(basePath) },
                        '>',
                        _
                    );
                })
            );
        }
    }]);

    return Crumb;
}(_react.Component)) || _class);
exports.default = Crumb;