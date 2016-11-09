import React, { Component, PropTypes as T } from 'react';
import { Button, Header, Segment, Form, Message } from 'semantic-ui-react';

export default class DeleteProjectForm extends Component {
  static propTypes = {
    isLoading: T.bool
  }

  state = {
    disableDeleteButton: true
  }

  toggleDeleteButton = (e, { checked }) => {
    this.setState({
      disableDeleteButton: !checked
    });
  }

  render() {
    const { isLoading } = this.props;

    return (
      <Segment loading={isLoading}>
        <Message negative={true}>
          <Header content="Move this project to trash" dividing={true} />
          <br />
          <Form className="fluid">
            <Form.Checkbox onChange={this.toggleDeleteButton} inline={true} label="Yes, I want to move this project and all its documents to trash" />
            <Button color="red" size="small" disabled={this.state.disableDeleteButton}>Trash</Button>
          </Form>
        </Message>
      </Segment>
    );
  }
}
