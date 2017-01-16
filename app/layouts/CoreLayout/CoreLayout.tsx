import * as React from 'react';
import { formatPattern } from 'react-router';
import { Container, Divider, Grid, Menu } from 'semantic-ui-react';
import ProjectsNavContainer from '../../containers/ProjectsNavContainer';
import projectUri from '../../modules/Project/uri';

export interface ICoreLayoutProps {
  children: JSX.Element;
  routeParams: ICoreLayoutRouteParams;
}

export interface ICoreLayoutRouteParams {
  project: number;
}

const CoreLayout: React.SFC<ICoreLayoutProps> = ({ children, routeParams }, context): JSX.Element => {
  const onAddProjectClick = (e) => {
    e.preventDefault();
    context.router.push(formatPattern(projectUri.create, {}));
  };

  const onProjectsClick = (e) => {
    e.preventDefault();
    context.router.push(formatPattern('/', {}));
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
                <Menu.Item>
                  Trash
                  {' '}
                </Menu.Item>
                <Menu.Item active={context.router.isActive(projectUri.create)} className="add-project" onClick={onAddProjectClick}>
                  Add Project
                  {' '}
                </Menu.Item>
              </Menu>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Container className="main">
        <ProjectsNavContainer selectedProject={parseInt((routeParams.project || 0).toString(), 10)} />
        <Divider />
        {children}
      </Container>
    </div>
  );
};

CoreLayout.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default CoreLayout;
