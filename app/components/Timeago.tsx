import * as moment from 'moment';
import * as React from 'react';
import IntervalComponent from './IntervalComponent';

export interface ITimeAgoProps {
  time: string;
}

export default class Timeago extends IntervalComponent<ITimeAgoProps, {}> {
  public componentDidMount() {
    this.setInterval(this.forceUpdate.bind(this), 60 * 1000);
  }

  public render() {
    return <span title={moment(this.props.time).format('lll')}>{moment(this.props.time).fromNow()}</span>;
  }
}
