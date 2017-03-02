// @flow
import CoreLayout from '../layouts/CoreLayout/CoreLayout';
import HomeRoute from './Home';
import SecurityRoute from './Security';
import ProjectRoute from './Project';
import DocumentRoute from './Document';

export const createRoutes = (store: Object) => ({
  path: '/projects/:project',
  component: CoreLayout,
  childRoutes: [
    HomeRoute(),
    ...SecurityRoute(store),
    ...ProjectRoute(store),
    ...DocumentRoute(store)
  ]
});

export default createRoutes;
