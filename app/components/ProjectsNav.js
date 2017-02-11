// @flow
import React from 'react';
import { Menu, Label, Loader } from 'semantic-ui-react';

type MenuItemType = {
  name: string,
  id: number,
  [key: any]: any
}

type PropsType = {
  isLoading: boolean,
  activeItem: ?number,
  handleItemClick: (e: Event, args: { name: string }) => void,
  items: MenuItemType[]
}

const ProjectsNav = ({ handleItemClick, items, activeItem, isLoading }: PropsType) => {
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

export default ProjectsNav;
