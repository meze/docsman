import React, { PropTypes as T } from 'react';
import { form } from 'react-inform';
import { Form, Segment, Label, Button } from 'semantic-ui-react';
import { notEmpty } from '../../../validation/rules';

const AddProjectForm = ({ fields: { name }, isLoading, onSave, ...props }) => {
  function handleSubmitForm(e) {
    e.preventDefault();
    if (props.form.isValid()) {
      onSave();
    }
  }

  return (
    <Segment loading={isLoading}>
      <Form onSubmit={handleSubmitForm}>
        <Form.Field width={8} error={!!name.error}>
          <label htmlFor="name">Name</label>
          <input name="name" label="Name" placeholder="Name" {...name.props} />
          {name.error && <Label basic={true} color="red" pointing={true} content={name.error} onRemove={null} />}
        </Form.Field>
        <Button type="submit" primary={true} disabled={!props.form.isValid()}>Submit</Button>
      </Form>
    </Segment>
  );
};

AddProjectForm.propTypes = {
  fields: T.object.isRequired,
  form: T.object.isRequired,
  isLoading: T.bool.isRequired,
  onSave: T.func.isRequired
};

const validate = ({ name }) => ({
  ...notEmpty('name', name, 'A project needs a name')
});

export default form({
  fields: ['name'],
  validate
})(AddProjectForm);
