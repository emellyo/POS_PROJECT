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
} from 'react-native';
import {globalStyles} from '../css/global';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useRoute, useTheme} from '@react-navigation/native';
import * as Utils from '../Helpers/Utils';
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

export default function Home({navigation}) {
  const colors = useTheme().colors;
  const route = useRoute();
  const increment = useRef(null);

  //#region //* VARIABLE

  const [mdlConfirm, setMdlConfirm] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [information, setInformation] = useState('');
  const [isLoad, setLoad] = useState(false);
  const [isInet, setInet] = useState(true);

  const [fullname, setFULLNAME] = useState();
  const [userid, setUSERID] = useState();
  const [guid, setGUID] = useState();
  const [username, setUsername] = useState();
  const [interid, setINTERID] = useState();
  //#endregion

  useEffect(() => {
    setModalVisible(false);
    // LOADTBLINVOUT();
    // LOADTBLINVRCV();
    // LOADTBLSTOCK();
    // GetUserData();

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

  const handleLogout = async () => {
    // StopAll();
    navigation.replace('Login');
  };

  const handleSetting = async () => {
    try {
      navigation.navigate('Setting');
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

  const handleInvOut = async () => {
    try {
      navigation.navigate('InvOut');
    } catch (err) {
      console.log(err);
    }
  };

  const StockCount = async () => {
    try {
      navigation.navigate('StockCount');
    } catch (err) {
      console.log(err);
    }
  };

  //#endregion

  return (
    <SafeAreaView
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#FFFFFF'}}>
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
        <Text style={globalStyles.bannertext}>POS</Text>
        <View style={{position: 'absolute', right: 10}}>
          <TouchableOpacity>
            <Icon name={'sync'} size={25} color="white"></Icon>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* //* BANNER */}

      {/* //* CONTENT */}
      <ScrollView style={globalStyles.viewmenu}>
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
      </ScrollView>
      {/* //* CONTENT */}

      <SafeAreaView style={globalStyles.menuviewhome2}>
        <View style={{flex: 2, flexDirection: 'row', marginHorizontal: 0}}>
          <TouchableOpacity style={globalStyles.menubuttonitembottom}>
            <Icon name={'store'} size={30} color="#0096FF" />
            <Image style={globalStyles.iconmenuwalkin} />
            <Text style={globalStyles.menubuttontextselected}>Walk In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.menubuttonitembottom}
            //onPress={handleSetting}
          >
            <Icon name={'globe'} size={30} color="#0096FF" />
            <Image style={globalStyles.iconmenuonline} />
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
}
