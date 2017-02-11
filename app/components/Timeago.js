// @flow
import React from 'react';
import moment from 'moment';
import IntervalComponent from './IntervalComponent';

type PropsType = {
  time: string
}

export default class Timeago extends IntervalComponent {
  props: PropsType;

  componentDidMount() {
    this.setInterval(this.forceUpdate.bind(this), 60 * 1000);
  }

  render() {
    return <span title={moment(this.props.time).format('lll')}>{moment(this.props.time).fromNow()}</span>;
  }
}
