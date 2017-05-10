// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import CampaignSettingsForm from '../components/CampaignSettingsForm';
import DeleteCampaignForm from '../components/DeleteCampaignForm';
import * as actions from '../../Campaign/actions/handlers';
import documentUri from '../../Document/uri';
import type { CampaignType, CampaignSettingsType } from '../campaign';
import type { StateType } from '../../../types/redux';

type PropsType = {
  actions: typeof actions,
  isLoading: boolean,
  campaign: CampaignType,
  campaignId: number,
  routeParams: Object
}

type LocalStateType = {
  settings: CampaignSettingsType
}

class CampaignSettingsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state: LocalStateType = {
    settings: {
      name: ''
    }
  }

  componentDidMount() {
    if (this.props.campaignId > 0) {
      this.props.actions.switchTo(this.props.campaignId);
    }
  }

  componentWillReceiveProps(newProps: PropsType) {
    this.setState({
      settings: {
        name: newProps.campaign.name
      }
    });
    if (newProps.campaignId !== this.props.campaignId) {
      this.props.actions.switchTo(newProps.campaignId);
    }
  }

  props: PropsType

  onBackClick = () => {
    this.context.router.push(formatPattern(documentUri.documents, { campaign: this.props.campaign.id }));
  }

  onSave = () => {
    return this.props.actions.update(Object.assign({}, this.props.campaign, this.state.settings));
  }

  onRemove = () => {
    return this.props.actions.remove(this.props.campaign.id).then(() => {
      this.context.router.push('/');
    });
  }

  onChange = (data: CampaignSettingsType) => {
    this.setState({
      settings: data
    });
  }

  render() {
    const { isLoading, campaign } = this.props;

    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { campaign: campaign.id })}>{campaign.name}</Link>, key: 1 },
      { content: 'Settings', active: true, key: 2 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb isLoading={!!campaign.isLoading} sections={sections} />
        <Grid>
          <Grid.Column width={16}>
            <CampaignSettingsForm
              onChange={this.onChange}
              value={this.state.settings}
              name={campaign.name}
              isLoading={isLoading}
              onSave={this.onSave}
              onBackClick={this.onBackClick}
              campaign={campaign}
            />
            <DeleteCampaignForm onRemove={this.onRemove} isLoading={isLoading} />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { campaigns } = state;
  const {
    isLoading
  } = campaigns || {
    isLoading: true
  };

  return {
    campaign: campaigns.currentCampaign,
    campaignId: parseInt(ownProps.routeParams.campaign, 10) || 0,
    isLoading
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(CampaignSettingsPage);
export { CampaignSettingsPage as PureCampaignSettingsPage };
