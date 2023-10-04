import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StackNavigator from './StackNavigator'; // Import your StackNavigator component here

const Drawer = createDrawerNavigator();

const SidebarNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen name="Main" component={StackNavigator} />
      {/* Add more screens here */}
    </Drawer.Navigator>
  );
};

export default SidebarNavigator;
