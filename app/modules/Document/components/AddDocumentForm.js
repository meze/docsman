// @flow
import React from 'react';
import { Form, Segment, Loader, Button, Label } from 'semantic-ui-react';
import { form } from 'react-inform';
import { notEmpty } from '../../../validation/rules';

type PropsType = {
  onCancel: () => void,
  onSave: () => void,
  isLoading: boolean,
  fields: {
    name: Object,
    content: Object
  },
  content: string,
  form: Object,
  name: string,
}

const AddDocumentForm = ({ fields: { name, content }, isLoading, onSave, onCancel, ...props }: PropsType) => {
  function handleSubmitForm(e) {
    e.preventDefault();
    if (props.form.isValid()) {
      onSave();
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    onCancel();
  }

  return (
    <Segment>
      {isLoading ? <div className="ui active inverted dimmer">
        <Loader inverted={true}>Loading</Loader>
      </div> : ''}
      <Form onSubmit={handleSubmitForm}>
        <Form.Field width={8} error={!!name.error}>
          <label htmlFor="name">Name</label>
          <input name="name" label="Name" placeholder="Name" {...name.props} />
          {name.error && <Label basic={true} color="red" pointing={true}>{name.error}</Label>}
        </Form.Field>
        <Form.TextArea name="content" label="Document Content" placeholder="" {...content.props} />
        <Button type="submit" primary={true} disabled={!props.form.isValid()}>Submit</Button>
        <Button type="button" onClick={handleCancel}>Cancel</Button>
      </Form>
    </Segment>
  );
};

AddDocumentForm.defaultProps = {
  isLoading: false
};

const validate = ({ name }: { name: string }) => ({
  ...notEmpty('name', name, 'A document needs a name')
});

export default form({
  fields: ['name', 'content'],
  validate
})(AddDocumentForm);
