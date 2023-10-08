import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './Home'; // Import your screen components

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add more screens here */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
