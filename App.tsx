/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import SplashScreen from './src/screens/Splash';
import SidebarNavigator from './src/screens/SideBarNavigator';
import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';
import AppNavigator from './src/screens/AppNavigator';
//import Home from './src/screens/Home';
import MenuScreen from './src/screens/Menu';
import Sidebar from './src/screens/SideBar';
// import InvRecScreen from './src/screens/InvReceiving';
// import InvOutScreen from './src/screens/InvOut';
// import BarcodeScan from './src/screens/BarcodeScanner';
// import StockScreen from './src/screens/StockCount';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    {/* Add more screens to the stack as needed */}
  </Stack.Navigator>
);

const App = () => {
  // return (
  //    <NavigationContainer>
  //     <Stack.Navigator
  //       initialRouteName="Splash"
  //       screenOptions={{headerShown: false}}>
  //     {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
  //     <Stack.Screen 
  //       name="Login" 
  //       component={LoginScreen}
  //       options={{ title: 'Login Page'}} />
  //     <Stack.Screen 
  //       name="Home" 
  //       component={HomeScreen}
  //       options={{ title: 'Home Page'}} />
  //       <Stack.Screen 
  //       name="Menu" 
  //       component={MenuScreen}
  //       options={{ title: 'Menu Page'}} />
  //   </Stack.Navigator>  
  //   </NavigationContainer>
  // );
return (
    <NavigationContainer>
  <Stack.Navigator initialRouteName="Login"
      screenOptions={{headerShown: false}}>
        {/* You can add a Login screen here */}
        <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        //options={{ title: 'Login Page'}}
         />
        <Stack.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{ title: 'Menu Page'}} />
        <Stack.Screen name="Home" 
        component={HomeScreen} 
        //options={{ headerLeft: () => <Sidebar />, }} 
        options={{title: 'Home Page'}}
        />
        <Stack.Screen name="Sidebar" component={Sidebar} />
      </Stack.Navigator>
      {/* <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Sidebar" component={Sidebar} />
      </Drawer.Navigator> */}
    </NavigationContainer>
  // <NavigationContainer>
  //     <AppNavigator />
  //   </NavigationContainer>
  );
};
export default App;

