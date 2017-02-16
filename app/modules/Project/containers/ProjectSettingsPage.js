// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import ProjectSettingsForm from '../components/ProjectSettingsForm';
import DeleteProjectForm from '../components/DeleteProjectForm';
import * as actions from '../../Project/actions/handlers';
import documentUri from '../../Document/uri';
import type { ProjectType, ProjectSettingsType } from '../project';
import type { StateType } from '../../../types/redux';

type PropsType = {
  actions: typeof actions,
  isLoading: boolean,
  project: ProjectType,
  projectId: number,
  routeParams: Object
}

type LocalStateType = {
  settings: ProjectSettingsType
}

class ProjectSettingsPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state: LocalStateType = {
    settings: {
      name: ''
    }
  }

  componentDidMount() {
    if (this.props.projectId > 0) {
      this.props.actions.switchTo(this.props.projectId);
    }
  }

  componentWillReceiveProps(newProps: PropsType) {
    this.setState({
      settings: {
        name: newProps.project.name
      }
    });
    if (newProps.projectId !== this.props.projectId) {
      this.props.actions.switchTo(newProps.projectId);
    }
  }

  props: PropsType

  onBackClick = () => {
    this.context.router.push(formatPattern(documentUri.documents, { project: this.props.project.id }));
  }

  onSave = () => {
    return this.props.actions.update(Object.assign({}, this.props.project, this.state.settings));
  }

  onRemove = () => {
    return this.props.actions.remove(this.props.project.id).then(() => {
      this.context.router.push('/');
    });
  }

  onChange = (data: ProjectSettingsType) => {
    this.setState({
      settings: data
    });
  }

  render() {
    const { isLoading, project } = this.props;

    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { project: project.id })}>{project.name}</Link>, key: 1 },
      { content: 'Settings', active: true, key: 2 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb isLoading={!!project.isLoading} sections={sections} />
        <Grid>
          <Grid.Column width={16}>
            <ProjectSettingsForm
              onChange={this.onChange}
              value={this.state.settings}
              name={project.name}
              isLoading={isLoading}
              onSave={this.onSave}
              onBackClick={this.onBackClick}
              project={project}
            />
            <DeleteProjectForm onRemove={this.onRemove} isLoading={isLoading} />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state: StateType, ownProps: PropsType) => {
  const { projects } = state;
  const {
    isLoading
  } = projects || {
    isLoading: true
  };

  return {
    project: projects.currentProject,
    projectId: parseInt(ownProps.routeParams.project, 10) || 0,
    isLoading
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(ProjectSettingsPage);
export { ProjectSettingsPage as PureProjectSettingsPage };
