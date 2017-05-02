/**
 * Created by liz
 * Email: lizhengnacl@163.com
 * Tel: 18686768624
 * Date: 16/12/16
 */
'use strict';

import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Icon from '..';

describe('common-component', function () {
    it('Icon Snapshot Testing', function () {
        var component = renderer.create(React.createElement(Icon, { type: 'wode', spin: true, className: 'test', style: {} }));
        var tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    it('Icon DOM Testing', function () {
        // Render a checkbox with label in the document
        var component = shallow(React.createElement(Icon, { type: 'wode', spin: true, className: 'test', style: {} }));

        expect(component.text()).toEqual('');
        // component.find('input').simulate('change');
        // expect(component.text()).toEqual('On');
    });
});