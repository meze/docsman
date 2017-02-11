// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { formatPattern } from 'react-router';
import ProjectsNav from '../components/ProjectsNav';
import * as ProjectActions from '../modules/Project/actions/handlers';
import documentUri from '../modules/Document/uri';
import type { ProjectType } from '../modules/Project/project';

type PropsType = {
  fetchIfNeeded: Function,
  isLoading: boolean,
  items: ProjectType[],
  selectedProject: number
}

class ProjectsNavContainer extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.fetchIfNeeded();
  }

  props: PropsType

  handleItemClick = (e: Event, { name }: { name: string }) => {
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

const mapStateToProps = (state: { projects: Object }, ownProps: PropsType) => {
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

const mapDispatchToProp = (dispatch: Function) => {
  return {
    fetchIfNeeded: () => dispatch(ProjectActions.fetchIfNeeded())
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(ProjectsNavContainer);
