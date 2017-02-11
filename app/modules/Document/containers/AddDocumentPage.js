// @flow
import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import AddDocumentForm from '../components/AddDocumentForm';
import * as actions from '../actions/handlers';
import documentUri from '../uri';
import type { ProjectType } from '../../Project/project';
import type { DocumentType } from '../document';
import type { DocumentStateType } from '../actions/state';
import type { ProjectStateType } from '../../Project/actions/state';

type AddDocumentPagePropsType = {
  isLoading: boolean,
  actions: (project: ProjectType) => Promise<DocumentType>,
  project: ProjectType,
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

  props: AddDocumentPagePropsType

  handleChange = (data: Object) => {
    this.setState(data);
  }

  onSave = () => {
    this.props.actions.save({
      name: this.state.name,
      content: this.state.content,
      projectId: this.props.routeParams.project
    }).then(({ document }) => {
      this.context.router.push(formatPattern(documentUri.documents, { project: document.projectId }));
    });
  }

  handleCancel = () => {
    this.context.router.push(formatPattern(documentUri.documents, { project: this.props.routeParams.project }));
  }

  render() {
    const { isLoading, project } = this.props;

    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { project: project.id })}>{project.name}</Link>, key: 1 },
      { content: 'Add Document', active: true, key: 2 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb isLoading={!!project.isLoading} sections={sections} />
        <Grid>
          <Grid.Column width={16}>
            <AddDocumentForm
              onChange={this.handleChange}
              isLoading={isLoading}
              onCancel={this.handleCancel}
              onSave={this.onSave}
            />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: { documents: DocumentStateType, projects: ProjectStateType }) => {
  const { documents, projects } = state;
  const {
    isLoading
  } = documents || {
    isLoading: false
  };

  return {
    isLoading,
    project: projects.currentProject
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AddDocumentPage);
