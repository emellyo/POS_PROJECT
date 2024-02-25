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
import PrinterScreen from './src/screens/PrinterSetup';
import DiscountScreen from './src/screens/Discount';
import ShiftsScreen from './src/screens/Shifts';
import Sidebar from './src/screens/SideBar';
import SidebarContent from './src/screens/SideBarContent';
import PrintBluetooth from './src/screens/printBluetooth';
// import InvRecScreen from './src/screens/InvReceiving';
// import InvOutScreen from './src/screens/InvOut';
// import BarcodeScan from './src/screens/BarcodeScanner';
// import StockScreen from './src/screens/StockCount';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator();

// const HomeStack = () => (
//   <Stack.Navigator initialRouteName="Home">
//     <Stack.Screen name="Home" component={HomeScreen} />
//     {/* Add more screens to the stack as needed */}
//   </Stack.Navigator>
// );

const App = () => {
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
        <Stack.Screen 
        name="Printer" 
        component={PrinterScreen}
        options={{ title: 'Printer Page'}} />
        <Stack.Screen 
        name="Discount" 
        component={DiscountScreen}
        options={{ title: 'Discount Page'}} />
        <Stack.Screen 
        name="Shifts" 
        component={ShiftsScreen}
        options={{ title: 'Shifts Page'}} />
        <Stack.Screen name="Home">
          {() => (
            <Drawer.Navigator drawerContent={props => <SidebarContent {...props} />}>
              <Drawer.Screen name=" " component={HomeScreen} />
            </Drawer.Navigator> 
          )}
          </Stack.Screen> 
        {/* <Stack.Screen 
        name="Print" 
        component={PrintBluetooth}
        options={{ title: 'Print Bluetooth Page'}} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  // <NavigationContainer>
  //     <AppNavigator />
  //   </NavigationContainer>
  );
};
export default App;

