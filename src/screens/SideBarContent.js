import React from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {globalStyles, invrecStyles} from '../css/global';
import {useNavigation} from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SidebarContent = props => {
  const {navigation, state} = props;
  //const navigation = useNavigation();
  const navigateToScreen = screenName => {
    navigation.navigate(screenName);
  };
  const openModal = () => {
    // Navigate to the "Home" screen and open the modal
    navigation.navigate('Home', {showModal: true});
  };

  return (
    <View style={{padding: 16}}>
      <TouchableOpacity onPress={() => navigateToScreen('Home')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Icon name="home" size={25} color="#212121" />
          <Text
            style={{
              color: '#212121',
              fontSize: 25,
              marginLeft: 8,
            }}>
            Home
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Shifts')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Icon name="clock" size={25} color="#212121" />
          <Text style={{color: '#212121', fontSize: 25, marginLeft: 8}}>
            Shifts
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Receipt')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Icon name="receipt" size={25} color="#212121" />
          <Text style={{color: '#212121', fontSize: 25, marginLeft: 8}}>
            Receipts
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Discount')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Icon name="percent" size={25} color="#212121" />
          <Text style={{color: '#212121', fontSize: 25, marginLeft: 8}}>
            Discounts
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('Print')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Icon name="cog" size={25} color="#212121" />
          <Text style={{color: '#212121', fontSize: 25, marginLeft: 8}}>
            Settings
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          openModal();
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <Icon name="sign-out-alt" size={25} color="#212121" />
          <Text style={{color: '#212121', fontSize: 25, marginLeft: 8}}>
            Logout
          </Text>
        </View>
      </TouchableOpacity>
      {/* Add more sidebar links here */}
    </View>
  );
};

export default SidebarContent;
