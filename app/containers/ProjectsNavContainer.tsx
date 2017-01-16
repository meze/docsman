import * as React from 'react';
import { connect } from 'react-redux';
import { formatPattern } from 'react-router';
import ProjectsNav, { IProjectNavItem } from '../components/ProjectsNav';
import documentUri from '../modules/Document/uri';
import * as ProjectActions from '../modules/Project/actions/handlers';


export interface IProjectsNavContainerProps {
  items: any[];
  isLoading: boolean;
  selectedProject: number;
  fetchIfNeeded(): void;
}


class ProjectsNavContainer extends React.Component<IProjectsNavContainerProps, {}> {
  public static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  public componentDidMount() {
    this.props.fetchIfNeeded();
  }

  public handleItemClick = (e: Event, { name }: IProjectNavItem) => {
    e.preventDefault();
    this.context.router.push(formatPattern(documentUri.documents, { project: name }));
  }

  public render() {
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
