// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { formatPattern } from 'react-router';
import CampaignsNav from '../components/CampaignsNav';
import * as CampaignActions from '../modules/Campaign/actions/handlers';
import documentUri from '../modules/Document/uri';
import type { CampaignType } from '../modules/Campaign/campaign';

type PropsType = {
  fetchIfNeeded: Function,
  isLoading: boolean,
  items: CampaignType[],
  selectedCampaign: number
}

class CampaignsNavContainer extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.fetchIfNeeded();
  }

  props: PropsType

  handleItemClick = (e: Event, { name }: { name: string }) => {
    e.preventDefault();
    this.context.router.push(formatPattern(documentUri.documents, { campaign: name }));
  }

  render() {
    const { items, isLoading, selectedCampaign } = this.props;

    return (
      <CampaignsNav
        isLoading={isLoading}
        items={items}
        handleItemClick={this.handleItemClick}
        activeItem={selectedCampaign}
      />
    );
  }
}

const mapStateToProps = (state: { campaigns: Object }, ownProps: PropsType) => {
  const { campaigns } = state;
  const {
    isLoading,
    items
  } = campaigns || {
    isLoading: true,
    items: []
  };

  return {
    items,
    isLoading,
    selectedCampaign: ownProps.selectedCampaign
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    fetchIfNeeded: () => dispatch(CampaignActions.fetchIfNeeded())
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(CampaignsNavContainer);
