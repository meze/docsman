// @flow
import React, { Component } from 'react';
import { hashHistory, Router } from 'react-router';
import { Provider } from 'react-redux';

type PropsType = {
  routes: Object,
  store: Object
}

class AppContainer extends Component {
  shouldComponentUpdate() {
    return false;
  }

  props: PropsType

  render() {
    const { routes, store } = this.props;

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={hashHistory} children={routes} />
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
