import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import AddProjectForm from '../components/AddProjectForm';
import * as actions from '../actions/handlers';
import documentUri from '../../Document/uri';

class AddProjectPage extends Component {
  static propTypes = {
    actions: T.object.isRequired,
    isLoading: T.bool.isRequired
  }

  static contextTypes = {
    router: T.object.isRequired
  }

  state = {
    name: ''
  }

  handleChange = (data) => {
    this.setState(data);
  }

  onSave = () => {
    return this.props.actions.save({
      name: this.state.name
    }).then(({ project }) => {
      this.context.router.push(formatPattern(documentUri.documents, { project: project.id }));
    });
  }

  render() {
    const { isLoading } = this.props;

    const sections = [
      { content: 'Add Project', active: true, key: 1 }
    ];

    return (
      <section className="body">
        <PageBreadcrumb sections={sections} />
        <Grid>
          <Grid.Column width={16}>
            <AddProjectForm
              onChange={this.handleChange}
              isLoading={isLoading}
              onSave={this.onSave}
            />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    isLoading
  } = state.projects;

  return {
    isLoading
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AddProjectPage);

export { AddProjectPage as PureAddProjectPage };
