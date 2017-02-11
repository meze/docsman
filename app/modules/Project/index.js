// @flow
import { injectReducer } from '../../store/reducers';
import reducer from './actions/reducer';
import uri from './uri';

export default (store: Object) => {
  injectReducer(store, { key: 'projects', reducer });

  return [{
    path: uri.settings,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure([], (require) => {
        const page = require('./containers/ProjectSettingsPage').default;
        cb(null, page);
      }, 'project');
    }
  }, {
    path: uri.create,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure([], (require) => {
        const page = require('./containers/AddProjectPage').default;
        cb(null, page);
      }, 'project');
    }
  }];
};
