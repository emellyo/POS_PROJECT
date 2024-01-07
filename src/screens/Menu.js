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
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getcategories} from '../api/getcategories';
import {getitem} from '../api/getitem';
import {Item} from 'react-navigation-header-buttons';
import {getvariant} from '../api/getvariant';
import {getrunno} from '../api/getrunningnumber';
import * as dbconn from '../db/AddItem';

export default function Menu({navigation}) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  const colors = useTheme().colors;
  const route = useRoute();
  const increment = useRef(null);
  //const [refreshing, setRefreshing] = useState(false);
  //*BPB LOOKUP
  // const [nomorbpb, setNomorBpb] = useState('');
  // const [itembpb, setItemBpb] = useState([]);
  const [mdlBPB, setMdlBPB] = useState(false);
  // const [openbpb, setOpenBpb] = useState(false);

  //#region //* VARIABLE

  const [mdlConfirm, setMdlConfirm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [information, setInformation] = useState('');
  const [mdlConfirmCust, setMdlConfirmCust] = useState(false);
  const [mdlPayment, setMdlPayment] = useState(false);
  const [mdlVariant, setMdlVariant] = useState(false);
  const [mdlBills, setMdlBills] = useState(false);
  const [modalCustVisible, setModalCustVisible] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [category, setCategory] = useState([]);
  const [item, setItem] = useState([]);
  const [variant, setVariant] = useState([]);
  const [jmlcat, setJmlCat] = useState(0);
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [cat, setCat] = useState('');
  const [count, setCount] = useState(1);
  const [runno, setRunno] = useState('');
  const [addtemp, setAddTemp] = useState([]);
  //#endregion

  useEffect(() => {
    setMdlConfirmCust(true);
    //setMdlBills(true);
    setMdlPayment(false);
    Categories();
    GetItems();
    GetRunno();
    LOADTBLADDITEM();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const LOADTBLADDITEM = async () => {
    try {
      const db = await dbconn.getDBConnection();
      //await dbconn.dropTbl(db, 'AddItem');
      await dbconn.AddItem_CreateTbl(db, 'AddItem');
      await dbconn.deletedataAllTbl(db, 'AddItem');
      const storedTbl = await dbconn.AddItem_getdata(db, 'AddItem');
      if (storedTbl.length) {
        console.log('datastored:', storedTbl);
      } else {
        console.log('no data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //#region //* FUNCTION

  const Categories = async () => {
    getcategories({})
      .then(async result => {
        if (result.status == 200) {
          const results = [{label: 'All Categories', value: ''}];
          var catfirst;
          var hasil = result.data;
          console.log('hasil return: ', hasil);
          if (hasil.length > 0) {
            for (let i = 0; i < hasil.length; i++) {
              let data = hasil[i];
              let value = data.category_ID;
              if (i == 0) {
                catfirst = value;
              }
              var joined = {
                label: data.category_Name,
                value: value,
              };
              results.push(joined);
            }
          }
          setCategory(results);
          setJmlCat(results.length);
          if (results.length > 0) {
            setDomain(catfirst);
          }
        }
      })
      .catch(async err => {
        console.log('respon: ' + err.message);
        let msg = 'Servers is not available.';
        msg = err.message;
      });
  };

  const GetRunno = async () => {
    getrunno({
      DOCID: 'INV',
    })
      .then(async result => {
        if (result.status == 200) {
          var hasil = result.data;
          console.log('hasil getrunno: ', hasil);
          var number = hasil[0].gennumber;
          setRunno(number);
        }
      })
      .catch(async err => {
        console.log('respon: ' + err.message);
        let msg = 'Servers is not available.';
        msg = err.message;
      });
  };

  const GetItems = async () => {
    getitem({
      UserID: '',
      Item_Number: '',
      Category_ID: '',
      LowStock: 0,
    }).then(async result => {
      var hasil = result.data;
      console.info('hasil get item: ', hasil);
      setItem(hasil);
    });
  };

  const GetItemsbyCat = async category => {
    setItem([]);
    console.log('category: ', category);
    getitem({
      UserID: '',
      Item_Number: '',
      Category_ID: category,
      LowStock: 0,
    }).then(async result => {
      var hasil = result.data;
      setItem(hasil);
    });
  };

  const GetVariants = async variant => {
    setVariant([]);
    var itmno = variant.item_Number;
    var cat = variant.category_ID;
    console.log('category: ', variant);
    getvariant({
      UserID: '',
      Item_Number: itmno,
      Category_ID: cat,
      LowStock: 0,
    }).then(async result => {
      let dtAddItem = [];
      var hasil = result.data;
      const db = await dbconn.getDBConnection();
      await dbconn.AddItem_savedata(db, 'AddItem', hasil);
      dtAddItem = await dbconn.AddItem_getdata(db, 'AddItem');
      setAddTemp(dtAddItem);
      console.log('isi dtAddItem: ', dtAddItem);
      setVariant(hasil);
      viewModalVariant();
      //console.log('HASIL GET VARIANT', hasil);
    });
  };

  const handleIncrement = () => {
    // Increase count by 1
    setCount(count + 1);
  };

  const handleDecrement = () => {
    // Decrease count by 1, but don't let it go below 0
    setCount(Math.max(1, count - 1));
  };

  function selectedCat(nilai) {
    try {
      setCat(nilai);
      GetItemsbyCat(nilai);
    } catch (error) {}
  }

  //#endregion

  //#region //* EVENT

  const viewModalVariant = async () => {
    setMdlVariant(true);
  };

  const viewModalBills = async () => {
    setMdlBills(true);
  };

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  //#endregion

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={{flex: 1, width: '100%', height: '100%', padding: 0}}>
      <SafeAreaView
        style={{flex: 1, flexDirection: 'column', backgroundColor: '#FFFFFF'}}>
        {/* //* INFORMATION */}
        {/* <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Information</Text>
              </View>
              <View style={{margin: 20,marginBottom: 0,}}>
                {information == '' ? 
                (
                  <Text style={{color: '#212121',fontSize: 16,}}>Not available new module</Text>
                ) 
                :
                (
                  <Text style={{color: 'red',fontSize: 16,}}>{information == '' ? "Not available new module" : information}</Text>
                )
                }                  
                </View>
                <TouchableOpacity style={[globalStyles.button, globalStyles.buttonClose]}
                // onPress={() => setModalVisible(!modalVisible)} onRefresh
               
                onPress={() => {validInformationOk(!modalVisible); RELOADPAGE();}}
                // refreshControl={
                //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                // }
                //onPress={this.resetState}
                >
                <Text style={globalStyles.textStyle}>Ok</Text>
              </TouchableOpacity>
              </View>
            </View>
        </Modal> */}
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Information</Text>
              </View>
              <View style={{margin: 20, marginBottom: 0}}>
                <Text style={globalStyles.textinformation}>{information}</Text>
              </View>
              <TouchableOpacity
                style={[globalStyles.button, globalStyles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  //RELOADPAGE();
                }}>
                <Text style={globalStyles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* //* CONFIRM POSTING */}
        <Modal animationType="fade" transparent={true} visible={mdlConfirm}>
          <View style={globalStyles.centeredView}>
            <View style={globalStyles.modalView}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Confirmation</Text>
              </View>
              <View style={{margin: 20, marginBottom: 0}}>
                <Text style={{color: '#212121', fontSize: 16}}>
                  Apakah anda yakin ingin mengirimkan? Proses tidak bisa
                  dikembalikan
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginHorizontal: 0}}>
                <TouchableOpacity
                  style={[globalStyles.buttonNo]}
                  onPress={() => setMdlConfirm(!mdlConfirm)}>
                  <Text style={globalStyles.textNo}>Tidak</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.buttonYes]}
                  //onPress={PostDataInvOut}
                >
                  <Text style={globalStyles.textStyle}>Ya</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* CONFIRM POSTING */}

        {/* //* CUSTOMER TRX */}
        <Modal animationType="fade" transparent={true} visible={mdlConfirmCust}>
          <View style={globalStyles.centeredViewCust}>
            <View style={globalStyles.modalViewCust}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Customer Name</Text>
              </View>
              <View style={{margin: 0, marginBottom: 0}}>
                <TextInput
                  style={[
                    globalStyles.textinputcustomer,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}
                  maxLength={100}
                  //placeholder={'Masukkan Kata Sandi'}
                  //placeholderTextColor={colors.text}
                  //secureTextEntry={seePassword}
                  //value={password}
                  //onChangeText={text => setPassword(text)}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 0,
                  marginTop: '10%',
                }}>
                <TouchableOpacity
                  style={[globalStyles.buttonNo]}
                  onPress={() => setMdlConfirmCust(!mdlConfirmCust)}>
                  <Text style={globalStyles.textNo}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.buttonYes]}
                  onPress={() => setMdlConfirmCust(!mdlConfirmCust)}
                  //onPress={PostDataInvOut}
                >
                  <Text style={globalStyles.textStyle}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* CUSTOMER TRX */}

        {/* //* MODAL PAYMENT */}
        <Modal animationType="fade" transparent={true} visible={mdlPayment}>
          <View style={globalStyles.centeredViewPayment}>
            <View style={globalStyles.modalViewPayment}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Payment</Text>
              </View>
              <ScrollView style={globalStyles.InputTender}>
                {/* //* TENDER INPUT*/}
                <SafeAreaView style={[invrecStyles.inputantotalan]}>
                  <View style={globalStyles.labelinputtotalan}>
                    <Text
                      style={[
                        invrecStyles.labelinput,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Total Amount
                    </Text>
                  </View>
                  <View style={globalStyles.inputtotalan}>
                    <TextInput
                      style={[
                        globalStyles.textinputpayment,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      //placeholder={'Masukkan Kata Sandi'}
                      //placeholderTextColor={colors.text}
                      //secureTextEntry={seePassword}
                      //value={password}
                      //onChangeText={text => setPassword(text)}
                    />
                  </View>
                </SafeAreaView>
                {/* //* TENDER INPUT*/}
              </ScrollView>
              <View style={[globalStyles.InputTotalan]}>
                <SafeAreaView style={[invrecStyles.inputantotalan]}>
                  <View style={globalStyles.labelinputtotalan}>
                    <Text
                      style={[
                        invrecStyles.labelinput,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Total Amount
                    </Text>
                  </View>
                  <View style={globalStyles.inputtotalan}>
                    <TextInput
                      style={[
                        globalStyles.textinputpayment,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      //placeholder={'Masukkan Kata Sandi'}
                      //placeholderTextColor={colors.text}
                      //secureTextEntry={seePassword}
                      //value={password}
                      //onChangeText={text => setPassword(text)}
                    />
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalan]}>
                  <View style={globalStyles.labelinputtotalan}>
                    <Text
                      style={[
                        invrecStyles.labelinput,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Total Tendered
                    </Text>
                  </View>
                  <View style={globalStyles.inputtotalan}>
                    <TextInput
                      style={[
                        globalStyles.textinputpayment,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      //placeholder={'Masukkan Kata Sandi'}
                      //placeholderTextColor={colors.text}
                      //secureTextEntry={seePassword}
                      //value={password}
                      //onChangeText={text => setPassword(text)}
                    />
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalan]}>
                  <View style={globalStyles.labelinputtotalan}>
                    <Text
                      style={[
                        invrecStyles.labelinput,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Changes
                    </Text>
                  </View>
                  <View style={globalStyles.inputtotalan}>
                    <TextInput
                      style={[
                        globalStyles.textinputpayment,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      //placeholder={'Masukkan Kata Sandi'}
                      //placeholderTextColor={colors.text}
                      //secureTextEntry={seePassword}
                      //value={password}
                      //onChangeText={text => setPassword(text)}
                    />
                  </View>
                </SafeAreaView>
              </View>
              <View style={globalStyles.ButtonPayment}>
                <SafeAreaView style={[invrecStyles.buttontotalan]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonNoPayment]}
                    onPress={() => setMdlPayment(!mdlPayment)}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    //onPress={PostDataInvOut}
                  >
                    <Text style={globalStyles.textStyle}>Payment</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL PAYMENT */}

        {/* //* MODAL VARIANT */}
        <Modal animationType="fade" transparent={true} visible={mdlVariant}>
          <View style={globalStyles.centeredViewPayment}>
            <View style={globalStyles.modalViewPayment}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Variant</Text>
              </View>
              <Text style={globalStyles.TextHeaderVariant}>Variant</Text>
              <ScrollView
                style={globalStyles.InputVariant}
                nestedScrollEnabled={true}>
                {/* //* VARIANT*/}
                <View style={[invrecStyles.inputantotalan]}>
                  {variant.map((variant, index) => {
                    return (
                      <View key={index} style={globalStyles.inputtotalan}>
                        <TouchableOpacity
                          style={[globalStyles.buttonSubmitFlag]}>
                          <Text style={globalStyles.textFlag}>
                            {variant.variant_Name}
                          </Text>
                          <Text style={globalStyles.textFlag2}>
                            {variant.item_Cost}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
                {/* //* VARIANT*/}
              </ScrollView>
              <View style={[globalStyles.InputTotalanVariant]}>
                <SafeAreaView style={[invrecStyles.inputanvariant]}>
                  <View style={globalStyles.inputtotalan}>
                    <TextInput
                      style={[
                        globalStyles.textinputcomment,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      placeholder={'Comment'}
                      placeholderTextColor={colors.text}
                    />
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputanqty]}>
                  <TouchableOpacity style={[globalStyles.buttonQTYMinus]}>
                    <Text style={globalStyles.textNo} onPress={handleDecrement}>
                      {' '}
                      -{' '}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[
                      globalStyles.textinputqty,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}
                    value={count.toString()}
                    maxLength={100}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={[globalStyles.buttonQTYPlus]}>
                    <Text style={globalStyles.textNo} onPress={handleIncrement}>
                      {' '}
                      +{' '}
                    </Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
              <View style={globalStyles.ButtonPayment}>
                <SafeAreaView style={[invrecStyles.buttontotalan]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonNoPayment]}
                    onPress={() => setMdlVariant(!mdlVariant)}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    //onPress={PostDataInvOut}
                  >
                    <Text style={globalStyles.textStyle}>Add Item</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL VARIANT */}

        {/* //* MODAL BILLS */}
        <Modal animationType="fade" transparent={true} visible={mdlBills}>
          <View style={globalStyles.centeredViewPayment}>
            <View
              style={globalStyles.modalViewBills}
              nestedScrollEnabled={true}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Invoice</Text>
              </View>
              <Text style={globalStyles.TextHeaderBills}>Tipe Transaksi</Text>
              <ScrollView style={globalStyles.InputBills}>
                {/* //* BILLS*/}
                <SafeAreaView style={[invrecStyles.inputantotalanbillskiri]}>
                  <View style={globalStyles.cartlist}>
                    <View style={globalStyles.kiri}>
                      <View style={globalStyles.itemqty}>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          Kopi Susu
                        </Text>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          x3
                        </Text>
                      </View>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        NM, LI, LS
                      </Text>
                    </View>
                    <View style={globalStyles.kanan}>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        Rp 18.000
                      </Text>
                    </View>
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalanbillskiri]}>
                  <View style={globalStyles.cartlist}>
                    <View style={globalStyles.kiri}>
                      <View style={globalStyles.itemqty}>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          Kopi Susu
                        </Text>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          x3
                        </Text>
                      </View>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        NM, LI, LS
                      </Text>
                    </View>
                    <View style={globalStyles.kanan}>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        Rp 18.000
                      </Text>
                    </View>
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalanbillskiri]}>
                  <View style={globalStyles.cartlist}>
                    <View style={globalStyles.kiri}>
                      <View style={globalStyles.itemqty}>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          Kopi Susu
                        </Text>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          x3
                        </Text>
                      </View>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        NM, LI, LS
                      </Text>
                    </View>
                    <View style={globalStyles.kanan}>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        Rp 18.000
                      </Text>
                    </View>
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalanbillskiri]}>
                  <View style={globalStyles.cartlist}>
                    <View style={globalStyles.kiri}>
                      <View style={globalStyles.itemqty}>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          Kopi Susu
                        </Text>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          x3
                        </Text>
                      </View>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        NM, LI, LS
                      </Text>
                    </View>
                    <View style={globalStyles.kanan}>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        Rp 18.000
                      </Text>
                    </View>
                  </View>
                </SafeAreaView>
                {/* //* BILLS*/}
              </ScrollView>
              <ScrollView style={globalStyles.InputBills2}>
                <Text style={globalStyles.TextHeaderBills2}>Discounts</Text>
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Discounts A 20%
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
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Discounts A 20%
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
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Discounts B 20%
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
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Discounts A 20%
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
              </ScrollView>
              <ScrollView style={globalStyles.InputBills3}>
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Total
                    </Text>
                  </View>
                  <View style={globalStyles.kanan2}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Rp 75.000
                    </Text>
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Discount
                    </Text>
                  </View>
                  <View style={globalStyles.kanan2}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Rp 0
                    </Text>
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      PPN 11%
                    </Text>
                  </View>
                  <View style={globalStyles.kanan2}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Rp 8.250
                    </Text>
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Grand Total
                    </Text>
                  </View>
                  <View style={globalStyles.kanan2}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Rp 75.000
                    </Text>
                  </View>
                </SafeAreaView>
              </ScrollView>
              <View style={globalStyles.ButtonPayment}>
                <SafeAreaView style={[invrecStyles.buttontotalan]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonNoPayment]}
                    onPress={() => setMdlBills(!mdlBills)}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    //onPress={PostDataInvOut}
                  >
                    <Text style={globalStyles.textStyle}>Payment</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL BILLS */}
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
            <TouchableOpacity
              style={invrecStyles.bannerinvoice}
              onPress={viewModalBills}>
              <Text style={invrecStyles.bannerpanahback2}> Bills </Text>
              <Icon name={'file-invoice'} size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={invrecStyles.bannermenutext}>Menu</Text>
            <Text style={invrecStyles.bannermenutext}></Text>
          </View>
        </SafeAreaView>
        {/* //* BANNER */}

        {/* //* CONTENT */}
        <ScrollView style={{flex: 3, padding: 15, height: '100%'}}>
          <View
            style={
              (invrecStyles.menucatdropdown, {minHeight: open ? '50%' : '20%'})
            }>
            <DropDownPicker
              style={{elevation: 5, zIndex: 1, marginRight: 0}}
              textStyle={{fontWeight: '600', fontSize: 15}}
              showTickIcon={true}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
                decelerationRate: 'fast',
              }}
              closeOnBackPressed={true}
              closeAfterSelecting={true}
              //itemSeparator={true}
              searchable={true}
              //mode="BADGE"
              //badgeColors={['blue', 'green', 'orange']}
              //placeholder="Select your category"
              open={open}
              items={category}
              setOpen={setOpen}
              value={domain}
              setValue={setDomain}
              setItems={setCategory}
              onSelectItem={item => {
                selectedCat(item.value);
                console.log('nilai cat:' + item.value);
              }}
              dropDownStyle={{maxHeight: 500, backgroundColor: 'white'}}
            />
            {/* <TouchableOpacity
              style={[invrecStyles.iconlookup, {backgroundColor: colors.card}]}>
              <Icon name={'search'} size={20} color="#bdbdbd" />
            </TouchableOpacity> */}
          </View>
          {/* <SafeAreaView style={invrecStyles.form}></SafeAreaView> */}
          <ScrollView nestedScrollEnabled={true}>
            <View
              style={{
                flex: 3,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 5,
              }}>
              {/* //! MENU ITEM */}
              {item.map((item, index) => {
                return (
                  <View key={index} style={globalStyles.menuitemlist}>
                    <TouchableOpacity
                      style={globalStyles.menubuttonitemnew}
                      onPress={() => GetVariants(item)}>
                      <Icon name={'tshirt'} size={50} color="#0096FF" />
                      <Text style={globalStyles.menubuttontextnew}>
                        {item.item_Name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </ScrollView>
        {/* //* CONTENT */}
        {/* //* FOOTER */}
        {/* //* FOOTER */}
      </SafeAreaView>
    </ScrollView>
  );
}
