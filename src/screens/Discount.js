import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  BackHandler,
  Modal,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  Component,
  RefreshControl,
  Alert,
  LogBox,
} from 'react-native';
import {globalStyles, invrecStyles} from '../css/global';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useRoute, useTheme} from '@react-navigation/native';
import {SearchBar} from '@rneui/themed';
import CheckBox from '@react-native-community/checkbox';
import * as Utils from '../Helpers/Utils';
//import {loadingartha, wmsclear} from '../images/images';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getdiscount} from '../api/getdiscount';

import SQLite from 'react-native-sqlite-storage';

export default function Discount({navigation}) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  const colors = useTheme().colors;
  const route = useRoute();
  const increment = useRef(null);
  //const navigation = useNavigation();

  const [mdlDiscount, setMdlDiscount] = useState(false);
  const [search, setSearch] = useState('');
  const [discount, setDiscount] = useState([]);

  useEffect(() => {
    setMdlDiscount(true);
    getDiscount();
    BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
      HideModalDiscount,
    );
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
        HideModalDiscount,
      );
    };
  }, []);

  const updateSearch = search => {
    setSearch(search);
  };

  const getDiscount = async () => {
    getdiscount({}).then(async result => {
      if (result.status == 200) {
        var hasil = result.data;
        console.info('hasil getdiscount: ', hasil);
        setDiscount(hasil);
      }
    });
  };

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  function HideModalDiscount() {
    setMdlDiscount(false);
  }

  return (
    <SafeAreaView>
      {/* //* BANNER */}
      <SafeAreaView style={invrecStyles.bannermenu}>
        <TouchableOpacity
          style={invrecStyles.bannerpanahback}
          // onPress={() => navigation.replace('Home')}
          onPress={handleBackButtonClick}>
          <Icon name={'arrow-left'} size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            flexDirection: 'row',
          }}>
          <Text style={invrecStyles.bannermenutext}>Discounts</Text>
        </View>
      </SafeAreaView>
      {/* //* BANNER */}
      {/* //* DISCOUNT LOOKUP */}
      <Modal animationType="fade" transparent={true} visible={mdlDiscount}>
        <View style={globalStyles.centeredViewPrinter}>
          <View style={globalStyles.modalViewPrinter}>
            <View style={globalStyles.modalheaderPrinter}>
              {/* <TouchableOpacity
                style={invrecStyles.bannerpanahbackprinter}
                // onPress={() => setMdlDiscount(!mdlDiscount)}
              >
                <Icon name={'arrow-left'} size={25} color="#FFFFFF" />
              </TouchableOpacity> */}
              <Text style={globalStyles.modalText}>Discounts</Text>
            </View>
            <View style={{width: '100%', marginBottom: 20}}>
              <SearchBar
                placeholder="Search Here..."
                lightTheme
                round
                onChangeText={updateSearch}
                value={search}
                autoCorrect={false}
              />
            </View>
            <ScrollView
              style={globalStyles.InputBills5}
              nestedScrollEnabled={true}>
              {discount.map((disc, index) => {
                return (
                  <SafeAreaView
                    key={index}
                    style={[invrecStyles.inputantotalanbills2]}>
                    <View style={globalStyles.labelinputtotalanbillsdisc}>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        {disc.discount_Name}
                      </Text>
                    </View>
                    <View style={globalStyles.viewinput2}>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        {disc.discount_Value}
                      </Text>
                    </View>
                  </SafeAreaView>
                );
              })}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 0,
                marginTop: '5%',
              }}>
              <TouchableOpacity
                style={[globalStyles.buttonYes]}
                onPress={() => setMdlDiscount(!mdlDiscount)}>
                <Text style={globalStyles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* DISCOUNT LOOKUP */}
    </SafeAreaView>
  );
}
