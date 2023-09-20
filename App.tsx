/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

//import SplashScreen from './src/screens/Splash';
import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';
//import Home from './src/screens/Home';
import MenuScreen from './src/screens/Menu';
import HamburgerMenu from './src/screens/HamburgerMenu';
// import InvRecScreen from './src/screens/InvReceiving';
// import InvOutScreen from './src/screens/InvOut';
// import BarcodeScan from './src/screens/BarcodeScanner';
// import StockScreen from './src/screens/StockCount';

const Stack = createNativeStackNavigator()
//const Drawer = createDrawerNavigator();

const App = () => {
  return (
     <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Login Page'}} />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home Page'}} />
        <Stack.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{ title: 'Menu Page'}} />
    </Stack.Navigator>  
    </NavigationContainer>
  );
}

export default App;

