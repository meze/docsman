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
import * as projectActions from '../../Project/actions/handlers';
import documentUri from '../uri';
import type { DocumentStateType } from '../actions/state';
import type { DocumentType, DocumentSettingsType } from '../document';
import type { ProjectType } from '../../Project/project';
import type { ProjectStateType } from '../../Project/actions/state';

type PropsType = {
  projectId: number,
  documentId: number,
  isLoading: boolean,
  documentActions: Object,
  projectActions: Object,
  document: DocumentType,
  project: ProjectType,
  routeParams: Object
}

type StateType = {
  settings: DocumentSettingsType
}

class DocumentSettingsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state: StateType = {
    settings: {
      name: ''
    }
  }

  componentDidMount() {
    if (this.props.projectId === 0 || this.props.documentId === 0) {
      return;
    }
    this.props.documentActions.fetchOne(this.props.projectId, this.props.documentId);
    this.props.projectActions.switchTo(this.props.projectId);
  }

  componentWillReceiveProps(props: PropsType) {
    this.setState({
      settings: {
        name: props.document.name
      }
    });
    if (props.projectId !== this.props.projectId || props.documentId !== this.props.documentId) {
      this.props.documentActions.fetchOne(this.props.projectId, this.props.documentId);
      this.props.projectActions.switchTo(props.projectId);
    }
  }

  props: PropsType

  handleAddDocumentClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push('/projects/' + this.props.projectId + '/createDocument');
  }

  onBackClick = () => {
    this.context.router.push('/projects/' + this.props.projectId + '/documents');
  }

  handleSubmit = (projectName: string) => {
    this.props.documentActions.update(Object.assign({}, this.props.project, {
      name: projectName
    }));
  }

  onBackClick = () => {
    this.context.router.push(formatPattern(documentUri.document, { project: this.props.project.id, document: this.props.document.id }));
  }

  onSave = () => {
    return this.props.documentActions.update(Object.assign({}, this.props.document, this.state.settings));
  }

  onRemove = () => {
    return this.props.documentActions.remove(this.props.project.id).then(() => {
      this.context.router.push('/');
    });
  }

  onChange = (data: DocumentSettingsType) => {
    this.setState({
      settings: data
    });
  }

  render() {
    const { isLoading, document, project } = this.props;
    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { project: project.id })}>{project.name}</Link>, key: 1 },
      { content: <Link to={formatPattern(documentUri.document, { project: project.id, document: document.id })}>{document.name}</Link>, key: 2 },
      { content: 'Settings', key: 3 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb sections={sections} isLoading={!!(project.isLoading || document.isLoading)} />
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

const mapStateToProps = (state: { documents: DocumentStateType, projects: ProjectStateType }, ownProps: PropsType) => {
  const { projects, documents } = state;

  return {
    isLoading: documents.isLoading,
    document: documents.selectedDocument,
    documentId: parseInt(ownProps.routeParams.document, 10) || 0,
    projectId: parseInt(ownProps.routeParams.project, 10) || 0,
    project: projects.currentProject
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentSettingsPage);
