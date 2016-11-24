import React, { Component, PropTypes as T } from 'react';
import { Table, Button, Header, Segment, Divider } from 'semantic-ui-react';
import { Link, formatPattern } from 'react-router';
import Timeago from '../../../components/Timeago';
import documentUri from '../uri';

const TableFullWidth = (props) => {
  const rows = props.items.map((item) => {
    // const arr = ['jpeg', 'doc', 'pdf', 'tiff'];
    // const key = Math.floor(Math.random() * arr.length);
    // const colors = ['pink', 'blue', 'red', 'teal'];
    /* <Table.Cell>
      <Label circular={true} color={colors[key]} empty={true} size="mini" />
      {' '}
      {arr[key]}
    </Table.Cell> */

    return (
      <Table.Row key={item.id} warning={item.id === props.lastId}>
        <Table.Cell>
          <Link to={formatPattern(documentUri.document, { project: props.projectId, document: item.id })}>{item.name}</Link>
        </Table.Cell>
        <Table.Cell><Timeago time={item.creationDate} /></Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Table celled={true} compact={true} selectable={rows.length > 0} basic="very">
      <Table.Header fullWidth={true}>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell width={3}>Last Modified</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows}
        {rows.length === 0 ? <Table.Row>
          <Table.Cell colSpan={2} textAlign="center">No documents yet</Table.Cell>
        </Table.Row> : null}
      </Table.Body>
    </Table>
  );
};

TableFullWidth.propTypes = {
  items: T.array,
  lastId: T.number,
  projectId: T.number.isRequired
};

export default class DocumentList extends Component {
  static propTypes = {
    handleAddDocumentClick: T.func,
    handleSettingsClick: T.func,
    isLoading: T.bool,
    items: T.array,
    lastId: T.number,
    project: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    }),
    projectId: T.string,
    route: T.object,
    routeParams: T.object
  }

  handleSettingsClick = (e) => {
    e.preventDefault();
    this.props.handleSettingsClick();
  }

  render() {
    return (
      <section>
        <Segment loading={this.props.isLoading}>
          <Header floated="left">Documents</Header>
          <Button
            icon="pencil"
            floated="right"
            compact={true}
            color="grey"
            size="small"
            onClick={this.handleSettingsClick}
          />
          <Button
            floated="right"
            compact={true}
            primary={true}
            size="small"
            onClick={this.props.handleAddDocumentClick}
            content="Add"
          />
          <Divider clearing={true} />
          <TableFullWidth lastId={this.props.lastId} items={this.props.items} projectId={this.props.project.id} />
        </Segment>
      </section>
    );
  }
}
