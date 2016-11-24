import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import ProjectSettingsForm from '../components/ProjectSettingsForm';
import DeleteProjectForm from '../components/DeleteProjectForm';
import * as actions from '../../Project/actions/handlers';
import documentUri from '../../Document/uri';

class ProjectSettingsPage extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isLoading: T.bool.isRequired,
    project: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    }).isRequired,
    projectId: T.number.isRequired
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
    if (this.props.projectId > 0) {
      this.props.actions.switchTo(this.props.projectId);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      settings: {
        name: newProps.project.name
      }
    });
    if (newProps.projectId !== this.props.projectId) {
      this.props.actions.switchTo(newProps.projectId);
    }
  }

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

  onChange = (data) => {
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

const mapStateToProps = (state, ownProps) => {
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

const mapDispatchToProp = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(ProjectSettingsPage);
export { ProjectSettingsPage as PureProjectSettingsPage };
