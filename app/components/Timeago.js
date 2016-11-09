import React, { PropTypes } from 'react';
import moment from 'moment';
import IntervalComponent from './IntervalComponent';

export default class Timeago extends IntervalComponent {
  static propTypes = {
    time: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.setInterval(this.forceUpdate.bind(this), 60 * 1000);
  }

  render() {
    return <span title={moment(this.props.time).format('lll')}>{moment(this.props.time).fromNow()}</span>;
  }
}
