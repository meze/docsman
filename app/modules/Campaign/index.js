// @flow
import { injectReducer } from '../../store/reducers';
import reducer from './actions/reducer';
import uri from './uri';

export default (store: Object) => {
  injectReducer(store, { key: 'campaigns', reducer });

  return [{
    path: uri.settings,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure([], (require) => {
        const page = require('./containers/CampaignSettingsPage').default;
        cb(null, page);
      }, 'campaign');
    }
  }, {
    path: uri.add,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure([], (require) => {
        const page = require('./containers/AddCampaignPage').default;
        cb(null, page);
      }, 'campaign');
    }
  }, {
    path: uri.list,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure([], (require) => {
        const page = require('./containers/CampaignsPage').default;
        cb(null, page);
      }, 'campaign');
    }
  }];
};
