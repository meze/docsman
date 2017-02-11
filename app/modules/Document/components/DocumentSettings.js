// @flow
import React, { Component } from 'react';
import { Button, Header, Segment, Form, Message, Divider } from 'semantic-ui-react';
import type { DocumentType } from '../document';

type DocumentSettingsType = {
  isLoading: boolean,
  handleBackClick: () => void,
  handleSubmit: () => void,
  route: Object,
  routeParams: Object,
  document: DocumentType
}

type StateType = {
  newName: string,
  disableDeleteButton: boolean
}

export default class DocumentSettings extends Component {
  state: StateType = {
    newName: '',
    disableDeleteButton: true
  }

  componentDidMount = () => {
    this.setState({
      newName: this.props.document.name
    });
  }

  componentWillReceiveProps = (newProps: DocumentSettingsType) => {
    this.setState({
      newName: newProps.document.name
    });
  }

  props: DocumentSettingsType;

  toggleDeleteButton = (e: Event, { checked }: { checked: boolean }) => {
    this.setState({
      disableDeleteButton: !checked
    });
  }

  handleNameChange = ({ target: { value } }: SyntheticInputEvent) => {
    this.setState({
      newName: value
    });
  }

  handleBackClick = (e: Event) => {
    e.preventDefault();
    this.props.handleBackClick();
  }

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.props.handleSubmit(this.state.newName);
  }

  render() {
    const { isLoading } = this.props;

    return (
      <section>
        <Segment loading={isLoading}>
          <Header floated="left">Basic Settings</Header>
          <Button icon="list" floated="right" compact={true} color="grey" size="tiny" onClick={this.handleBackClick} />
          <Divider clearing={true} />
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Name</label>
              <input name="newName" placeholder="Name" value={this.state.newName} onChange={this.handleNameChange} />
            </Form.Field>
            <Button type="submit" size="small">Rename</Button>
          </Form>
        </Segment>
        <Segment loading={isLoading}>
          <Message negative={true}>
            <Header content="Move this document to trash" dividing={true} />
            <br />
            <Form className="fluid">
              <Form.Checkbox onChange={this.toggleDeleteButton} inline={true} label="Yes, I want to move this document to trash" />
              <Button color="red" size="small" disabled={this.state.disableDeleteButton}>Trash</Button>
            </Form>
          </Message>
        </Segment>
      </section>
    );
  }
}
