import { injectReducer } from '../../store/reducers';
import reducer from './actions/reducer';
import uri from './uri';

export default (store) => {
  injectReducer(store, { key: 'projects', reducer });

  return [{
    path: uri.settings,
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const page = require('./containers/ProjectSettingsPage').default;
        cb(null, page);
      }, 'project');
    }
  }, {
    path: uri.create,
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const page = require('./containers/AddProjectPage').default;
        cb(null, page);
      }, 'project');
    }
  }];
};
