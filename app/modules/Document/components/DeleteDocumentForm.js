// @flow
import React, { Component } from 'react';
import { Button, Header, Segment, Form, Message } from 'semantic-ui-react';

type DeleteDocumentFormPropsType = {
  isLoading: boolean,
  onRemove: () => void
}

type DeleteDocumentFormStateType = {
  disableButton: boolean
}

export default class DeleteDocumentForm extends Component {
  state = {
    disableButton: true
  }

  state: DeleteDocumentFormStateType;
  props: DeleteDocumentFormPropsType;

  toggleButton = (e: Event, { checked }: HTMLInputElement) => {
    this.setState({
      disableButton: !checked
    });
  }

  handleRemove = (e: Event) => {
    e.preventDefault();
    this.props.onRemove();
  }

  render() {
    const { isLoading } = this.props;

    return (
      <Segment loading={isLoading}>
        <Message negative={true}>
          <Header content="Move this document to trash" dividing={true} />
          <br />
          <Form className="fluid" onSubmit={this.handleRemove}>
            <Form.Checkbox name="confirmed" onChange={this.toggleButton} inline={true} label="Yes, I want to move this document to trash" />
            <Button color="red" size="small" disabled={this.state.disableButton}>Trash</Button>
          </Form>
        </Message>
      </Segment>
    );
  }
}
