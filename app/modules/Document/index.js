// @flow
import { injectReducer } from '../../store/reducers';
import uri from './uri';

export default (store: Object) => {
  const reducer = require('./actions/reducer').default;
  injectReducer(store, { key: 'documents', reducer });

  return [{
    path: uri.documents,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure(['../Campaign'], (require) => {
        const Documents = require('./containers/DocumentsPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: uri.document,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure(['../Campaign'], (require) => {
        const Documents = require('./containers/DocumentPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: uri.settings,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure(['../Campaign'], (require) => {
        const Documents = require('./containers/DocumentSettingsPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: uri.create,
    getComponent(nextState: Object, cb: Function) {
      (require: Object).ensure(['../Campaign'], (require) => {
        const Documents = require('./containers/AddDocumentPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }];
};
