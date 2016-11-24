import React, { Component, PropTypes as T } from 'react';
import { Button, Header, Segment, Form, Message } from 'semantic-ui-react';

export default class DeleteProjectForm extends Component {
  static propTypes = {
    isLoading: T.bool,
    onRemove: T.func.isRequired
  }

  state = {
    disableButton: true
  }

  toggleButton = (e, { checked }) => {
    this.setState({
      disableButton: !checked
    });
  }

  handleRemove = (e) => {
    e.preventDefault();
    this.props.onRemove();
  }

  render() {
    const { isLoading } = this.props;

    return (
      <Segment loading={isLoading}>
        <Message negative={true}>
          <Header content="Move this project to trash" dividing={true} />
          <br />
          <Form className="fluid" onSubmit={this.handleRemove}>
            <Form.Checkbox name="confirmed" onChange={this.toggleButton} inline={true} label="Yes, I want to move this project and all its documents to trash" />
            <Button color="red" size="small" type="submit" disabled={this.state.disableButton}>Trash</Button>
          </Form>
        </Message>
      </Segment>
    );
  }
}
