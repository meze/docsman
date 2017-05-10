// @flow
import React, { Component, PropTypes as T } from 'react';
import { formatPattern } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Segment, Menu, Header, Button } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import DocumentList from '../components/DocumentList';
import * as documentActions from '../actions/handlers';
import * as campaignActions from '../../Campaign/actions/handlers';
import campaignUri from '../../Campaign/uri';
import documentUri from '../uri';
import type { DocumentType } from '../document';
import type { CampaignType } from '../../Campaign/campaign';
import type { StateType } from '../../../types/redux';

type PropsType = {
  lastId: number,
  documentId: number,
  isLoading: boolean,
  documentActions: Object,
  campaignActions: Object,
  campaign: CampaignType,
  routeParams: Object,
  selectedCampaign: number,
  items: DocumentType[]
}

class DocumentsPage extends Component {
  static contextTypes = {
    router: T.object.isRequired
  }

  componentDidMount() {
    this.props.documentActions.fetchIfNeeded(this.props.selectedCampaign);
    this.props.campaignActions.switchTo(this.props.selectedCampaign);
  }

  componentWillReceiveProps(props: PropsType) {
    if (props.selectedCampaign !== this.props.selectedCampaign) {
      this.props.documentActions.invalidate();
      this.props.documentActions.fetchIfNeeded(props.selectedCampaign);
      this.props.campaignActions.switchTo(props.selectedCampaign);
    }
  }

  props: PropsType

  handleAddDocumentClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern(documentUri.create, { campaign: this.props.selectedCampaign }));
  }

  handleSettingsClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern(campaignUri.settings, { campaign: this.props.selectedCampaign }));
  }

  render() {
    const { items, isLoading, campaign, lastId } = this.props;
    const sections = [
      { content: campaign.name, active: true, key: 1 }
    ];

    return (
      <section className="body">
        <Grid>
          <Grid.Column width={16}>
            <Header attached={true}>
              {campaign.name}
            </Header>

            <Menu size="tiny" className="head" attached={true} secondary={true} pointing={true}>
              <Menu.Item name="document" active={true}>
                Documents
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
              <PageBreadcrumb sections={sections} isLoading={!!campaign.isLoading} />
              <DocumentList
                items={items}
                isLoading={isLoading}
                handleAddDocumentClick={this.handleAddDocumentClick}
                handleSettingsClick={this.handleSettingsClick}
                campaign={campaign}
                lastId={lastId}
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { documents, campaigns } = state;
  const {
    isLoading,
    items,
    lastItemId
  } = documents || {
    isLoading: true,
    items: [],
    lastItemId: 0
  };

  return {
    campaign: campaigns.currentCampaign,
    items,
    isLoading,
    selectedCampaign: ownProps.routeParams.campaign,
    lastId: lastItemId
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    campaignActions: bindActionCreators(campaignActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentsPage);
