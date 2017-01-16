import * as React from 'react';
import { Provider } from 'react-redux';
import { hashHistory, Router } from 'react-router';

interface IAppContainerProps {
  routes: any;
  store: any;
}

class AppContainer extends React.Component<IAppContainerProps, {}> {
  public shouldComponentUpdate() {
    return false;
  }

  public render() {
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
