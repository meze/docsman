import * as React from 'react';
import { Grid, Header } from 'semantic-ui-react';

export default (): JSX.Element => (
  <section className="body">
    <Grid>
      <Grid.Column width={16}>
        <Header>Welcome</Header>
        <p>Choose a project or create a new one.</p>
      </Grid.Column>
    </Grid>
  </section>
);
