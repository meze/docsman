import React, { PropTypes as T } from 'react';
import { Button, Header, Segment, Form, Divider, Label } from 'semantic-ui-react';
import { form } from 'react-inform';
import { notEmpty } from '../../../validation/rules';

const DocumentSettingsForm = ({ onSave, onBackClick, fields, isLoading, name, ...props }) => {
  function handleBackClick(e) {
    e.preventDefault();
    onBackClick();
  }

  function handleSubmit(e) {
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

DocumentSettingsForm.propTypes = {
  fields: T.object.isRequired,
  form: T.object.isRequired,
  isLoading: T.bool,
  name: T.string,
  onBackClick: T.func.isRequired,
  onChange: T.func,
  onSave: T.func.isRequired,
  value: T.object
};

const validate = ({ name }) => ({
  ...notEmpty('name', name, 'A document needs a name')
});

export default form({
  fields: ['name'],
  validate
})(DocumentSettingsForm);
