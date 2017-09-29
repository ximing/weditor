'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

require('./mention.scss');

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Embed = _quill2.default.import('blots/embed');

var Mention = function (_Embed) {
    _inherits(Mention, _Embed);

    function Mention() {
        _classCallCheck(this, Mention);

        return _possibleConstructorReturn(this, (Mention.__proto__ || Object.getPrototypeOf(Mention)).apply(this, arguments));
    }

    _createClass(Mention, [{
        key: 'format',
        value: function format(name, value) {
            // if (name !== this.statics.blotName || !value) return super.format(name, value);
            // value = this.constructor.sanitize(value);
            // this.domNode.setAttribute('href', value);
        }
    }], [{
        key: 'create',
        value: function create(value, x) {
            // debugger
            var node = _get(Mention.__proto__ || Object.getPrototypeOf(Mention), 'create', this).call(this, value);
            node.setAttribute('sponsoruid', value.sponsoruid);
            node.setAttribute('receiveruid', value.receiveruid);
            node.setAttribute('name', value.name);
            if (window.userInfo && window.userInfo.uid == value.receiveruid) {
                node.setAttribute('data-me', 'true');
            }
            // debugger
            node.innerHTML = '@' + value.name;
            return node;
        }
    }, {
        key: 'formats',
        value: function formats(domNode) {
            var format = {};
            format.sponsoruid = domNode.getAttribute('sponsoruid');
            format.receiveruid = domNode.getAttribute('receiveruid');
            format.name = domNode.getAttribute('name');
            format.f = 'f';
            // debugger
            return format;
        }
    }, {
        key: 'value',
        value: function value(node) {
            var opsInsert = {};
            opsInsert.sponsoruid = node.getAttribute('sponsoruid');
            opsInsert.receiveruid = node.getAttribute('receiveruid');
            opsInsert.name = node.getAttribute('name');
            opsInsert.v = 'v';
            // debugger
            return opsInsert;
        }
    }]);

    return Mention;
}(Embed);

Mention.blotName = 'mention';
Mention.tagName = 'SPAN';
Mention.className = 'mention-embed';

exports.default = Mention;