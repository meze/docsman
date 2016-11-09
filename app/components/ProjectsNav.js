import React, { PropTypes as T } from 'react';
import { Menu } from 'semantic-ui-react';

export default class ProjectsNav extends React.Component {
  static propTypes = {
    activeItem: T.number,
    handleItemClick: T.func.isRequired,
    items: T.arrayOf(T.shape({
      name: T.string.isRequired,
      id: T.number.isRequired
    })).isRequired
  };

  render() {
    const handleItemClick = this.props.handleItemClick;
    const menuItems = this.props.items.map((item) => {
      return <Menu.Item name={item.id.toString()} key={item.id} active={item.id === this.props.activeItem} onClick={handleItemClick} content={item.name} />;
    });

    return (
      <Menu secondary={true} pointing={true} vertical={true} fluid={true}>
        {menuItems}
      </Menu>
    );
  }
}
