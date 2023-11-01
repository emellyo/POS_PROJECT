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
import {useRoute, useTheme, useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import Sidebar from '../screens/SideBar';
import * as Utils from '../Helpers/Utils';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../screens/HeaderButton';
// import {
//   loadingartha,
//   invenreceiving,
//   invout,
//   stock,
//   wmshomeblue,
//   wmssettingsgry,
// } from '../images/images';
//import AsyncStorage from '@react-native-async-storage/async-storage';

// import * as dbconn from '../db/db';
// import * as dbconn2 from '../db/dbinvout';
// import * as dbconn3 from '../db/dbstock';

const Home = () => {
  const colors = useTheme().colors;
  const route = useRoute();
  const increment = useRef(null);
  const navigation = useNavigation();

  //#region //* VARIABLE

  const [mdlConfirm, setMdlConfirm] = useState(false);
  const [mdlConfirmSync, setMdlConfirmSync] = useState(false);
  const [mdlPrinter, setMdlPrinter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [information, setInformation] = useState('');
  const [isLoad, setLoad] = useState(false);
  const [isInet, setInet] = useState(true);

  const [fullname, setFULLNAME] = useState();
  const [userid, setUSERID] = useState();
  const [guid, setGUID] = useState();
  const [username, setUsername] = useState();
  const [interid, setINTERID] = useState();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //#endregion

  useEffect(() => {
    //setModalVisible(false);
    // LOADTBLINVOUT();
    // LOADTBLINVRCV();
    // LOADTBLSTOCK();
    // GetUserData();
    //setMdlPrinter(true);
    setIsSidebarOpen(!isSidebarOpen);
    BackHandler.addEventListener('hardwareBackPress', viewConfirmLogout);
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener('hardwareBackPress', viewConfirmLogout);
    };
  }, []);

  //#region //* FUNCTION

  //   const LOADTBLINVRCV = async () => {
  //     try {
  //       const db = await dbconn.getDBConnection();
  //       //await dbconn.dropTbl(db, 'InvRcv');
  //       await dbconn.InvRcv_CreateTbl(db, 'InvRcv');
  //       // await dbconn.deletedataAllTbl(db, 'InvRcv');
  //       const storedTbl = await dbconn.InvRcv_getdata(db, 'InvRcv');
  //       if (storedTbl.length) {
  //         console.log('datastored:', storedTbl);
  //       } else {
  //         console.log('no data');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const LOADTBLINVOUT = async () => {
  //     try {
  //       const db = await dbconn2.getDBConnection();
  //       //await dbconn.dropTbl(db, 'InvOut');
  //       await dbconn2.InvOut_CreateTbl(db, 'InvOut');
  //       const storedTbl = await dbconn2.InvOut_getdata(db, 'InvOut');
  //       if (storedTbl.length) {
  //         console.log('datastored: ', storedTbl);
  //       } else {
  //         console.log('no data');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const LOADTBLSTOCK = async () => {
  //     try {
  //       const db = await dbconn3.getDBConnection();
  //       //await dbconn.dropTbl(db, 'ItemStock');
  //       await dbconn3.ItemStock_CreateTbl(db, 'ItemStock');
  //       const storedTbl = await dbconn3.ItemStock_getdata(db, 'ItemStock');
  //       if (storedTbl.length) {
  //         console.log('datastored: ', storedTbl);
  //       } else {
  //         console.log('no data');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const GetUserData = () => {
  //     try {
  //       setLoad(true);
  //       var dataall = route.params.dataparams;
  //       // console.info('datauser: ',JSON.stringify(dataall));
  //       var param_userid = dataall.userid;
  //       setUSERID(param_userid);
  //       var param_interid = dataall.interid;
  //       setINTERID(param_interid);
  //       var param_guid = dataall.guid;
  //       setGUID(param_guid);
  //       var param_username = dataall.username;
  //       setUsername(param_username);
  //       var param_fullname = dataall.fullname;
  //       setFULLNAME(param_fullname);

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

  //     delaynew(500);
  //     setLoad(false);
  //   };

  const CallModalInfo = async info => {
    // console.info('hasil message : ',info);
    setLoad(false);
    setInformation(info);
    setModalVisible(true);
  };

  function emptyStr(str) {
    return !str || !/[^\s]+/.test(str);
  }

  const delaynew = ms => new Promise(res => setTimeout(res, ms));

  //#endregion

  //#region //* EVENT

  const viewConfirmLogout = async () => {
    setMdlConfirm(true);
  };

  const viewConfirmSync = async () => {
    setMdlConfirmSync(true);
  };

  const ViewHidePrinter = async () => {
    setMdlPrinter(false);
  };

  const handleLogout = () => {
    // StopAll();
    navigation.navigate('Login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    //toggleSidebar();
    //navigation.navigate('Sidebar'); // This opens the sidebar (drawer navigator)
    navigation.openDrawer();
    //setSidebarOpen(true);
  };

  const handleSetting = async () => {
    try {
      navigation.navigate('Setting');
    } catch (err) {
      console.log(err);
    }
  };
  const handleWalkInandOnline = async () => {
    try {
      navigation.navigate('Menu');
    } catch (err) {
      console.log(err);
    }
  };

  const handleInvRec = async () => {
    try {
      var dataparams = {
        username: username,
        userid: userid,
        fullname: fullname,
        guid: guid,
        interid: interid,
      };

      navigation.navigate('InvReceiving', {dataparams});
    } catch (err) {
      console.log(err);
    }
  };

  //#endregion

  return (
    <SafeAreaView
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#FFFFFF'}}>
      <Sidebar />
      {/* //* INFORMATION */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <View style={globalStyles.modalheader}>
              <Text style={globalStyles.modalText}>Information</Text>
            </View>
            <View style={{margin: 20, marginBottom: 0}}>
              {information == '' ? (
                <Text style={{color: '#212121', fontSize: 16}}>
                  Not available new module
                </Text>
              ) : (
                <Text style={{color: 'red', fontSize: 16}}>
                  {information == '' ? 'Not available new module' : information}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={globalStyles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* //* CONFIRM LOGOUT */}
      <Modal animationType="fade" transparent={true} visible={mdlConfirm}>
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <View style={globalStyles.modalheader}>
              <Text style={globalStyles.modalText}>Confirmation</Text>
            </View>
            <View style={{margin: 20, marginBottom: 0}}>
              <Text style={{color: '#212121', fontSize: 16}}>
                Are you sure back to Login Page?
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 0}}>
              <TouchableOpacity
                style={[globalStyles.buttonNo]}
                onPress={() => setMdlConfirm(!mdlConfirm)}>
                <Text style={globalStyles.textNo}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.buttonYes]}
                onPress={handleLogout}>
                <Text style={globalStyles.textStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* CONFIRM LOGOUT */}

      {/* //* MODAL SYNC DATA */}
      <Modal animationType="fade" transparent={true} visible={mdlConfirmSync}>
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <View style={globalStyles.modalheader}>
              <Text style={globalStyles.modalText}>Sync Data</Text>
            </View>
            <View style={{margin: 20, marginBottom: 0}}>
              <Text style={{color: '#212121', fontSize: 16}}>
                Are you sure want to sync?
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 0}}>
              <TouchableOpacity
                style={[globalStyles.buttonNo]}
                onPress={() => setMdlConfirmSync(!mdlConfirmSync)}>
                <Text style={globalStyles.textNo}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.buttonYes]}
                //onPress={handleLogout}
              >
                <Text style={globalStyles.textStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* MODAL SYNC DATA */}

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
                  //placeholder={'Masukkan Kata Sandi'}
                  //placeholderTextColor={colors.text}
                  //secureTextEntry={seePassword}
                  //value={password}
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
                marginTop: '20%',
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

      {/* //* LOADER */}
      {/* <Modal animationType="fade" transparent={true} visible={isLoad}>
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalLoad}>
            <Image
              source={loadingartha}
              style={globalStyles.imageloader}
              imageStyle={{opacity: 0.5}}></Image>
            <Text style={[globalStyles.textloader, {color: colors.text}]}>
              Loading...
            </Text>
          </View>
        </View>
      </Modal> */}
      {/* //* LOADER */}

      <StatusBar
        backgroundColor={'#0096FF'}
        barStyle="light-content"></StatusBar>

      {/* //* BANNER */}
      <SafeAreaView style={globalStyles.bannerhome}>
        {/* <HeaderButtons style={{position: 'absolute', left: 10}}> */}
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          {/* <TouchableOpacity onPress={openSidebar}> */}
          {/* This is the icon trigger for the sidebar */}
          {/* <Icon name={'bars'} size={25} color="white"></Icon>
          </TouchableOpacity> */}
          {/* {isSidebarOpen && (
            <View>
              <TouchableOpacity onPress={openSidebar}></TouchableOpacity>
            </View>
          )} */}
          <Item iconName="ios-menu" onPress={openSidebar} />
        </HeaderButtons>
        <Text style={globalStyles.bannertext}>POS</Text>
        <View style={{position: 'absolute', right: 10}}>
          <TouchableOpacity onPress={viewConfirmSync}>
            <Icon name={'sync'} size={25} color="white"></Icon>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* //* BANNER */}

      {/* //* CONTENT */}
      <SafeAreaView style={globalStyles.viewmenu}>
        <View style={globalStyles.title1view}>
          <Text style={globalStyles.title1text}>
            Selamat Datang, <Text style={{fontWeight: 'bold'}}>{fullname}</Text>
          </Text>
          <TouchableOpacity
            style={{position: 'absolute', right: 0}}
            onPress={viewConfirmLogout}>
            <Text style={globalStyles.title1text2}>Keluar</Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={globalStyles.menuviewhome}>
          <Text style={globalStyles.menutitletexthome}>Sales Type</Text>
        </SafeAreaView>
        {/* //! MENU ITEM */}
        {/* <View style={{flex: 3, flexDirection: 'row', marginHorizontal: 2}}>
            <TouchableOpacity
              style={globalStyles.menubuttonitemnew}
              onPress={handleInvRec}>
              <Image style={globalStyles.iconmenu} />
              <Text style={globalStyles.menubuttontextnew}>
                Inventory Receiving
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.menubuttonitemnew}
              //onPress={handleInvOut}
            >
              <Image style={globalStyles.iconmenu} />
              <Text style={globalStyles.menubuttontextnew}>Inventory Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.menubuttonitemnew}
              //onPress={StockCount}
            >
              <Image style={globalStyles.iconmenu} />
              <Text style={globalStyles.menubuttontextnew}>Stock Opname</Text>
            </TouchableOpacity>
          </View> */}
        {/* //! MENU ITEM */}
      </SafeAreaView>
      {/* //* CONTENT */}
      <SafeAreaView style={globalStyles.menuviewhome2}>
        <View style={{flex: 2, flexDirection: 'row', marginHorizontal: 0}}>
          <TouchableOpacity
            style={globalStyles.menubuttonitembottom}
            onPress={handleWalkInandOnline}>
            <Icon name={'store'} size={30} color="#0096FF" />
            {/* <Image style={globalStyles.iconmenuwalkin} /> */}
            <Text style={globalStyles.menubuttontextselected}>Walk In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.menubuttonitembottom}
            onPress={handleWalkInandOnline}>
            <Icon name={'globe'} size={30} color="#0096FF" />
            {/* <Image style={globalStyles.iconmenuonline} /> */}
            <Text style={globalStyles.menubuttontextonline}>Online</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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
};
export default Home;
