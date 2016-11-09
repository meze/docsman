import { Component } from 'react';

export default class IntervalComponent extends Component {
  componentWillMount() {
    this.intervals = [];
  }

  componentWillUnmount() {
    this.intervals.forEach(clearInterval);
  }

  setInterval(fn, ms) {
    this.intervals.push(setInterval(fn, ms));
  }
}
