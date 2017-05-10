// @flow
import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import PageBreadcrumb from '../../../components/PageBreadcrumb';

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
const CustomizedAxisTick = React.createClass({
  render () {
    const {x, y, stroke, payload} = this.props;

   	return (
    	<g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
      </g>
    );
  }
});
const CustomizedAxisYTick = React.createClass({
  render () {
    const {x, y, stroke, payload} = this.props;

   	return (
    	<g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dx={-12} dy={5} textAnchor="end" fill="#666">{payload.value}</text>
      </g>
    );
  }
});

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip }  from 'recharts';

const data = [
      {name: '03/15/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/16/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/17/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/18/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/19/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/20/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/21/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/22/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/23/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/24/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/25/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/26/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/27/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/28/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/29/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
      {name: '03/30/2017', uv: randomIntFromInterval(1, 9999), pv: randomIntFromInterval(1, 9999), amt: randomIntFromInterval(1, 9999) },
];

export default () => (
  <section className="body">
    <Grid>
      <Grid.Column width={16}>
        <Header attached={true}>
          Welcome
          <PageBreadcrumb sections={[]} isLoading={false} />
        </Header>
        <Segment attached={true}>
        <p>Choose a campaign or create a new one.</p>
        <AreaChart width={600} height={400} data={data}
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis dataKey="name"   tick={<CustomizedAxisTick/>} height={60} />
          <YAxis  tick={<CustomizedAxisYTick/>} />
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip />
          <Area type='monotone' dataKey='uv' stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Area type='monotone' dataKey='pv' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Area type='monotone' dataKey='amt' stackId="1" stroke='#ffc658' fill='#ffc658' />
        </AreaChart>
        </Segment>
      </Grid.Column>
    </Grid>
  </section>
);
