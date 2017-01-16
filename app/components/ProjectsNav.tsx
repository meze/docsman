import * as React from 'react';
import { Label, Loader, Menu } from 'semantic-ui-react';


export interface IProjectNavItem {
  name: string;
  id: number;
}

export interface IProjectNavProps {
  activeItem?: number;
  isLoading: boolean;
  items: IProjectNavItem[];
  handleItemClick(e: Event, item: IProjectNavItem): void;
}

const ProjectsNav: React.SFC<IProjectNavProps> = ({ handleItemClick, items, activeItem, isLoading }: IProjectNavProps): JSX.Element => {
  const menuItems = items.map((item) => {
    return (
      <Menu.Item name={item.id.toString()} key={item.id} active={item.id === activeItem} onClick={handleItemClick}>
        {item.name}
        <Label content="211" color="olive" size="mini" />
      </Menu.Item>
    );
  });

  return (
    isLoading ? (
      <Loader active={true} inline="centered" />
    ) : (
      <Menu secondary={true} size="tiny">
        {menuItems}
      </Menu>
    )
  );
};

export default ProjectsNav;
