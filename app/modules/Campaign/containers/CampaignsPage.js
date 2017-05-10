// @flow
import React, { Component, PropTypes as T } from 'react';
import { formatPattern } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Segment, Menu, Header, Button } from 'semantic-ui-react';
import CampaignList from '../components/CampaignList';
import * as campaignActions from '../../Campaign/actions/handlers';
import campaignUri from '../../Campaign/uri';
import type { CampaignType } from '../../Campaign/campaign';
import type { StateType } from '../../../types/redux';

type PropsType = {
  isLoading: boolean,
  campaignActions: Object,
  routeParams: Object,
  items: CampaignType[]
}

class CampaignsPage extends Component {
  static contextTypes = {
    router: T.object.isRequired
  }

  componentDidMount() {
    this.props.campaignActions.fetchIfNeeded();
  }

  componentWillReceiveProps(props: PropsType) {
    this.props.campaignActions.fetchIfNeeded();
  }

  props: PropsType


  render() {
    const { items, isLoading } = this.props;

    return (
      <section className="body">
        <Grid>
          <Grid.Column width={16}>
            <Header attached={true}>
              Campaigns
            </Header>
            <Menu size="tiny" className="head" attached={true} secondary={true} pointing={true}>
              <Menu.Item name="document" active={true}>
                List
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item name="settings" fitted={true} onClick={this.handleAddDocumentClick}>
                  <i className="ui icon blue plus"></i> Add
                </Menu.Item>
                <Menu.Item name="settings" position="right" fitted={true} onClick={this.handleSettingsClick}>
                  <Button
                    icon="setting"
                  />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Segment loading={this.props.isLoading} attached={true}>
              <CampaignList
                items={items}
                isLoading={isLoading}
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { campaigns } = state;

  return {
    items: campaigns.items,
    isLoading: campaigns.isLoading
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    campaignActions: bindActionCreators(campaignActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(CampaignsPage);
