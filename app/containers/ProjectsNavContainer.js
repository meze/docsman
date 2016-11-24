import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { formatPattern } from 'react-router';
import ProjectsNav from '../components/ProjectsNav';
import * as ProjectActions from '../modules/Project/actions/handlers';
import documentUri from '../modules/Document/uri';

class ProjectsNavContainer extends Component {
  static contextTypes = {
    router: T.object.isRequired
  }

  static propTypes = {
    fetchIfNeeded: T.func.isRequired,
    isLoading: T.bool.isRequired,
    items: T.array.isRequired,
    selectedProject: T.number
  }

  componentDidMount() {
    this.props.fetchIfNeeded();
  }

  handleItemClick = (e, { name }) => {
    e.preventDefault();
    this.context.router.push(formatPattern(documentUri.documents, { project: name }));
  }

  render() {
    const { items, isLoading, selectedProject } = this.props;

    return (
      <ProjectsNav
        isLoading={isLoading}
        items={items}
        handleItemClick={this.handleItemClick}
        activeItem={selectedProject}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { projects } = state;
  const {
    isLoading,
    items
  } = projects || {
    isLoading: true,
    items: []
  };

  return {
    items,
    isLoading,
    selectedProject: ownProps.selectedProject
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    fetchIfNeeded: () => dispatch(ProjectActions.fetchIfNeeded())
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(ProjectsNavContainer);
