// @flow
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Grid, Menu, Divider } from 'semantic-ui-react';
import { formatPattern } from 'react-router';
import ProjectsNavContainer from '../../containers/ProjectsNavContainer';
import projectUri from '../../modules/Project/uri';
import LoginForm from '../../modules/Security/components/LoginForm';
import type { StateType } from '../../types/redux';
import * as securityActions from '../../modules/Security/actions/handlers';

type RouteParamsType = {
  project: number
}

type PropsType = {
  children: React.Element<*>,
  routeParams: RouteParamsType,
  isAuthenticated: boolean,
  securityActions: {
    login: (email: string, password: string) => void,
    logout: () => void
  }
}

class CoreLayout extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  props: PropsType

  onLogin = (email: string, password: string) => {
    this.props.securityActions.login(email, password);
  }

  onLogout = () => {
    this.props.securityActions.logout();
  }

  onAddProjectClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern(projectUri.create));
  };

  onProjectsClick = (e: Event) => {
    e.preventDefault();
    this.context.router.push(formatPattern('/'));
  };

  render() {
    const { children, routeParams, isAuthenticated } = this.props;

    return isAuthenticated ? <div>
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column width={16} className="top-nav">
            <Container>
              <Menu size="small" inverted={true} className="head" borderless={true}>
                <Menu.Item>
                  <h4 className="logo">Docsman<span className="subtext">ager</span></h4>
                </Menu.Item>
                <Menu.Item name="home" active={this.context.router.location.pathname.startsWith('/projects')} onClick={this.onProjectsClick}>
                  <span>Projects</span>
                </Menu.Item>
                <Menu.Item name="testimonials" active={'' === 'testimonials'}>
                  Trash
                  {' '}
                </Menu.Item>
                <Menu.Item name="testimonials" active={this.context.router.isActive(projectUri.create)} className="add-project" onClick={this.onAddProjectClick}>
                  <span>Add Project</span>
                  {' '}
                </Menu.Item>
                <Menu.Item name="testimonials" onClick={this.onLogout}>
                  <span>Log Out</span>
                  {' '}
                </Menu.Item>
              </Menu>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Container className="main">
        <ProjectsNavContainer selectedProject={parseInt(routeParams.project, 10)} />
        <Divider />
        {children}
      </Container>
    </div> : <LoginForm login={this.onLogin} />;
  }
}

const mapStateToProps = ({ security: securityState }: StateType, ownProps: PropsType) => ({
  isAuthenticated: securityState.isAuthenticated
});

const mapDispatchToProp = (dispatch: Function) => {
  return {
    securityActions: bindActionCreators(securityActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(CoreLayout);
