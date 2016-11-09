import expect from 'expect';
import React from 'react';
import DeleteProjectForm from 'modules/Project/components/DeleteProjectForm';
import { mount } from 'enzyme';

function setup(isLoading = false) {
  const props = {
    isLoading
  };

  return mount(<DeleteProjectForm {...props} />);
}

describe('(Modules - Project) Components/DeleteProjectForm', () => {
  it('shows loader', () => {
    const segment = setup(true).find('Segment');

    expect(segment.props().loading).toBe(true);
  });

  it('renders form', () => {
    const cmp = setup();
    const segment = cmp.find('Segment');
    const form = cmp.find('form');
    const submit = cmp.find('button.red');

    expect(segment.props().loading).toBe(false);
    expect(form.length).toBe(1);
    expect(/disabled/.test(submit.props().className)).toBe(true);
  });

  it('enables delete button if confirmed', () => {
    const cmp = setup();
    const submit = cmp.find('button.red');
    cmp.find('input[type="checkbox"]').simulate('click');

    expect(/disabled/.test(submit.props().className)).toBe(false);
  });
});
