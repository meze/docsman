import expect from 'expect';
import React, { PropTypes } from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AddProjectPage from 'modules/Project/containers/AddProjectPage';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);
function setup(isLoading = false) {
  const store = mockStore({
    projects: {
      items: [],
      isLoading: false
    }
  });
  const props = {
    isLoading,
    onSave: () => {},
    onBackClick: () => {}
  };
  //  <Provider store={store}>
 //     <AddProjectPage {...props} />
 //   </Provider>,

  return mount(
    <AddProjectPage {...props} />,
    {
      context: {
        store: store,
        router: {}
      },
      childContextTypes: {
        router: PropTypes.object
      }
    }
  );
}

describe('(Modules - Project) containers/AddProjectPage', () => {
  it('shows loader', () => {
    const segment = setup(true);
    console.log('state',  segment.props());

    //expect(segment.props().loading).toBe(true);
  });
});
