import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, formatPattern } from 'react-router';
import { Header, Segment, Button, Divider, Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import ContentEditor from '../../../components/ContentEditor';
import * as documentActions from '../actions/handlers';
import * as projectActions from '../../Project/actions/handlers';
import documentUri from '../uri';

class DocumentPage extends Component {
  static propTypes = {
    document: T.shape({
      name: T.string.isRequired,
      content: T.string,
      id: T.number.isRequired
    }),
    documentActions: T.object.isRequired,
    documentId: T.number.isRequired,
    isLoading: T.bool.isRequired,
    project: T.shape({
      id: T.number.isRequired,
      name: T.string.isRequired
    }),
    projectActions: T.object.isRequired,
    projectId: T.number.isRequired
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  componentDidMount() {
    if (this.props.projectId > 0 && this.props.documentId > 0) {
      this.props.documentActions.fetchOne(this.props.projectId, this.props.documentId);
      this.props.projectActions.switchTo(this.props.projectId);
    }
  }

  componentWillReceiveProps(props) {
    if (props.projectId !== this.props.projectId || props.documentId !== this.props.documentId) {
      this.props.documentActions.fetchOne(props.projectId, props.documentId);
      this.props.projectActions.switchTo(props.projectId);
    }
  }

  save = (content) => {
    this.props.documentActions.update(this.props.documentId, {
      id: this.props.documentId,
      projectId: this.props.projectId,
      content,
      name: this.props.document.name
    });
  }

  handleSettingsClick = () => {
    this.context.router.push(formatPattern(documentUri.settings, { project: this.props.projectId, document: this.props.documentId }));
  }

  render() {
    const { project, document, isLoading } = this.props;

    const sections = [
      { content: <Link to={formatPattern(documentUri.documents, { project: project.id })}>{project.name}</Link>, key: 1 },
      { content: document.name, active: true, key: 2 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb sections={sections} isLoading={!!(project.isLoading || document.isLoading)} />
        <Grid>
          <Grid.Column width={16}>
            <Segment loading={isLoading}>
              <Header floated="left">
                {document.name}
              </Header>
              <Button
                icon="pencil"
                onClick={this.handleSettingsClick}
                floated="right"
                compact={true}
                color="grey"
                size="small"
              />
              <Divider clearing={true} />
              <ContentEditor text={document.content} onSave={this.save} />
            </Segment>
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { projects, documents } = state;

  return {
    isLoading: documents.isLoading,
    document: documents.selectedDocument,
    documentId: parseInt(ownProps.routeParams.document, 10),
    projectId: parseInt(ownProps.routeParams.project, 10),
    project: projects.currentProject
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    documentActions: bindActionCreators(documentActions, dispatch),
    projectActions: bindActionCreators(projectActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentPage);
