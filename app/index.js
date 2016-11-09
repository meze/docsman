import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import 'semantic-ui-css/semantic.css';
import 'notie/dist/notie.css';
import 'ContentTools/build/content-tools.min.css';
import './styles/body.less';

const initialState = window.___INITIAL_STATE__;
const store = createStore(initialState);

const MOUNT_NODE = document.getElementById('app');

let render = () => {
  const modulesRoutes = require('./modules/index').default(store);

  ReactDOM.render(
    <AppContainer store={store} routes={modulesRoutes} />,
    MOUNT_NODE
  );
};

if (__DEV__) {
  if (module.hot) {
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    module.hot.accept('./modules/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      })
    );
  }
}

render();
