// @flow
import React, { Component } from 'react';
import { Table, Button, Divider } from 'semantic-ui-react';
import { Link, formatPattern } from 'react-router';
import Timeago from '../../../components/Timeago';
import documentUri from '../uri';
import type { DocumentType } from '../document';
import type { CampaignType } from '../../Campaign/campaign';

type TableFullWidthPropsType = {
  items: DocumentType[],
  campaignId: number,
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
          <Link to={formatPattern(documentUri.document, { campaign: props.campaignId, document: item.id })}>{item.name}</Link>
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
  campaign: CampaignType,
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
      <TableFullWidth lastId={this.props.lastId} items={this.props.items} campaignId={this.props.campaign.id} />
    );
  }
}
