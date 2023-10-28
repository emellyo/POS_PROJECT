// AppNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './Login';
import HomeScreen from './Home';
import OtherScreen from './Menu';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Other" component={OtherScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
