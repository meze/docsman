// @flow
import React from 'react';
import { Button, Header, Segment, Form, Divider, Label } from 'semantic-ui-react';
import { form } from 'react-inform';
import { notEmpty } from '../../../validation/rules';

type PropsType = {
  fields: {
    name: Object,
    content: Object
  },
  form: Object,
  isLoading: boolean,
  name: string,
  onBackClick: () => void,
  onSave: () => void
}

const ProjectSettingsForm = ({ onSave, onBackClick, fields, isLoading, name, ...props }: PropsType) => {
  function handleBackClick(e: Event) {
    e.preventDefault();
    onBackClick();
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (props.form.isValid()) {
      onSave();
    }
  }

  return (
    <Segment loading={isLoading}>
      <Header floated="left">Basic Settings</Header>
      <Button icon="long arrow left" floated="right" compact={true} color="grey" size="tiny" onClick={handleBackClick} />
      <Divider clearing={true} />
      <Form onSubmit={handleSubmit}>
        <Form.Field width={8} error={!!fields.name.error}>
          <label htmlFor="name">Name</label>
          <input name="name" label="Name" placeholder="Name" {...fields.name.props} />
          {fields.name.error && <Label basic={true} color="red" pointing={true} onRemove={null} content={fields.name.error} />}
        </Form.Field>
        <Button type="submit" size="small" disabled={!props.form.isValid()}>Rename</Button>
      </Form>
    </Segment>
  );
};

const validate = ({ name }: { name: string }) => ({
  ...notEmpty('name', name, 'A project needs a name')
});

export default form({
  fields: ['name'],
  validate
})(ProjectSettingsForm);
