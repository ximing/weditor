/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/16
 */
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _enzyme = require('enzyme');

var _ = require('..');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('common-component', function () {
    it('Icon Snapshot Testing', function () {
        var component = _reactTestRenderer2.default.create(_react2.default.createElement(_2.default, { type: 'wode', spin: true, className: 'test', style: {} }));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Icon DOM Testing', function () {
        // Render a checkbox with label in the document
        var component = (0, _enzyme.shallow)(_react2.default.createElement(_2.default, { type: 'wode', spin: true, className: 'test', style: {} }));

        expect(component.text()).toEqual('');
        // component.find('input').simulate('change');
        // expect(component.text()).toEqual('On');
    });
});