import { injectReducer } from '../../store/reducers';
import uri from './uri';

export default (store) => {
  const reducer = require('./actions/reducer').default;
  injectReducer(store, { key: 'documents', reducer });

  return [{
    path: uri.documents,
    getComponent(nextState, cb) {
      require.ensure(['../Project'], (require) => {
        const Documents = require('./containers/DocumentsPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: uri.document,
    getComponent(nextState, cb) {
      require.ensure(['../Project'], (require) => {
        const Documents = require('./containers/DocumentPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: uri.settings,
    getComponent(nextState, cb) {
      require.ensure(['../Project'], (require) => {
        const Documents = require('./containers/DocumentSettingsPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: uri.create,
    getComponent(nextState, cb) {
      require.ensure(['../Project'], (require) => {
        const Documents = require('./containers/AddDocumentPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }];
};
