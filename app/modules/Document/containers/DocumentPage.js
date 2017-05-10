// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Header, Segment, Button, Grid, Menu } from 'semantic-ui-react';
import ContentEditor from '../../../components/ContentEditor';
import * as documentActions from '../actions/handlers';
import * as campaignActions from '../../Campaign/actions/handlers';
import documentUri from '../uri';
import campaignUri from '../../Campaign/uri';
import type { DocumentType } from '../document';
import type { CampaignType } from '../../Campaign/campaign';
import type { StateType } from '../../../types/redux';

type PropsType = {
  campaignActions: Object,
  documentActions: Object,
  campaignId: number,
  documentId: number,
  isLoading: boolean,
  campaign: CampaignType,
  document: DocumentType,
  routeParams: Object
}

class DocumentPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (this.props.campaignId > 0 && this.props.documentId > 0) {
      this.props.documentActions.fetchOne(this.props.campaignId, this.props.documentId);
      this.props.campaignActions.switchTo(this.props.campaignId);
    }
  }

  componentWillReceiveProps(props: PropsType) {
    if (props.campaignId !== this.props.campaignId || props.documentId !== this.props.documentId) {
      this.props.documentActions.fetchOne(props.campaignId, props.documentId);
      this.props.campaignActions.switchTo(props.campaignId);
    }
  }

  props: PropsType

  save = (content: ?string) => {
    this.props.documentActions.update({
      id: this.props.documentId,
      campaignId: this.props.campaignId,
      content,
      name: this.props.document.name
    });
  }

  handleSettingsClick = () => {
    this.context.router.push(formatPattern(documentUri.settings, { campaign: this.props.campaignId, document: this.props.documentId }));
  }

  render() {
    const { campaign, document, isLoading } = this.props;

    const sections = [
      { content: <Link to={formatPattern(campaignUri.list)}>Campaigns</Link>, key: 1 },
      { content: <Link to={formatPattern(documentUri.documents, { campaign: campaign.id })}>{campaign.name}</Link>, key: 2 },
      // { content: document.name, active: true, key: 3 }
    ];

    return (
      <section className="body">
        <Grid>
          <Grid.Column width={16}>
            <Header attached={true}>
              {document.name}
            </Header>

            <Menu size="tiny" className="head" attached={true} secondary={true} pointing={true}>
              <Menu.Item name="document" active={true}>
                Document
              </Menu.Item>
              <Menu.Item name="campaign">
                <Link to={formatPattern(documentUri.documents, { campaign: campaign.id })}>{campaign.name}</Link>
              </Menu.Item>

              <Menu.Menu position="right">
                <Menu.Item name="settings" onClick={this.handleSettingsClick}>
                  <Button
                    icon="setting"
                    floated="right"
                  />
                </Menu.Item>
              </Menu.Menu>
            </Menu>

            <Segment loading={isLoading} attached={true}>
              <ContentEditor text={document.content} onSave={this.save} />
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { campaigns, documents } = state;

  return {
    isLoading: documents.isLoading,
    document: documents.selectedDocument,
    documentId: parseInt(ownProps.routeParams.document, 10),
    campaignId: parseInt(ownProps.routeParams.campaign, 10),
    campaign: campaigns.currentCampaign
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    campaignActions: bindActionCreators(campaignActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentPage);
