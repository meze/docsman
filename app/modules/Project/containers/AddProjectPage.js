// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatPattern } from 'react-router';
import { Grid } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';
import AddProjectForm from '../components/AddProjectForm';
import * as actions from '../actions/handlers';
import documentUri from '../../Document/uri';
import type { ProjectType } from '../project';
import type { StateType } from '../../../types/redux';

type LocalStateType = {
  name: string
}

type PropsType = {
  isLoading: boolean,
  actions: {
    save: (state: LocalStateType) => Promise<ProjectType>
  }
}

class AddProjectPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state: LocalStateType = {
    name: ''
  }

  props: PropsType

  handleChange = (data: LocalStateType) => {
    this.setState(data);
  }

  onSave = () => {
    return this.props.actions.save({
      name: this.state.name
    }).then((project: ProjectType) => {
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
        <PageBreadcrumb sections={sections} isLoading={false} />
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

const mapStateToProps = (state: StateType) => {
  const {
    isLoading
  } = state.projects;

  return {
    isLoading
  };
};

const mapDispatchToProp = (dispatch: Function) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(AddProjectPage);

export { AddProjectPage as PureAddProjectPage };
