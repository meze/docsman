import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddProjectForm from '../components/AddProjectForm';
import * as actions from '../actions/handlers';

class AddProjectPage extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isLoading: T.bool.isRequired,
    routeParams: T.object
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  state = {
    name: ''
  }

  handleChange = (data) => {
    this.setState(data);
  }

  onSave = () => {
    this.props.actions.save({
      name: this.state.name
    }).then(({ project }) => {
      this.context.router.push('/projects/' + project.id + '/documents');
    });
  }

  render() {
    const { isLoading } = this.props;

    return (
      <AddProjectForm
        onChange={this.handleChange}
        isLoading={isLoading}
        onSave={this.onSave}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const {
    isLoading
  } = state.projects || {
    isLoading: false
  };

  return {
    isLoading
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AddProjectPage);
