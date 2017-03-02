// @flow
import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import AddDocumentForm from '../components/AddDocumentForm';
import * as actions from '../actions/handlers';
import * as projectActions from '../../Project/actions/handlers';
import documentUri from '../uri';
import type { ProjectType } from '../../Project/project';
import type { DocumentPayloadType } from '../document';
import type { StateType, TypedActionType } from '../../../types/redux';

type NewDocumentType = {
  name: string,
  content: string,
  projectId: number
}

type PropsType = {
  isLoading: boolean,
  actions: {
    save: (document: NewDocumentType) => Promise<TypedActionType<DocumentPayloadType>>
  },
  projectActions: {
    switchTo: typeof projectActions.switchTo
  },
  project: ProjectType,
  projectId: number,
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

  /*componentDidMount() {
    console.log('project mounted to', this.props.routeParams.project);
  }

  componentWillReceiveProps(newProps: PropsType) {
    console.log('project received to', this.props.routeParams.project);
  }*/

  componentDidMount() {
    if (this.props.projectId === 0) {
      return;
    }
    this.props.projectActions.switchTo(this.props.projectId);
  }

  componentWillReceiveProps(props: PropsType) {
    if (props.projectId !== this.props.projectId) {
      this.props.projectActions.switchTo(props.projectId);
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
      projectId: this.props.routeParams.project
    }).then((document) => {
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

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { documents, projects } = state;
  const {
    isLoading
  } = documents || {
    isLoading: false
  };

  return {
    isLoading,
    project: projects.currentProject,
    projectId: parseInt(ownProps.routeParams.project, 10) || 0
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AddDocumentPage);
