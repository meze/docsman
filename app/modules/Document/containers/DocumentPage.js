import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { Header, Segment, Breadcrumb, Button, Divider } from 'semantic-ui-react';
import ContentEditor from '../../../components/ContentEditor';
import * as actions from '../actions/handlers';

class DocumentPage extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    document: T.shape({
      name: T.string.isRequired,
      content: T.string,
      id: T.number.isRequired
    }),
    documentId: T.number.isRequired,
    isLoading: T.bool.isRequired,
    project: T.shape({
      id: T.number.isRequired,
      name: T.string.isRequired
    })
  }

  componentDidMount() {
    if (this.props.project.id > 0) {
      this.props.actions.fetchOne(this.props.project.id, this.props.documentId);
    }
  }

  componentWillReceiveProps(props) {
    if (props.project.id !== this.props.project.id || props.documentId !== this.props.documentId) {
      this.props.actions.fetchOne(props.project.id, props.documentId);
    }
  }

  save = (content) => {
    this.props.actions.update(this.props.documentId, {
      id: this.props.documentId,
      projectId: this.props.project.id,
      content,
      name: this.props.document.name
    });
  }

  render() {
    const { project, document, isLoading } = this.props;

    return (
      <section>
        <Segment loading={isLoading}>
          <Header floated="left">
            <Breadcrumb>
              <Breadcrumb.Section><Link to={`/projects/${project.id}/documents`}>{project.name}</Link></Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              <Breadcrumb.Section active={true}>
                {document.name}
                {' '}
              </Breadcrumb.Section>
            </Breadcrumb>
          </Header>
          <Button
            icon="pencil"
            floated="right"
            compact={true}
            color="grey"
            size="small"
          />
          <Divider clearing={true} />
          <ContentEditor text={document.content} onSave={this.save} />
        </Segment>
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
    project: projects.items.filter((project) => project.id === parseInt(ownProps.routeParams.project, 10))[0] || {
      name: '',
      id: 0
    }
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(DocumentPage);
