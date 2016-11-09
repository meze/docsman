import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Divider, Header, Button, Segment } from 'semantic-ui-react';
import ProjectsNav from '../components/ProjectsNav';
import * as ProjectActions from '../modules/Project/actions/handlers';

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
    this.context.router.push('/projects/' + name + '/documents');
  }

  handleAddProjectClick = (e) => {
    e.preventDefault();
    this.context.router.push('/createProject');
  }

  render() {
    const { items, isLoading, selectedProject } = this.props;

    return (
      <Segment className="projects" loading={isLoading}>
        <Header floated="left">Projects</Header>
        <Button floated="right" size="tiny" color="green" onClick={this.handleAddProjectClick}>Add Project</Button>
        <Divider clearing={true} hidden={true} />
        <ProjectsNav
          items={items}
          handleItemClick={this.handleItemClick}
          activeItem={selectedProject}
        />
      </Segment>
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
