// components/HeaderButton.js
import React from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {HeaderButton} from 'react-navigation-header-buttons';
import {globalStyles, invrecStyles} from '../css/global';
import {bars} from 'react-native-vector-icons/FontAwesome5'; // Use your preferred icon library

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={bars}
      iconSize={23}
      color="white"
      style={{...globalStyles.bannerhome, backgroundColor: '#0096FF'}}
    />
  );
};

export default CustomHeaderButton;
