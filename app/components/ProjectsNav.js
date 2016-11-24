import React, { PropTypes as T } from 'react';
import { Menu, Label, Loader } from 'semantic-ui-react';

const ProjectsNav = ({ handleItemClick, items, activeItem, isLoading }) => {
  const menuItems = items.map((item) => {
    return (<Menu.Item name={item.id.toString()} key={item.id} active={item.id === activeItem} onClick={handleItemClick}>
      {item.name}
      <Label content="211" color="olive" size="mini" />
    </Menu.Item>);
  });

  return (
    isLoading ? <Loader active={true} inline="centered" /> : <Menu secondary={true} size="tiny">
      {menuItems}
    </Menu>
  );
};

ProjectsNav.propTypes = {
  activeItem: T.number,
  handleItemClick: T.func.isRequired,
  isLoading: T.bool.isRequired,
  items: T.arrayOf(T.shape({
    name: T.string.isRequired,
    id: T.number.isRequired
  })).isRequired
};

export default ProjectsNav;
