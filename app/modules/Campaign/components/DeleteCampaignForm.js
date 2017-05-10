// @flow
import React, { Component } from 'react';
import { Button, Header, Segment, Form, Message } from 'semantic-ui-react';

type StateType = {
  disableButton: boolean
}

type PropsType = {
  isLoading: boolean,
  onRemove: () => void
}

export default class DeleteCampaignForm extends Component {
  state: StateType = {
    disableButton: true
  }

  props: PropsType

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
          <Header content="Move this campaign to trash" dividing={true} />
          <br />
          <Form className="fluid" onSubmit={this.handleRemove}>
            <Form.Checkbox name="confirmed" onChange={this.toggleButton} inline={true} label="Yes, I want to move this campaign and all its documents to trash" />
            <Button color="red" size="small" type="submit" disabled={this.state.disableButton}>Trash</Button>
          </Form>
        </Message>
      </Segment>
    );
  }
}
