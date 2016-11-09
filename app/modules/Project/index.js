import { injectReducer } from '../../store/reducers';
import reducer from './actions/reducer';

export default (store) => {
  injectReducer(store, { key: 'projects', reducer });

  return [{
    path: '/projects/:project/settings',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const page = require('./containers/ProjectSettingsPage').default;
        cb(null, page);
      }, 'project');
    }
  }, {
    path: '/createProject',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const page = require('./containers/AddProjectPage').default;
        cb(null, page);
      }, 'project');
    }
  }];
};
