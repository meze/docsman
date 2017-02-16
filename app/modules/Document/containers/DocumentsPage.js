// @flow
import React, { Component, PropTypes as T } from 'react';
import { formatPattern } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import DocumentList from '../components/DocumentList';
import * as documentActions from '../actions/handlers';
import * as projectActions from '../../Project/actions/handlers';
import projectUri from '../../Project/uri';
import documentUri from '../uri';
import type { DocumentType } from '../document';
import type { ProjectType } from '../../Project/project';
import type { StateType } from '../../../types/redux';

type PropsType = {
  lastId: number,
  documentId: number,
  isLoading: boolean,
  documentActions: Object,
  projectActions: Object,
  project: ProjectType,
  routeParams: Object,
  selectedProject: number,
  items: DocumentType[]
}

class DocumentsPage extends Component {
  static contextTypes = {
    router: T.object.isRequired
  }

  componentDidMount() {
    this.props.documentActions.fetchIfNeeded(this.props.selectedProject);
    this.props.projectActions.switchTo(this.props.selectedProject);
  }

  componentWillReceiveProps(props: PropsType) {
    if (props.selectedProject !== this.props.selectedProject) {
      this.props.documentActions.invalidate();
      this.props.documentActions.fetchIfNeeded(props.selectedProject);
      this.props.projectActions.switchTo(props.selectedProject);
    }
  }

  props: PropsType

  handleAddDocumentClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern(documentUri.create, { project: this.props.selectedProject }));
  }

  handleSettingsClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern(projectUri.settings, { project: this.props.selectedProject }));
  }

  render() {
    const { items, isLoading, project, lastId } = this.props;
    const sections = [
      { content: project.name, active: true, key: 1 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb sections={sections} isLoading={!!project.isLoading} />
        <Grid>
          <Grid.Column width={16}>
            <DocumentList
              items={items}
              isLoading={isLoading}
              handleAddDocumentClick={this.handleAddDocumentClick}
              handleSettingsClick={this.handleSettingsClick}
              project={project}
              lastId={lastId}
            />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { documents, projects } = state;
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
    project: projects.currentProject,
    items,
    isLoading,
    selectedProject: ownProps.routeParams.project,
    lastId: lastItemId
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentsPage);
