// @flow
import React, { Component } from 'react';
import { Table, Button, Divider } from 'semantic-ui-react';
import { Link, formatPattern } from 'react-router';
import Timeago from '../../../components/Timeago';
import type { CampaignType } from '../../Campaign/campaign';

type TablePropsType = {
  items: DocumentType[],
  campaignId: number,
  lastId: number
}

const TableComponent = (props: TablePropsType) => {
  const rows = (props.items || []).map((item) => {
    return (
      <Table.Row key={item.id}>
        <Table.Cell>
          {item.name}
        </Table.Cell>
        <Table.Cell><Timeago time={item.createdAt} /></Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Table celled={true} compact={true} selectable={rows.length > 0} basic="very">
      <Table.Header fullWidth={true}>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell width={3}>Created</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows}
        {rows.length === 0 ? <Table.Row>
          <Table.Cell colSpan={2} textAlign="center">No campaigns has been started yet.</Table.Cell>
        </Table.Row> : null}
      </Table.Body>
    </Table>
  );
};

type CampaignListPropsType = {
  items: CampaignType[],
  isLoading: boolean
}

export default class CampaignList extends Component {
  props: CampaignListPropsType

  handleSettingsClick = (e: Event) => {
  }

  render() {
    return (
      <TableComponent items={this.props.items} />
    );
  }
}
