import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DocumentList from '../components/DocumentList';
import * as actions from '../actions/handlers';

class DocumentsPage extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isLoading: T.bool.isRequired,
    items: T.array.isRequired,
    lastId: T.number,
    project: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    }),
    selectedProject: T.string
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  componentDidMount() {
    this.props.actions.fetchIfNeeded(this.props.selectedProject);
  }

  componentWillReceiveProps(props) {
    if (props.selectedProject !== this.props.selectedProject) {
      this.props.actions.invalidate();
      this.props.actions.fetchIfNeeded(props.selectedProject);
    }
  }

  handleAddDocumentClick = (e) => {
    e.preventDefault();
    this.context.router.push('/projects/' + this.props.selectedProject + '/createDocument');
  }

  handleSettingsClick = () => {
    this.context.router.push('/projects/' + this.props.selectedProject + '/settings');
  }

  render() {
    const { items, isLoading, project, lastId } = this.props;

    return (
      <DocumentList
        items={items}
        isLoading={isLoading}
        handleAddDocumentClick={this.handleAddDocumentClick}
        handleSettingsClick={this.handleSettingsClick}
        project={project}
        lastId={lastId}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { documents, projects } = state;
  const {
    isLoading,
    items,
    projectId,
    lastItemId
  } = documents || {
    isLoading: true,
    items: [],
    projectId: 0,
    lastItemId: 0
  };

  return {
    project: projects.items.filter((project) => parseInt(project.id, 10) === parseInt(projectId, 10))[0] || {
      name: '',
      id: 0
    },
    items,
    isLoading,
    selectedProject: ownProps.routeParams.project,
    lastId: lastItemId
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentsPage);
