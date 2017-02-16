// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Header, Segment, Button, Divider, Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import ContentEditor from '../../../components/ContentEditor';
import * as documentActions from '../actions/handlers';
import * as projectActions from '../../Project/actions/handlers';
import documentUri from '../uri';
import type { DocumentType } from '../document';
import type { ProjectType } from '../../Project/project';
import type { StateType } from '../../../types/redux';

type PropsType = {
  projectActions: Object,
  documentActions: Object,
  projectId: number,
  documentId: number,
  isLoading: boolean,
  project: ProjectType,
  document: DocumentType,
  routeParams: Object
}

class DocumentPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (this.props.projectId > 0 && this.props.documentId > 0) {
      this.props.documentActions.fetchOne(this.props.projectId, this.props.documentId);
      this.props.projectActions.switchTo(this.props.projectId);
    }
  }

  componentWillReceiveProps(props: PropsType) {
    if (props.projectId !== this.props.projectId || props.documentId !== this.props.documentId) {
      this.props.documentActions.fetchOne(props.projectId, props.documentId);
      this.props.projectActions.switchTo(props.projectId);
    }
  }

  props: PropsType

  save = (content: ?string) => {
    this.props.documentActions.update({
      id: this.props.documentId,
      projectId: this.props.projectId,
      content,
      name: this.props.document.name
    });
  }

  handleSettingsClick = () => {
    this.context.router.push(formatPattern(documentUri.settings, { project: this.props.projectId, document: this.props.documentId }));
  }

  render() {
    const { project, document, isLoading } = this.props;

    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { project: project.id })}>{project.name}</Link>, key: 1 },
      { content: document.name, active: true, key: 2 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb sections={sections} isLoading={!!(project.isLoading || document.isLoading)} />
        <Grid>
          <Grid.Column width={16}>
            <Segment loading={isLoading}>
              <Header floated="left">
                {document.name}
              </Header>
              <Button
                icon="setting"
                onClick={this.handleSettingsClick}
                floated="right"
                compact={true}
                color="grey"
                size="small"
              />
              <Divider clearing={true} />
              <ContentEditor text={document.content} onSave={this.save} />
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { projects, documents } = state;

  return {
    isLoading: documents.isLoading,
    document: documents.selectedDocument,
    documentId: parseInt(ownProps.routeParams.document, 10),
    projectId: parseInt(ownProps.routeParams.project, 10),
    project: projects.currentProject
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentPage);
