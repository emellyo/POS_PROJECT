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
import * as Utils from '../Helpers/Utils';
//import {loadingartha, wmsclear} from '../images/images';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {SQLiteDatabase, enablePromise, openDatabase } from 'react-native-sqlite-storage';
//import BarcodeScanner from 'react-native-scan-barcode';
//import * as dbconn from '../db/dbinvout';

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
  //const [isLoad, setLoad] = useState(false);
  //const [isInet, setInet] = useState(true);
  //const [fullname, setFULLNAME] = useState();
  //const [barcodescan, setBarcodeScan] = useState();
  // const [docnumbr, setDOCNUMBR] = useState('');
  // const [interid, setINTERID] = useState();
  // const [userid, setUSERID] = useState();
  // const [desc, setDesc] = useState();
  // const [list, setList] = useState([]);
  // const [data, setData] = useState([]);
  //onst [reload, setReload] = useState(false);
  //const [refreshing, setRefreshing] = useState(false);
  //#endregion

  useEffect(() => {
    //StartCheck();
    // GetUserData();
    //handleGetItem();
    //RELOADPAGE();
    //LOADTBLINVOUT();
    //setMdlConfirmCust(true);
    setMdlBills(true);
    setMdlPayment(false);
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  // const RELOADPAGE = async () => {
  //   setList([]);
  //   //setData([]);
  //   setDOCNUMBR('');
  //   setMdlConfirm(false);
  //   setModalVisible(false);
  //   setNomorBpb('');
  // };

  //   const LOADTBLINVOUT = async () => {
  //     try {
  //       const db = await dbconn.getDBConnection();
  //       await dbconn.deletedataAllTbl(db, 'InvOut');
  //       await dbconn.InvOut_CreateTbl(db, 'InvOut');

  //       const storedTbl = await dbconn.InvOut_getdata(db, 'InvOut');
  //       if (storedTbl.length) {
  //         console.log('datastored: ', storedTbl);
  //       } else {
  //         console.log('no data');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //#region //* FUNCTION

  //   const GetUserData = () => {
  //     try {
  //       setLoad(true);
  //       var dataall = route.params.dataparams;
  //       // console.info('datauser: ',JSON.stringify(dataall));
  //       // var param_userid = dataall.userid;setUSERID(param_userid);
  //       //var param_interid = dataall.interid;setINTERID(param_interid);
  //       // var param_urlapi = dataall.urlapi;setURLAPI(param_urlapi);
  //       // var param_username = dataall.username;setUSERNAME(param_username);
  //       // var param_password = dataall.fullname;setPASSWORD(param_password);
  //       // var param_fullname = dataall.fullname;setFULLNAME(param_fullname);

  //       // if(emptyStr(param_userid) || emptyStr(param_interid)){
  //       //   console.log('no data');
  //       // }
  //       // else{
  //       //   var mdl = {
  //       //     interid: param_interid,
  //       //     userid: param_userid
  //       //   };
  //       //   // console.log('mdl:',JSON.stringify(mdl));
  //       //   GetOutStanding(mdl);
  //       // }
  //     } catch (err) {
  //       console.log(err);
  //       setLoad(false);
  //     }

  //     delaynew(1000);
  //     setLoad(false);
  //   };

  //   const GetItemListOut = async docnumbr => {
  //     setLoad(true);
  //     const results = [];
  //     setList([]);
  //     console.log('docnumbr :', docnumbr);
  //     getitemlistout({
  //       INTERID: interid,
  //       DOCNUMBR: docnumbr,
  //     })
  //       .then(async result => {
  //         // console.log('datalistitem :', result);
  //         var dataitem = [];
  //         if (result.status == 200) {
  //           var hasil = result.data.SelectResults;
  //           //console.log('datalistitem :', hasil);
  //           if (hasil.length > 0) {
  //             for (let i = 0; i < hasil.length; i++) {
  //               var list = hasil[i];
  //               dataitem.push(list);
  //               //handleAddItemList(list);
  //             }
  //             // handleAddItemList(dataitem);
  //             //setList(dataitem);
  //             //FillDataListItem(dataitem);
  //             console.log('dataitem: ', dataitem);
  //             let dtInvOut = [];
  //             const db = await dbconn.getDBConnection();
  //             await dbconn.InvOut_savedata(db, 'InvOut', dataitem);
  //             dtInvOut = await dbconn.InvOut_getdata(db, 'InvOut');
  //             console.log('database: ', dtInvOut);
  //             setList(dataitem);
  //           }
  //         }
  //         //AsyncStorage.setItem('@dtListItem', JSON.stringify(dataitem));
  //       })
  //       .catch(async err => {
  //         console.log('respon: ' + err.response);
  //         let msg = 'Servers is not available.';
  //         if (!emptyStr(err.message)) {
  //           //get from message
  //           msg = err.message;
  //           if (err.message.trim().toLowerCase().includes('timeout of')) {
  //             msg = 'Servers is not available.';
  //           } else if (err.message.trim().toLowerCase() == 'network error') {
  //             if (isInet == true) {
  //               msg = 'Server is not available.';
  //             } else {
  //               msg = err.message.trim();
  //             }
  //           } else if (err.message.trim().toLowerCase().includes('status code')) {
  //             //have data message
  //             msg = err.response.data.replace('Auth :', '');
  //             if (emptyStr(msg)) {
  //               msg = err.message;
  //             }
  //           }
  //         } else {
  //           msg = err.response.data.replace('Auth :', '');
  //         }

  //         let inet = await CheckInternet();
  //         // console.log('inet com:'+ inet);
  //         if (inet == false) {
  //           msg = 'Please Check Your Connection.';
  //         }
  //         console.info('info message: ' + msg);
  //         CallModalInfo(msg);
  //       })
  //       .finally(() => {
  //         setTimeout(() => {
  //           setLoad(false);
  //         }, 500);
  //       });
  //     await delaynew(500);
  //     setLoad(false);
  //   };

  //   const PostDataInvOut = async () => {
  //     // setReload(true);
  //     // CallModalInfo('Success');
  //     const db = await dbconn.getDBConnection();
  //     let datacheck = await dbconn.queryselectInvOut(
  //       db,
  //       `SELECT DOCNUMBR, ITEMNMBR, ITEMDESC, LNITMSEQ, UOFM, QUANTITY, LOCNCODE from InvOut where FLAG = 1;`,
  //     );
  //     console.log('datapost: ', datacheck);
  //     setData(datacheck);
  //     let dataitem = await AsyncStorage.getItem('@dtUser');
  //     dataitem = JSON.parse(dataitem);
  //     var param_userid = dataitem[0].userid;
  //     var param_interid = dataitem[0].interid;
  //     setUSERID(param_userid);
  //     setINTERID(param_interid);
  //     console.log('masukdata: ', datacheck);
  //     postinvout({
  //       INTERID: param_interid,
  //       USERID: param_userid,
  //       detail: datacheck,
  //     })
  //       .then(async result => {
  //         if (result.status == 200) {
  //           var hasil = result.data.SelectResults;
  //           if (hasil.length > 0) {
  //             let desc = hasil[0].desc;
  //             setDesc(desc);
  //             setReload(true);
  //             CallModalInfoPost(desc);
  //           }
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         let msg = 'Server is not available.';
  //         msg = err.message;
  //         CallModalInfo(msg);
  //       });
  //   };

  // const UpdateDataList = async (item, flag) => {
  //   const db = await dbconn.getDBConnection();
  //   let flagupdate = !flag;
  //   let query = `UPDATE InvOut SET FLAG = ${flagupdate} WHERE NO = ${item};`;
  //   await dbconn.querydynamic(db, query);
  //   let dtInvOut = await dbconn.InvOut_getdata(db, 'InvOut');
  //   console.info('dataupdate: ', dtInvOut);
  //   setList(dtInvOut);
  // };

  // const GetNomorBpb = async () => {
  //   setLoad(true);
  //   const results = [];
  //   let dataitem = await AsyncStorage.getItem('@dtUser');
  //   dataitem = JSON.parse(dataitem);
  //   var param_interid = dataitem[0].interid;
  //   setINTERID(param_interid);
  //   getnomorbpb({
  //     INTERID: param_interid,
  //   })
  //     .then(async result => {
  //       if (result.status == 200) {
  //         var hasil = result.data.SelectResults;
  //         if (hasil.length > 0) {
  //           for (let i = 0; i < hasil.length; i++) {
  //             var data = hasil[i];
  //             var joined = {
  //               label: data.DOCNUMBR,
  //               value: data.DOCNUMBR,
  //               icon: () => <Icon name="hotel" size={15} color="blue" />,
  //             };
  //             results.push(joined);
  //           }
  //         }
  //       }
  //       setItemBpb(results);
  //       setNomorBpb('');

  //       await delaynew(500);
  //       setLoad(false);
  //       setMdlBPB(true);
  //     })
  //     .catch(err => {
  //       console.log('error_bpb_number', err);
  //       let msg = 'Servers is not available.';
  //       msg = err;
  //       CallModalInfo(msg);
  //     });
  //   await delaynew(1000);
  //   setLoad(false);
  // };

  // const UpdateDataListBack = async(item) => {
  //     const db = await dbconn.getDBConnection();
  //     let query = `UPDATE InvOut SET FLAG = 0 WHERE NO = ${item};`;
  //     await dbconn.querydynamic(db, query);
  //     let dtInvOut = await dbconn.InvOut_getdata(db, 'InvOut');
  //     console.info('dataupdate: ', dtInvOut);
  //     setList(dtInvOut);
  // };

  // const FillDataListItem = async(hasil) =>{
  //   try {
  //     let dtInvOut = [];
  //     const db = await dbconn.getDBConnection();
  //     dtInvOut = await dbconn.InvOut_getdata (db, 'InvOut');

  //     let datacheck = await dbconn.queryselectInvOut(db, `select * from InvOut where DOCNUMBR= '${hasil[0].DOCNUMBR}'`);
  //     let noitem = 0;

  //     if (datacheck.length > 0) {
  //       throw new Error("Data sudah ada");
  //     }
  //     else if(dtInvOut.length == 0){
  //       noitem = noitem + 1;
  //     }
  //     else {
  //       let datamax = await dbconn.queryselectInvOut(db, `select * from InvOut order by NO desc;`);
  //       noitem = datamax[0].NO + 1;
  //     }
  //     hasil[0].NO = noitem;

  //     await dbconn.InvOut_savedata(db, 'InvOut', hasil);
  //     dtInvOut = await dbconn.InvOut_getdata(db, 'InvOut');

  //     console.info('datainvout: ', dtInvOut);
  //     setList(dtInvOut);
  //   } catch (error) {
  //     let msg = 'Servers is not available.';
  //     msg = error.message;
  //     CallModalInfo(msg);
  //   }
  //   finally {
  //     await delaynew(1000);
  //     setLoad(false);
  //   }
  // };

  // const validInformationOk = async visible => {
  //   console.log('masuk1: ');
  //   //onRefresh();
  //   setModalVisible(visible);
  //   if (visible == false && reload == true) {
  //     console.log('masuk2: ');
  //     //useState().length = 0;
  //     // window.location.reload(true);
  //     //navigation.navigate('InvOut');
  //   }
  // };

  // const CallModalInfoPost = async info => {
  //   // console.info('hasil message : ',info);
  //   setLoad(false);
  //   setInformation(info);
  //   setModalVisible(true);
  // };

  // const CallModalInfo = async info => {
  //   // console.info('hasil message : ',info);
  //   setLoad(false);
  //   setInformation(info);
  //   setModalVisible(true);
  // };

  // function emptyStr(str) {
  //   return !str || !/[^\s]+/.test(str);
  // }

  //const delaynew = ms => new Promise(res => setTimeout(res, ms));

  //#endregion

  //#region //* EVENT

  // const viewConfirmPost = async () => {
  //   setMdlConfirm(true);
  // };

  const viewModalVariant = async () => {
    setMdlVariant(true);
  };

  // const handleLogout = async () => {
  //   // StopAll();
  //   navigation.replace('Login');
  // };

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  // const viewBpbLookup = async () => {
  //   GetNomorBpb();
  // };

  //   function selectedBPB(nilai) {
  //     try {
  //       setMdlBPB(false);
  //       setDOCNUMBR(nilai);
  //       GetItemListOut(nilai);
  //     } catch (error) {
  //       CallModalInfo(error);
  //     }
  //   }
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
              <View style={{margin: 35, marginBottom: 0}}>
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
                  marginTop: '20%',
                }}>
                <TouchableOpacity
                  style={[globalStyles.buttonNo]}
                  onPress={() => setMdlConfirmCust(!mdlConfirmCust)}>
                  <Text style={globalStyles.textNo}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.buttonYes]}
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
              <ScrollView style={globalStyles.InputVariant}>
                {/* //* VARIANT*/}
                <SafeAreaView style={[invrecStyles.inputantotalan]}>
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
                      //placeholderTextColor={colors.text}
                      //secureTextEntry={seePassword}
                      //value={password}
                      //onChangeText={text => setPassword(text)}
                    />
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputanqty]}>
                  <TouchableOpacity style={[globalStyles.buttonQTYMinus]}>
                    <Text style={globalStyles.textNo}> - </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[
                      globalStyles.textinputqty,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}
                    maxLength={100}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={[globalStyles.buttonQTYPlus]}>
                    <Text style={globalStyles.textNo}> + </Text>
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
            <View style={globalStyles.modalViewPayment}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Invoice</Text>
              </View>
              <Text style={globalStyles.TextHeaderBills}>Tipe Transaksi</Text>
              <ScrollView style={globalStyles.InputBills}>
                {/* //* BILLS*/}
                <SafeAreaView style={[invrecStyles.inputantotalanbills]}>
                  <View style={globalStyles.labelinputtotalanbills}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Baju Timnas
                    </Text>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      X3
                    </Text>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      S, M, L, XL
                    </Text>
                  </View>
                  <View style={globalStyles.inputtotalanbills}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Rp 25.000.000
                    </Text>
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputantotalanbills]}>
                  <View style={globalStyles.labelinputtotalanbills}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Baju Timnas
                    </Text>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      X3
                    </Text>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      S, M, L, XL
                    </Text>
                  </View>
                  <View style={globalStyles.inputtotalanbills}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Rp 25.000.000
                    </Text>
                  </View>
                </SafeAreaView>
                {/* //* BILLS*/}
              </ScrollView>
              <ScrollView style={globalStyles.InputBills2}>
                <Text style={globalStyles.TextHeaderBills2}>Discounts</Text>
                <SafeAreaView style={[invrecStyles.inputantotalanbills]}>
                  <View style={globalStyles.labelinputtotalanbillsdisc}>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Discounts A 20%
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
                    <Text style={globalStyles.textStyle}>Add Item</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL BILLS */}

        {/* //* LOADER */}
        {/* <Modal animationType="fade" transparent={true} visible={isLoad}>
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalLoad}>
            <Image
              //source={loadingartha}
              style={globalStyles.imageloader}
              imageStyle={{opacity: 0.5}}></Image>
            <Text style={[globalStyles.textloader, {color: colors.text}]}>
              Loading...
            </Text>
          </View>
        </View>
      </Modal> */}
        {/* //* LOADER */}
        {/* //* LOOKUP BPB */}
        {/* <Modal animationType="fade" transparent={true} visible={mdlBPB}>
        <View style={globalStyles.LookupcenteredView}>
          <View style={globalStyles.LookupmodalView}>
            <View style={globalStyles.Lookupmodalheader}>
              <TouchableOpacity
                style={invrecStyles.bannerpanahback}
                onPress={() => setMdlBPB(!mdlBPB)}>
                <Icon name={'arrow-left'} size={20} color="#FFFFFF" />
                <Text style={invrecStyles.bannermenutext}>No. BPB </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                margin: 5,
                zIndex: 1,
                height: '100%',
              }}>
              <DropDownPicker
                style={{elevation: 5, zIndex: 1}}
                textStyle={{fontWeight: '600', fontSize: 15}}
                showTickIcon={true}
                listMode="SCROLLVIEW"
                scrollViewProps={{nestedScrollEnabled: true}}
                closeOnBackPressed={true}
                closeAfterSelecting={true}
                // itemSeparator={true}
                searchable={true}
                searchPlaceholder="Cari..."
                // searchable={true}
                // mode="BADGE"
                // badgeColors={['blue','green','orange']}
                placeholder="Pilih Nomor BPB"
                selectedValue={itembpb}
                open={openbpb}
                value={nomorbpb}
                items={itembpb}
                setOpen={setOpenBpb}
                setValue={setNomorBpb}
                setItems={setItemBpb}
                onSelectItem={item => {
                  selectedBPB(item.value);
                }}
                // onSelectItem={(item) => {console.info('nilaidata: '+item.value)}}
                // onChangeValue={(value) => {console.info('info nilai'+value)}}
              />
            </View>
          </View>
        </View>
      </Modal> */}
        {/* //* LOOKUP BPB */}
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
            <Text style={invrecStyles.bannermenutext}>Menu</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={invrecStyles.bannerinvoice}
            //onPress={handleBackButtonClick}
          >
            <Icon name={'file-invoice'} size={20} color="#FFFFFF" />
          </TouchableOpacity> */}
        </SafeAreaView>
        {/* //* BANNER */}

        {/* //* CONTENT */}
        <ScrollView style={{padding: 15}}>
          <SafeAreaView style={invrecStyles.form}>
            <View style={invrecStyles.menuitemfull}>
              {/* <TextInput
              editable={false}
              style={[
                invrecStyles.textinputlookup,
                {backgroundColor: colors.card, color: colors.text},
              ]}
              maxLength={100}
              placeholder={'All Items'}
              placeholderTextColor={colors.text}
              //value={nomorbpb}
              // onChangeText={text => setEmail(text)}
            /> */}
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
                searchPlaceholder="All Items"
                //mode="BADGE"
                //badgeColors={['blue', 'green', 'orange']}
                placeholder="All Items"
                items={[
                  {label: 'Item 1', value: 'item1'},
                  {label: 'Item 2', value: 'item2'},
                ]}
                onChangeItem={item => console.log(item.label, item.value)}
              />
              {/* <TouchableOpacity
              style={[invrecStyles.iconlookup, {backgroundColor: colors.card}]}>
              <Icon name={'search'} size={20} color="#bdbdbd" />
            </TouchableOpacity> */}
            </View>
          </SafeAreaView>
          <ScrollView nestedScrollEnabled={true}>
            <View
              style={{
                marginVertical: 10,
                marginHorizontal: 0,
              }}>
              {/* //! MENU ITEM */}
              <View
                style={{flex: 3, flexDirection: 'row', marginHorizontal: 2}}>
                <TouchableOpacity
                  style={globalStyles.menubuttonitemnew}
                  onPress={viewModalVariant}>
                  <Icon name={'tshirt'} size={50} color="#0096FF" />
                  <Text style={globalStyles.menubuttontextnew}>
                    Baju Timnas
                  </Text>
                </TouchableOpacity>
              </View>
              {/* //! MENU ITEM */}
              {/* {list.map((item, index) => {
              return (
                <View key={index} style={{marginBottom: 20}}>
                  <View>
                    <SafeAreaView style={invrecStyles.form}>
                      <View
                        style={[
                          //invrecStyles.menuitem,
                          {paddingRight: 5},
                        ]}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          {item.NO}
                        </Text>
                      </View>
                    </SafeAreaView>
                    <SafeAreaView style={invrecStyles.form}>
                      <View
                        style={[invrecStyles.menuitemout, {paddingRight: 5}]}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          Deskripsi Barang
                        </Text>
                      </View>
                      <View style={invrecStyles.menuitemout}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          No.Barang
                        </Text>
                      </View>
                    </SafeAreaView>
                    <SafeAreaView style={invrecStyles.form}>
                      <View
                        style={[invrecStyles.menuitemout, {paddingRight: 5}]}>
                        <TextInput
                          editable={false}
                          style={[
                            invrecStyles.textinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}
                          maxLength={100}
                          placeholder={''}
                          placeholderTextColor={colors.text}
                          value={item.ITEMNMBR}
                          // onChangeText={text => setEmail(text)}
                        />
                      </View>
                      <View style={invrecStyles.menuitemout}>
                        <TextInput
                          editable={false}
                          style={[
                            invrecStyles.textinputlookup,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                              fontSize: 11,
                            },
                          ]}
                          maxLength={100}
                          placeholder={''}
                          placeholderTextColor={colors.text}
                          value={item.ITEMDESC}
                          // onChangeText={text => setEmail(text)}
                        />
                      </View>
                    </SafeAreaView>
                    <SafeAreaView style={invrecStyles.form}>
                      <View
                        style={[invrecStyles.menuitemout, {paddingRight: 5}]}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          Site ID
                        </Text>
                      </View>
                      <View style={invrecStyles.menuitemout}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          Bin
                        </Text>
                      </View>
                    </SafeAreaView>
                    <SafeAreaView style={invrecStyles.form}>
                      <View
                        style={[invrecStyles.menuitemout, {paddingRight: 5}]}>
                        <TextInput
                          editable={false}
                          style={[
                            invrecStyles.textinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}
                          maxLength={100}
                          placeholder={''}
                          placeholderTextColor={colors.text}
                          value={item.SITEID}
                          // onChangeText={text => setEmail(text)}
                        />
                      </View>
                      <View style={invrecStyles.menuitemout}>
                        <TextInput
                          editable={false}
                          style={[
                            invrecStyles.textinputlookup,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                              fontSize: 11,
                            },
                          ]}
                          maxLength={100}
                          placeholder={''}
                          placeholderTextColor={colors.text}
                          value={item.BIN}
                          // onChangeText={text => setEmail(text)}
                        />
                      </View>
                    </SafeAreaView>
                    <SafeAreaView style={invrecStyles.form}>
                      <View
                        style={[invrecStyles.menuitemout, {paddingRight: 5}]}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          Uofm
                        </Text>
                      </View>
                      <View style={invrecStyles.menuitemout}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          QTY
                        </Text>
                      </View>
                    </SafeAreaView>
                    <SafeAreaView style={invrecStyles.form}>
                      <View
                        style={[invrecStyles.menuitemout, {paddingRight: 5}]}>
                        <TextInput
                          editable={false}
                          style={[
                            invrecStyles.textinput,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}
                          maxLength={100}
                          placeholder={''}
                          placeholderTextColor={colors.text}
                          value={item.UOFM}
                          // onChangeText={text => setEmail(text)}
                        />
                      </View>
                      <View style={invrecStyles.menuitemout}>
                        <TextInput
                          editable={false}
                          style={[
                            invrecStyles.textinputlookup,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                              fontSize: 11,
                            },
                          ]}
                          maxLength={100}
                          placeholder={''}
                          placeholderTextColor={colors.text}
                          value={item.QUANTITY.toString()}
                          // onChangeText={text => setEmail(text)}
                        />
                      </View>
                    </SafeAreaView>
                    {item.FLAG == 1 ? (
                      <TouchableOpacity
                        style={[globalStyles.buttonSubmitFlag]}
                        onPress={() => UpdateDataList(item.NO, item.FLAG)}>
                        <Text style={globalStyles.textFlag}>Ok</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[globalStyles.buttonSubmit]}
                        onPress={() => UpdateDataList(item.NO, item.FLAG)}>
                        <Text style={globalStyles.text}>Ok</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })} */}
            </View>
          </ScrollView>
          {/* <View style={[invrecStyles.form, {marginTop: 0, paddingTop: 0}]}>
          <View style={[invrecStyles.menuitemsubmit2, {paddingRight: 5}]}>
            {nomorbpb == '' || list.length <= 0 ? (
              <TouchableOpacity
                style={globalStyles.buttonSubmitDisable}
                disabled>
                <Text style={globalStyles.text}>Kirim</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={globalStyles.buttonSubmit}
                onPress={viewConfirmPost}>
                <Text style={globalStyles.text}>Kirim</Text>
              </TouchableOpacity>
            )}
          </View>
        </View> */}
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
    </ScrollView>
  );
}
