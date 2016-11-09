import CoreLayout from '../layouts/CoreLayout/CoreLayout';
import HomeRoute from './Home';
import ProjectRoute from './Project';
import DocumentRoute from './Document';

export const createRoutes = (store) => ({
  path: '/projects/:project',
  component: CoreLayout,
  childRoutes: [
    HomeRoute(),
    ...ProjectRoute(store),
    ...DocumentRoute(store)
  ]
});

export default createRoutes;
