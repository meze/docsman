import React, { Component, T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Settings from '../components/DocumentSettings';
import * as actions from '../actions/handlers';

class DocumentSettingsPage extends Component {
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

  handleAddDocumentClick = (e) => {
    e.preventDefault();
    this.context.router.push('/projects/' + this.props.project.id + '/createDocument');
  }

  handleBackClick = () => {
    this.context.router.push('/projects/' + this.props.project.id + '/documents');
  }

  handleSubmit = (projectName) => {
    this.props.actions.update(Object.assign({}, this.props.project, {
      name: projectName
    }));
  }

  render() {
    const { isLoading, project } = this.props;

    return (
      <Settings
        isLoading={isLoading}
        handleSubmit={this.handleSubmit}
        handleDocumentsClick={this.handleDocumentsClick}
        project={project}
      />
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

export default connect(mapStateToProps, mapDispatchToProp)(DocumentSettingsPage);
