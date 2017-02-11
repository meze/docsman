// @flow
import { Component } from 'react';

export default class IntervalComponent extends Component {
  componentWillMount() {
    this.intervals = [];
  }

  componentWillUnmount() {
    this.intervals.forEach(clearInterval);
  }

  intervals: number[];

  setInterval(fn: Function, ms: number) {
    this.intervals.push(setInterval(fn, ms));
  }
}
