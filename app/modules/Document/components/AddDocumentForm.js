import React, { PropTypes as T } from 'react';
import { Form, Segment, Loader, Button, Label } from 'semantic-ui-react';
import { form } from 'react-inform';
import { notEmpty } from '../../../validation/rules';

const AddDocumentForm = ({ fields: { name, content }, isLoading, onSave, onCancel, ...props }) => {
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

AddDocumentForm.propTypes = {
  content: T.string,
  fields: T.object.isRequired,
  form: T.object.isRequired,
  isLoading: T.bool,
  name: T.string,
  onCancel: T.func.isRequired,
  onSave: T.func.isRequired
};

AddDocumentForm.defaultProps = {
  isLoading: false
};

const validate = ({ name }) => ({
  ...notEmpty('name', name, 'A document needs a name')
});

export default form({
  fields: ['name', 'content'],
  validate
})(AddDocumentForm);
