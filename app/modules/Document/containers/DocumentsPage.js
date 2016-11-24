import React, { Component, PropTypes as T } from 'react';
import { formatPattern } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import DocumentList from '../components/DocumentList';
import * as documentActions from '../actions/handlers';
import * as projectActions from '../../Project/actions/handlers';
import projectUri from '../../Project/uri';
import documentUri from '../uri';

class DocumentsPage extends Component {
  static propTypes = {
    documentActions: T.object.isRequired,
    isLoading: T.bool.isRequired,
    items: T.array.isRequired,
    lastId: T.number,
    project: T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    }),
    projectActions: T.object.isRequired,
    selectedProject: T.string
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  componentDidMount() {
    this.props.documentActions.fetchIfNeeded(this.props.selectedProject);
    this.props.projectActions.switchTo(this.props.selectedProject);
  }

  componentWillReceiveProps(props) {
    if (props.selectedProject !== this.props.selectedProject) {
      this.props.documentActions.invalidate();
      this.props.documentActions.fetchIfNeeded(props.selectedProject);
      this.props.projectActions.switchTo(props.selectedProject);
    }
  }

  handleAddDocumentClick = (e) => {
    e.preventDefault();
    this.context.router.push(formatPattern(documentUri.create, { project: this.props.selectedProject }));
  }

  handleSettingsClick = () => {
    this.context.router.push(formatPattern(projectUri.settings, { project: this.props.selectedProject }));
  }

  render() {
    const { items, isLoading, project, lastId } = this.props;
    const sections = [
      { content: project.name, active: true, key: 1 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb sections={sections} isLoading={!!project.isLoading} />
        <Grid>
          <Grid.Column width={16}>
            <DocumentList
              items={items}
              isLoading={isLoading}
              handleAddDocumentClick={this.handleAddDocumentClick}
              handleSettingsClick={this.handleSettingsClick}
              project={project}
              lastId={lastId}
            />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { documents, projects } = state;
  const {
    isLoading,
    items,
    lastItemId
  } = documents || {
    isLoading: true,
    items: [],
    lastItemId: 0
  };

  return {
    project: projects.currentProject,
    items,
    isLoading,
    selectedProject: ownProps.routeParams.project,
    lastId: lastItemId
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentsPage);
