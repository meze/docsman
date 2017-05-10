// @flow
import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Grid, Segment, Menu, Header } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import AddDocumentForm from '../components/AddDocumentForm';
import * as actions from '../actions/handlers';
import * as campaignActions from '../../Campaign/actions/handlers';
import documentUri from '../uri';
import type { CampaignType } from '../../Campaign/campaign';
import type { DocumentType } from '../document';
import type { StateType } from '../../../types/redux';

type NewDocumentType = {
  name: string,
  content: string,
  campaignId: number
}

type PropsType = {
  isLoading: boolean,
  actions: {
    save: (document: NewDocumentType) => Promise<DocumentType>
  },
  campaignActions: {
    switchTo: typeof campaignActions.switchTo
  },
  campaign: CampaignType,
  campaignId: number,
  routeParams: Object
}

class AddDocumentPage extends Component {
  static contextTypes = {
    router: T.object.isRequired
  }

  state = {
    isLoading: false,
    name: '',
    content: ''
  }

  state: {
    isLoading: boolean,
    name: string,
    content: string
  }

  componentDidMount() {
    if (this.props.campaignId === 0) {
      return;
    }
    this.props.campaignActions.switchTo(this.props.campaignId);
  }

  componentWillReceiveProps(props: PropsType) {
    if (props.campaignId !== this.props.campaignId) {
      this.props.campaignActions.switchTo(props.campaignId);
    }
  }

  props: PropsType

  handleChange = (data: Object) => {
    this.setState(data);
  }

  onSave = () => {
    this.props.actions.save({
      name: this.state.name,
      content: this.state.content,
      campaignId: this.props.routeParams.campaign
    }).then((document: DocumentType) => {
      this.context.router.push(formatPattern(documentUri.documents, { campaign: document.campaignId }));
    });
  }

  handleCancel = () => {
    this.context.router.push(formatPattern(documentUri.documents, { campaign: this.props.routeParams.campaign }));
  }

  render() {
    const { isLoading, campaign } = this.props;

    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { campaign: campaign.id })}>{campaign.name}</Link>, key: 1 },
      { content: 'Add Document', active: true, key: 2 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb isLoading={!!campaign.isLoading} sections={sections} />
        <Grid>
          <Grid.Column width={16}>
            <Header attached={true}>
              Add Document
            </Header>

            <Menu size="tiny" className="head" attached={true} secondary={true} pointing={true}>
              <Menu.Item name="campaign">
                <Link to={formatPattern(documentUri.documents, { campaign: campaign.id })}>{campaign.name}</Link>
              </Menu.Item>
            </Menu>
            <Segment attached={true}>
              <AddDocumentForm
                onChange={this.handleChange}
                isLoading={isLoading}
                onCancel={this.handleCancel}
                onSave={this.onSave}
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
    isLoading
  } = documents || {
    isLoading: false
  };

  return {
    isLoading,
    campaign: campaigns.currentCampaign,
    campaignId: parseInt(ownProps.routeParams.campaign, 10) || 0
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    campaignActions: bindActionCreators(campaignActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AddDocumentPage);
