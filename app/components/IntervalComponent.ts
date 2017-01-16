import { Component } from 'react';

export default class IntervalComponent<P, S> extends Component<P, S> {
  private intervals: number[];


  public componentWillMount() {
    this.intervals = [];
  }

  public componentWillUnmount() {
    this.intervals.forEach(clearInterval);
  }

  public setInterval(fn, ms) {
    this.intervals.push(setInterval(fn, ms));
  }
}
