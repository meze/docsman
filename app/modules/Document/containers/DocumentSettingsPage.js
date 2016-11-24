import React, { Component, PropTypes as T } from 'react';
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

class DocumentSettingsPage extends Component {
  static propTypes = {
    document: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    }),
    documentActions: T.object.isRequired,
    documentId: T.number.isRequired,
    isLoading: T.bool.isRequired,
    project: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    }),
    projectActions: T.object.isRequired,
    projectId: T.number.isRequired
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  state = {
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

  componentWillReceiveProps(props) {
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

  handleAddDocumentClick = (e) => {
    e.preventDefault();
    this.context.router.push('/projects/' + this.props.projectId + '/createDocument');
  }

  onBackClick = () => {
    this.context.router.push('/projects/' + this.props.projectId + '/documents');
  }

  handleSubmit = (projectName) => {
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

  onChange = (data) => {
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

const mapStateToProps = (state, ownProps) => {
  const { projects, documents } = state;

  return {
    isLoading: documents.isLoading,
    document: documents.selectedDocument,
    documentId: parseInt(ownProps.routeParams.document, 10) || 0,
    projectId: parseInt(ownProps.routeParams.project, 10) || 0,
    project: projects.currentProject
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentSettingsPage);
