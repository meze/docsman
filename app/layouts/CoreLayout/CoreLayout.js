// @flow
import React, { PropTypes as T } from 'react';
import { Container, Grid, Menu, Divider } from 'semantic-ui-react';
import { formatPattern } from 'react-router';
import ProjectsNavContainer from '../../containers/ProjectsNavContainer';
import projectUri from '../../modules/Project/uri';

type RouteParamsType = {
  project: number
}

const CoreLayout = ({ children, routeParams }: {children: React.Element<*>, routeParams: RouteParamsType}, context: { router: Object }) => {
  const onAddProjectClick = (e: Event) => {
    e.preventDefault();
    context.router.push(formatPattern(projectUri.create));
  };

  const onProjectsClick = (e: Event) => {
    e.preventDefault();
    context.router.push(formatPattern('/'));
  };

  return (
    <div>
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column width={16} className="top-nav">
            <Container>
              <Menu size="small" inverted={true} pointing={true} className="head" borderless={true}>
                <Menu.Item>
                  <h4 className="logo">Docsman<span className="subtext">ager</span></h4>
                </Menu.Item>
                <Menu.Item name="home" active={context.router.location.pathname.startsWith('/projects')} onClick={onProjectsClick}>
                  Projects
                </Menu.Item>
                <Menu.Item name="testimonials" active={'' === 'testimonials'}>
                  Trash
                  {' '}
                </Menu.Item>
                <Menu.Item name="testimonials" active={context.router.isActive(projectUri.create)} className="add-project" onClick={onAddProjectClick}>
                  Add Project
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
    </div>
  );
};

CoreLayout.contextTypes = {
  router: T.object.isRequired
};

CoreLayout.propTypes = {
  children: T.element.isRequired,
  routeParams: T.object
};

export default CoreLayout;
