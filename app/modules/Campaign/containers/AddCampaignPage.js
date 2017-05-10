// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatPattern, Link } from 'react-router';
import { Grid, Segment, Header, Menu } from 'semantic-ui-react';
import AddCampaignForm from '../components/AddCampaignForm';
import * as actions from '../actions/handlers';
import documentUri from '../../Document/uri';
import campaignUri from '../../Campaign/uri';
import type { CampaignType } from '../campaign';
import type { StateType } from '../../../types/redux';

type LocalStateType = {
  name: string
}

type PropsType = {
  isLoading: boolean,
  actions: {
    save: (state: LocalStateType) => Promise<CampaignType>
  }
}

class AddCampaignPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state: LocalStateType = {
    name: ''
  }

  props: PropsType

  handleChange = (data: LocalStateType) => {
    this.setState(data);
  }

  onSave = () => {
    return this.props.actions.save({
      name: this.state.name
    }).then((campaign: CampaignType) => {
      this.context.router.push(formatPattern(documentUri.documents, { campaign: campaign.id }));
    });
  }

  render() {
    const { isLoading } = this.props;

    return (
      <section className="body">
        <Grid>
          <Grid.Column width={16}>
            <Header attached={true}>
              Add Campaign
            </Header>
            <Menu size="tiny" className="head" attached={true} secondary={true} pointing={true}>
              <Menu.Item name="campaign">
                <Link to={formatPattern(campaignUri.list)}>Campaigns</Link>
              </Menu.Item>
            </Menu>
            <Segment attached={true} loading={isLoading}>
              <AddCampaignForm
                onChange={this.handleChange}
                isLoading={isLoading}
                onSave={this.onSave}
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType) => {
  const {
    isLoading
  } = state.campaigns;

  return {
    isLoading
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AddCampaignPage);

export { AddCampaignPage as PureAddCampaignPage };
