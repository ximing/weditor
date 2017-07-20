/**
 * Created by yeanzhi on 17/7/18.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineHeightStyle = exports.LineHeightAttribute = undefined;

var _quill = require('quill');

var _quill2 = _interopRequireDefault(_quill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Parchment = _quill2.default.import('parchment');

var Block = function (_Parchment$Block) {
  _inherits(Block, _Parchment$Block);

  function Block() {
    _classCallCheck(this, Block);

    return _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).apply(this, arguments));
  }

  return Block;
}(Parchment.Block);

var config = {
  scope: Parchment.Scope.BLOCK,
  whitelist: null //[1, 1.15, 1.35, 1.5, 2, 2.5, 3]
};

var LineHeightAttribute = new Parchment.Attributor.Attribute('lineheight', 'lineHeight', config);
var LineHeightStyle = new Parchment.Attributor.Style('lineheight', 'line-height', config);
// Parchment.register(LineHeightStyle)
exports.LineHeightAttribute = LineHeightAttribute;
exports.LineHeightStyle = LineHeightStyle;

//['1.0', '1.15', '1.35', '1.5', '12', '2.5', '3.0']