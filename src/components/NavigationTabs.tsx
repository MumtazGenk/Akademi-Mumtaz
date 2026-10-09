import React from 'react';
import { Sidebar, SidebarProps } from './Sidebar';

export const NavigationTabs: React.FC<SidebarProps> = (props) => {
  return <Sidebar {...props} />;
};
