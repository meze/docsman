import React, { Component, PropTypes as T } from 'react';
import { Button, Header, Segment, Form, Message, Divider } from 'semantic-ui-react';

export default class DocumentSettings extends Component {
  static propTypes = {
    document: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    }),
    handleBackClick: T.func,
    handleSubmit: T.func,
    isLoading: T.bool,
    route: T.object,
    routeParams: T.object
  }

  state = {
    newName: '',
    disableDeleteButton: true
  }

  componentDidMount = () => {
    this.setState({
      newName: this.props.document.name
    });
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      newName: newProps.document.name
    });
  }

  toggleDeleteButton = (e, { checked }) => {
    this.setState({
      disableDeleteButton: !checked
    });
  }

  handleNameChange = ({ target: { value } }) => {
    this.setState({
      newName: value
    });
  }

  handleBackClick = (e) => {
    e.preventDefault();
    this.props.handleBackClick();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleSubmit(this.state.newName);
  }

  render() {
    return (
      <section>
        <Segment loading={this.props.isLoading}>
          <Header floated="left">Settings of {this.props.document.name}</Header>
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
        <Segment loading={this.props.isLoading}>
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
