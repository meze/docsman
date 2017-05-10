// @flow
import CoreLayout from '../layouts/CoreLayout/CoreLayout';
import HomeRoute from './Home';
import SecurityRoute from './Security';
import CampaignRoute from './Campaign';
import DocumentRoute from './Document';

export const createRoutes = (store: Object) => ({
  path: '/campaigns/:campaign',
  component: CoreLayout,
  childRoutes: [
    HomeRoute(),
    ...SecurityRoute(store),
    ...CampaignRoute(store),
    ...DocumentRoute(store)
  ]
});

export default createRoutes;
