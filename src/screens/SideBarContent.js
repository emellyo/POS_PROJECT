import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const SidebarContent = props => {
  const {navigation} = props;

  const navigateToScreen = screenName => {
    navigation.navigate(screenName);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View>
        <TouchableOpacity onPress={() => navigateToScreen('Home')}>
          <Text>Home</Text>
        </TouchableOpacity>
        {/* Add more sidebar links here */}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default SidebarContent;
