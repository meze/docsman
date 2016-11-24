import expect from 'expect';
import React from 'react';
import ProjectSettingsForm from 'modules/Project/components/ProjectSettingsForm';
import { mount } from 'enzyme';

function setup(isLoading = false) {
  const props = {
    isLoading,
    onSave: () => {},
    onBackClick: () => {}
  };

  return mount(<ProjectSettingsForm {...props} />);
}

describe('(Modules - Project) Components/ProjectSettingsForm', () => {
  it('shows loader', () => {
    const segment = setup(true).find('Segment');

    expect(segment.props().loading).toBe(true);
  });

  it('renders form', () => {
    const cmp = setup();
    const form = cmp.find('form');
    const input = cmp.find('input[name="name"]');
    const submit = cmp.find('button[type="submit"]');
    const loader = cmp.find('Loader');
    const segment = cmp.find('Segment');

    expect(segment.props().loading).toBe(false);
    expect(input.length).toBe(1);
    expect(form.length).toBe(1);
    expect(submit.length).toBe(1);
    expect(loader.length).toBe(0);
    expect(/disabled/.test(submit.props().className)).toBe(true);
  });

  it('renders an error if name is empty', () => {
    const cmp = setup();
    const input = cmp.find('input[name="name"]');
    input.simulate('change', { target: { value: 'test' } });
    input.simulate('change', { target: { value: '' } });
    input.simulate('blur');

    const error = cmp.find('.ui.red.label');
    expect(error.length).toBe(1);
  });

  it('enables submit if form is valid', () => {
    const cmp = setup();
    const input = cmp.find('input[name="name"]');
    const submit = cmp.find('button[type="submit"]');
    input.simulate('change', { target: { value: 'test' } });

    const error = cmp.find('.ui.red.label');
    expect(error.length).toBe(0);
    expect(/disabled/.test(submit.props().className)).toBe(false);
  });
});
