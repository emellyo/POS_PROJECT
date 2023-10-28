import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {globalStyles, invrecStyles} from '../css/global';

const Sidebar = () => {
  const navigation = useNavigation();

  const navigateToScreen = screenName => {
    navigation.navigate(screenName);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => navigateToScreen('Home')}>
        <Text style={globalStyles.sidebartitle}>Home</Text>
      </TouchableOpacity>
      {/* Add more sidebar items as needed */}
    </View>
  );
};
// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     width: 200, // Adjust the width as needed
//     backgroundColor: 'white', // Sidebar background color
//     // Ensures it appears on top of the content
//   },
//   sidebar: {
//     padding: 16,
//   },
// });
export default Sidebar;
