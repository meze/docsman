import expect from 'expect';
import React from 'react';
import Timeago from 'components/Timeago';
import { shallow } from 'enzyme';

describe('(Component) Timeago', () => {
  let _wrapper;

  beforeEach(() => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const props = {
      time: fiveDaysAgo.toISOString()
    };

    _wrapper = shallow(<Timeago {...props} />);
  });

  it('renders how many days have passed since the date', () => {
    const welcome = _wrapper.find('span');
    expect(welcome.length).toBe(1);
    expect(welcome.text()).toMatch(/5 days ago/);
  });
});
