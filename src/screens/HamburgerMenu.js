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
        drawerType="front"
        initialRouteName="Home"
        drawerContentOptions={{
          activeTintColor: '#0096FF',
          itemStyle: {marginVertical: 10},
        }}>
        {BurgerItems.map(drawer => (
          <Drawer.Screen key={drawer.name} />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

<Drawer.Screen
  key={drawer.name}
  name={drawer.name}
  options={{
    drawerIcon: ({focused}) =>
      drawer.iconType === 'FontAwesome5' ? (
        <FontAwesome5
          name={drawer.iconName}
          size={24}
          color={focused ? '#0096FF' : 'black'}
        />
      ) : drawer.iconType === 'FontAwesome5' ? (
        <FontAwesome5
          name={drawer.iconName}
          size={24}
          color={focused ? '#0096FF' : 'black'}
        />
      ) : (
        <FontAwesome5
          name={drawer.iconName}
          size={24}
          color={focused ? '#0096FF' : 'black'}
          component={
            drawer.name === 'Home'
            //   ? ProfileScreen
            //   : drawer.name === 'Settings'
            //   ? SettingsScreen
            //   : drawer.name === 'Saved Items'
            //   ? SavedScreen
            //   : ReferScreen
          }
        />
      ),
  }}
/>;
