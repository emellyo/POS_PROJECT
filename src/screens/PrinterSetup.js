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
import CheckBox from '@react-native-community/checkbox';
import * as Utils from '../Helpers/Utils';
//import {loadingartha, wmsclear} from '../images/images';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Printer({navigation}) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  const colors = useTheme().colors;
  const route = useRoute();
  const increment = useRef(null);
  //const navigation = useNavigation();

  const [mdlPrinter, setMdlPrinter] = useState(false);

  useEffect(() => {
    setMdlPrinter(true);
    BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
      HideModalPrinter,
    );
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
        HideModalPrinter,
      );
    };
  }, []);

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  function HideModalPrinter() {
    setMdlPrinter(false);
  }

  return (
    <SafeAreaView>
      {/* //* PRINTER SETTING */}
      <Modal animationType="fade" transparent={true} visible={mdlPrinter}>
        <View style={globalStyles.centeredViewPrinter}>
          <View style={globalStyles.modalViewPrinter}>
            <View style={globalStyles.modalheaderPrinter}>
              <TouchableOpacity
                style={invrecStyles.bannerpanahbackprinter}
                onPress={() => setMdlPrinter(!mdlPrinter)}>
                <Icon name={'arrow-left'} size={25} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={globalStyles.modalText}>Printer Setup</Text>
            </View>
            <SafeAreaView style={[invrecStyles.inputanprinter]}>
              <View style={globalStyles.labelinputprinter}>
                <Text
                  style={[
                    invrecStyles.labelinputprinter,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Name
                </Text>
              </View>
              <View style={globalStyles.inputprinter}>
                <TextInput
                  style={[
                    globalStyles.textinputprinter,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}
                  maxLength={100}
                  //placeholderTextColor={colors.text}
                  //secureTextEntry={seePassword}
                  //onChangeText={text => setPassword(text)}
                />
              </View>
            </SafeAreaView>
            <SafeAreaView style={[invrecStyles.inputanprinter2]}>
              <View style={globalStyles.labelinputprinter}>
                <Text
                  style={[
                    invrecStyles.labelinputprinter,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Printer
                </Text>
              </View>
              <View style={globalStyles.inputprinter}>
                <DropDownPicker
                  style={{elevation: 5, zIndex: 1, marginRight: 15}}
                  textStyle={{fontWeight: '600', fontSize: 15}}
                  showTickIcon={true}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{nestedScrollEnabled: true}}
                  closeOnBackPressed={true}
                  closeAfterSelecting={true}
                  //itemSeparator={true}
                  searchable={true}
                  searchPlaceholder="No Printer"
                  //mode="BADGE"
                  //badgeColors={['blue', 'green', 'orange']}
                  placeholder="Printers"
                  items={[
                    {label: 'Item 1', value: 'item1'},
                    {label: 'Item 2', value: 'item2'},
                  ]}
                  onChangeItem={item => console.log(item.label, item.value)}
                />
              </View>
            </SafeAreaView>
            <SafeAreaView
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                borderWidth: 1,
                borderColor: '#212121',
                marginTop: 10,
              }}></SafeAreaView>
            <SafeAreaView style={[invrecStyles.inputanprinter2]}>
              <View style={globalStyles.labelinputtotalanbillsdisc}>
                <Text
                  style={[
                    invrecStyles.labelinputprinter,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Print Receipt and Bills
                </Text>
              </View>
              <View style={globalStyles.viewinput2}>
                <CheckBox
                  tintColors={{true: '#0096FF', false: 'black'}}
                  //value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              </View>
            </SafeAreaView>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 0,
                marginTop: '15%',
              }}>
              <TouchableOpacity
                style={[globalStyles.buttonNo]}
                onPress={() => setMdlPrinter(!mdlPrinter)}>
                <Text style={globalStyles.textNo}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.buttonYes]}
                //onPress={PostDataInvOut}
              >
                <Text style={globalStyles.textStyle}>Test Print</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* PRINTER SETTING */}
    </SafeAreaView>
  );
}
