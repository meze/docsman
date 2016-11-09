import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddDocumentForm from '../components/AddDocumentForm';
import * as actions from '../actions/handlers';

class AddDocumentPage extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isLoading: T.bool.isRequired,
    routeParams: T.object
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  state = {
    isLoading: false,
    name: '',
    content: ''
  }

  handleChange = (data) => {
    this.setState(data);
  }

  onSave = () => {
    this.props.actions.save({
      name: this.state.name,
      content: this.state.content,
      projectId: this.props.routeParams.project
    }).then(({ document }) => {
      this.context.router.push('/projects/' + document.projectId + '/documents');
    });
  }

  handleCancel = () => {
    this.context.router.push('/projects/' + this.props.routeParams.project + '/documents');
  }

  render() {
    const { isLoading } = this.props;

    return (
      <AddDocumentForm
        onChange={this.handleChange}
        isLoading={isLoading}
        onCancel={this.handleCancel}
        onSave={this.onSave}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { documents } = state;
  const {
    isLoading
  } = documents || {
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

export default connect(mapStateToProps, mapDispatchToProp)(AddDocumentPage);
