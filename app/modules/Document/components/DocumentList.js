// @flow
import React, { Component } from 'react';
import { Table, Button, Header, Segment, Divider } from 'semantic-ui-react';
import { Link, formatPattern } from 'react-router';
import Timeago from '../../../components/Timeago';
import documentUri from '../uri';
import type { DocumentType } from '../document';
import type { ProjectType } from '../../Project/project';

type TableFullWidthPropsType = {
  items: DocumentType[],
  projectId: number,
  lastId: number
}

const TableFullWidth = (props: TableFullWidthPropsType) => {
  const rows = props.items.map((item) => {
    // const arr = ['jpeg', 'doc', 'pdf', 'tiff'];
    // const key = Math.floor(Math.random() * arr.length);
    // const colors = ['pink', 'blue', 'red', 'teal'];
    /* <Table.Cell>
      <Label circular={true} color={colors[key]} empty={true} size="mini" />
      {' '}
      {arr[key]}
    </Table.Cell> */

    const isLast = item.id === props.lastId;

    return (
      <Table.Row key={item.id} warning={isLast}>
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

type DocumentListPropsType = {
  items: DocumentType[],
  project: ProjectType,
  handleSettingsClick: (e: Event) => void,
  handleAddDocumentClick: (e: Event) => void,
  isLoading: boolean,
  lastId: number
}

export default class DocumentList extends Component {
  props: DocumentListPropsType

  handleSettingsClick = (e: Event) => {
    this.props.handleSettingsClick(e);
  }

  render() {
    return (
      <section>
        <Segment loading={this.props.isLoading}>
          <Header floated="left">Documents</Header>
          <span className="sticker">
            <Button
              icon="setting"
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
          </span>
          <Divider clearing={true} />
          <TableFullWidth lastId={this.props.lastId} items={this.props.items} projectId={this.props.project.id} />
        </Segment>
      </section>
    );
  }
}
