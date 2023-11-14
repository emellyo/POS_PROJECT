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

  useEffect(() => {
    setMdlDiscount(true);
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

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  function HideModalDiscount() {
    setMdlDiscount(false);
  }

  const screenHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar
        backgroundColor={'#0096FF'}
        barStyle="light-content"></StatusBar>

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
          <Text style={invrecStyles.bannermenutext}>Shift Details</Text>
        </View>
      </SafeAreaView>
      {/* //* BANNER */}

      {/* //* CONTENT */}
      <ScrollView style={{padding: 15}}>
        <View style={{borderBottomWidth: 1, borderBottomColor: '#212121'}}>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Date Open:
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                17-08-2023
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Time Open:
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                13:37
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Shift Number:
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                ST0001
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Shift Opened:
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Owner
              </Text>
            </View>
          </SafeAreaView>
        </View>
        <View style={{borderBottomWidth: 1, borderBottomColor: '#212121'}}>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshifthdr,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Cash Drawer
                </Text>
              </View>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Starting Cash
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp 100.000
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Cash Payments
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp 50.000
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Cash Refunds
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp 0
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Paid In
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp 0
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Paid Out
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp 0
              </Text>
            </View>
          </SafeAreaView>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshifthdr,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Expected Cash Amount Refunds
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshifthdr,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp 150.000
              </Text>
            </View>
          </SafeAreaView>
        </View>
        <View style={[invrecStyles.form]}>
          <View style={[invrecStyles.menuitemsubmit2, {paddingRight: 5}]}>
            <TouchableOpacity disabled style={globalStyles.buttonSubmitDisable}>
              <Text style={globalStyles.text}>Kirim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* //* CONTENT */}

      {/* //* FOOTER */}
      {/* <SafeAreaView style={[globalStyles.box5]}>
        <View style={[globalStyles.footer]}>
          <Icon name={'copyright'} size={14} color="#212121" />
          <Text style={{color: colors.text, paddingLeft: 2}}>ArthaIT 2023</Text>
        </View>
      </SafeAreaView> */}
      {/* //* FOOTER */}
    </SafeAreaView>
  );
}
