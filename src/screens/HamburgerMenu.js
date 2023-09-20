import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import DrawerItems from '../screens/BurgerItems';
import Home from './Home';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        // For setting Custom Sidebar Menu
        drawerContent={props => <CustomSidebarMenu {...props} />}>
        <Drawer.Screen
          name="HomePage"
          options={{
            drawerLabel: 'Home page Option',
            // Section/Group Name
            groupName: 'Home Section',
            activeTintColor: '#0096FF',
          }}
          component={homescreenstack}
        />
        {/* <Drawer.Screen
      name="SecondPage"
      options={{
        drawerLabel: 'Second page Option',
        // Section/Group Name
        groupName: 'Section 2',
        activeTintColor: '#0096FF',
      }}
      component={secondScreenStack}
    />
    <Drawer.Screen
      name="ThirdPage"
      options={{
        drawerLabel: 'Third page Option',
        // Section/Group Name
        groupName: 'Section 2',
        activeTintColor: '#e91e63',
      }}
      component={thirdScreenStack}
    /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

{
  /* <Drawer.Screen
  key={Drawer.name}
  name={Drawer.name}
  options={{
    drawerIcon: ({focused}) =>
      Drawer.iconType === 'FontAwesome5' ? (
        <FontAwesome5
          name={Drawer.iconName}
          size={24}
          color={focused ? '#0096FF' : 'black'}
        />
      ) : Drawer.iconType === 'FontAwesome5' ? (
        <FontAwesome5
          name={Drawer.iconName}
          size={24}
          color={focused ? '#0096FF' : 'black'}
        />
      ) : (
        <FontAwesome5
          name={Drawer.iconName}
          size={24}
          color={focused ? '#0096FF' : 'black'}
          component={
            Drawer.name === 'Home'
              ? HomeScreen
              : //   : drawer.name === 'Settings' //   ? SettingsScreen
                //   : drawer.name === 'Saved Items' //   ? SavedScreen
                HomeScreen
          }
        />
      ),
  }}
/>; */
}
