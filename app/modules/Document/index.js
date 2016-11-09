import { injectReducer } from '../../store/reducers';

export default (store) => {
  const reducer = require('./actions/reducer').default;
  injectReducer(store, { key: 'documents', reducer });

  return [{
    path: '/projects/:project/documents',
    getComponent(nextState, cb) {
      require.ensure(['../Project'], (require) => {
        const Documents = require('./containers/DocumentsPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: '/projects/:project/documents/:document',
    getComponent(nextState, cb) {
      require.ensure(['../Project'], (require) => {
        const Documents = require('./containers/DocumentPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }, {
    path: '/projects/:project/createDocument',
    getComponent(nextState, cb) {
      require.ensure(['../Project'], (require) => {
        const Documents = require('./containers/AddDocumentPage').default;
        cb(null, Documents);
      }, 'document');
    }
  }];
};
