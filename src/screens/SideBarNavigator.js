import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen'; // Import your HomeScreen component
import SidebarContent from './SidebarContent'; // Import your sidebar content component

const Drawer = createDrawerNavigator();

const SidebarNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <SidebarContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      {/* Add more screens for the sidebar as needed */}
    </Drawer.Navigator>
  );
};

export default SidebarNavigator;
