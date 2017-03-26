/**
 * Created by pomy on 09/03/2017.
 */

import React from 'react';
import {shallow} from 'enzyme';

import Info from '../src/components/info';

it('should render correct contents', () => {

    const info = shallow(
        <Info />
    );

    expect(info.find('h2').text()).toEqual('project info:');
});