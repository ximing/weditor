/**
 * Created by yeanzhi on 17/7/18.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Embed = _quill2.default.import('blots/block/embed');

var Remind = function (_Embed) {
    _inherits(Remind, _Embed);

    function Remind() {
        _classCallCheck(this, Remind);

        return _possibleConstructorReturn(this, (Remind.__proto__ || Object.getPrototypeOf(Remind)).apply(this, arguments));
    }

    _createClass(Remind, null, [{
        key: 'create',
        value: function create(value) {
            var node = _get(Remind.__proto__ || Object.getPrototypeOf(Remind), 'create', this).call(this, value);
            // give it some margin
            //node.setAttribute('style', "height:0px; margin-top:10px; margin-bottom:10px;");
            return node;
        }
    }]);

    return Remind;
}(Embed);

Remind.blotName = 'remind'; //now you can use .ql-hr classname in your toolbar
Remind.className = 'ql-span';
Remind.tagName = 'span';
exports.default = Remind;