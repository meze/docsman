import React, { PropTypes as T } from 'react';
import { Container, Grid, Menu, Label } from 'semantic-ui-react';
import ProjectsNavContainer from '../../containers/ProjectsNavContainer';

const CoreLayout = ({ children, routeParams }) => (
  <div>
    <Grid padded={true}>
      <Grid.Row>
        <Grid.Column width={16} className="top-nav">
          <Menu size="small" inverted={true}>
            <Menu.Item>
              <h4 className="logo">Docsman<span className="subtext">ager</span></h4>
            </Menu.Item>
            <Menu.Item name="home" active={true}>
              Home
            </Menu.Item>
            <Menu.Item name="testimonials" active={'' === 'testimonials'}>
              Trash
              {' '}
              <Label color="grey" size="mini">1</Label>
            </Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <Container className="main">
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column width={5}>
            <ProjectsNavContainer selectedProject={parseInt(routeParams.project, 10)} />
          </Grid.Column>
          <Grid.Column width={11}>
            {children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </div>
);

CoreLayout.contextTypes = {
  router: T.object.isRequired
};

CoreLayout.propTypes = {
  children: T.element.isRequired,
  routeParams: T.object
};

export default CoreLayout;
