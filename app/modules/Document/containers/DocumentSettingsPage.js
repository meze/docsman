// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import DocumentSettingsForm from '../components/DocumentSettingsForm';
import DeleteDocumentForm from '../components/DeleteDocumentForm';
import * as documentActions from '../actions/handlers';
import * as campaignActions from '../../Campaign/actions/handlers';
import documentUri from '../uri';
import type { DocumentType, DocumentSettingsType } from '../document';
import type { CampaignType } from '../../Campaign/campaign';
import type { StateType } from '../../../types/redux';

type PropsType = {
  campaignId: number,
  documentId: number,
  isLoading: boolean,
  documentActions: Object,
  campaignActions: Object,
  document: DocumentType,
  campaign: CampaignType,
  routeParams: Object
}

type LocalStateType = {
  settings: DocumentSettingsType
}

class DocumentSettingsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state: LocalStateType = {
    settings: {
      name: ''
    }
  }

  componentDidMount() {
    if (this.props.campaignId === 0 || this.props.documentId === 0) {
      return;
    }
    this.props.documentActions.fetchOne(this.props.campaignId, this.props.documentId);
    this.props.campaignActions.switchTo(this.props.campaignId);
  }

  componentWillReceiveProps(props: PropsType) {
    this.setState({
      settings: {
        name: props.document.name
      }
    });
    if (props.campaignId !== this.props.campaignId || props.documentId !== this.props.documentId) {
      this.props.documentActions.fetchOne(this.props.campaignId, this.props.documentId);
      this.props.campaignActions.switchTo(props.campaignId);
    }
  }

  props: PropsType

  handleSubmit = (campaignName: string) => {
    this.props.documentActions.update(Object.assign({}, this.props.campaign, {
      name: campaignName
    }));
  }

  onBackClick = () => {
    this.context.router.push(formatPattern(documentUri.document, { campaign: this.props.campaign.id, document: this.props.document.id }));
  }

  onSave = () => {
    return this.props.documentActions.update(Object.assign({}, this.props.document, this.state.settings));
  }

  onRemove = () => {
    return this.props.documentActions.remove(this.props.campaign.id, this.props.document.id).then(() => {
      this.context.router.push(formatPattern(documentUri.documents, { campaign: this.props.campaign.id }));
    });
  }

  onChange = (data: DocumentSettingsType) => {
    this.setState({
      settings: data
    });
  }

  render() {
    const { isLoading, document, campaign } = this.props;
    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { campaign: campaign.id })}>{campaign.name}</Link>, key: 1 },
      { content: <Link to={formatPattern(documentUri.document, { campaign: campaign.id, document: document.id })}>{document.name}</Link>, key: 2 },
      { content: 'Settings', key: 3 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb sections={sections} isLoading={!!(campaign.isLoading || document.isLoading)} />
        <Grid>
          <Grid.Column width={16}>
            <DocumentSettingsForm
              isLoading={isLoading}
              onChange={this.onChange}
              value={this.state.settings}
              name={document.name}
              onSave={this.onSave}
              onBackClick={this.onBackClick}
            />
            <DeleteDocumentForm onRemove={this.onRemove} isLoading={isLoading} />
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
    documentId: parseInt(ownProps.routeParams.document, 10) || 0,
    campaignId: parseInt(ownProps.routeParams.campaign, 10) || 0,
    campaign: campaigns.currentCampaign
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    campaignActions: bindActionCreators(campaignActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentSettingsPage);
