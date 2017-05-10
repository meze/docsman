// @flow
import React from 'react';
import { form } from 'react-inform';
import { Form, Label, Button } from 'semantic-ui-react';
import { notEmpty } from '../../../validation/rules';

type PropsType = {
  onSave: () => void,
  isLoading: boolean,
  fields: {
    name: Object,
    content: Object
  },
  form: Object
}

const AddCampaignForm = ({ fields: { name }, isLoading, onSave, ...props }: PropsType) => {
  function handleSubmitForm(e: Event) {
    e.preventDefault();
    if (props.form.isValid()) {
      onSave();
    }
  }

  return (
    <Form onSubmit={handleSubmitForm}>
      <Form.Field width={8} error={!!name.error}>
        <label htmlFor="name">Name</label>
        <input name="name" label="Name" placeholder="Name" {...name.props} />
        {name.error && <Label basic={true} color="red" pointing={true} content={name.error} onRemove={null} />}
      </Form.Field>
      <Button type="submit" primary={true} disabled={!props.form.isValid()}>Add</Button>
    </Form>
  );
};

const validate = ({ name }: { name: string }) => ({
  ...notEmpty('name', name, 'A campaign needs a name')
});

export default form({
  fields: ['name'],
  validate
})(AddCampaignForm);
