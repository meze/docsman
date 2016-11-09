import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Settings from '../components/ProjectSettings';
import DeleteProjectForm from '../components/DeleteProjectForm';
import * as actions from '../actions/handlers';

class ProjectSettingsPage extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isLoading: T.bool.isRequired,
    project: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    })
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  state = {
    settings: {
      name: ''
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      settings: {
        name: newProps.project.name
      }
    });
  }

  onBackClick = () => {
    this.context.router.push('/projects/' + this.props.project.id + '/documents');
  }

  onSave = () => {
    this.props.actions.update(Object.assign({}, this.props.project, this.state.settings));
  }

  handleChange = (data) => {
    this.setState({
      settings: data
    });
  }

  render() {
    const { isLoading, project } = this.props;

    return (
      <section>
        <Settings
          onChange={this.handleChange}
          value={this.state.settings}
          name={project.name}
          isLoading={isLoading}
          onSave={this.onSave}
          onBackClick={this.onBackClick}
          project={project}
        />
        <DeleteProjectForm isLoading={isLoading} />
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
    project: projects.items.filter((project) => parseInt(project.id, 10) === parseInt(ownProps.routeParams.project, 10))[0] || {
      name: '',
      id: 0
    },
    isLoading
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(ProjectSettingsPage);
