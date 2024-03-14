import React, {useState, useEffect, useRef, useCallback} from 'react';
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
import {MaskedTextInput} from 'react-native-masked-text';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../screens/HeaderButton';
import {getrunnobatch} from '../api/getrunnobatch';
import {openshift} from '../api/openshift';
import {getBrand} from 'react-native-device-info';
import {getsalestype} from '../api/getsalestype';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [mdlOpenShift, setOpenShift] = useState(false);

  const [fullname, setFULLNAME] = useState();
  const [userid, setUSERID] = useState();
  const [guid, setGUID] = useState();
  const [username, setUsername] = useState();
  const [interid, setINTERID] = useState();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [runno, setRunno] = useState('');
  const [openamount, setOpenAmount] = useState('');
  const [lastSeenDate, setLastSeenDate] = useState(null);
  const [salesType, setSalesType] = useState([]);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [boundAddress, setBoundAddress] = useState('');

  //#endregion

  useEffect(() => {
    const storedDate = AsyncStorage.getItem('lastSeenDate'); // Load from AsyncStorage
    storedDate
      .then(date => {
        setLastSeenDate(new Date(date)); // Convert to Date object
      })
      .catch(error => {
        console.error('Error retrieving last seen date:', error);
      });
  }, []);

  useEffect(() => {
    const today = new Date();
    if (lastSeenDate === null || lastSeenDate.getDate() !== today.getDate()) {
      // Modal shows up if it's a new day
      setOpenShift(true);
      GetRunno();
      AsyncStorage.setItem('lastSeenDate', today.toString()); // Save current date
      setLastSeenDate(today);
    }
    GetSalesType();
    GetUserData();
    //setMdlPrinter(true);
    if (route.params?.showModal) {
      setMdlConfirm(true);
    }
    //setIsSidebarOpen(false);
    setIsSidebarOpen(!isSidebarOpen);
    BackHandler.addEventListener('hardwareBackPress', viewConfirmLogout);
    return () => {
      clearInterval(increment.current);
      //backHandler.remove();
      BackHandler.removeEventListener('hardwareBackPress', viewConfirmLogout);
    };
  }, [
    route.params,
    boundAddress,
    deviceAlreadPaired,
    deviceFoundEvent,
    pairedDevices,
    scan,
  ]);

  //#region //* FUNCTION

  const CallModalInfo = async info => {
    // console.info('hasil message : ',info);
    setLoad(false);
    setInformation(info);
    setModalVisible(true);
  };

  const GetSalesType = async () => {
    try {
      setSalesType([]);
      getsalestype({
        interid: '',
        ID: '',
      }).then(async result => {
        var hasil = result.data;
        console.log('return sales type: ', hasil);
        setSalesType(hasil);
      });
    } catch (error) {
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const PostOpenShift = async openamount => {
    console.log('nilai Amount_Opening', openamount);
    openshift({
      Batch_ID: runno,
      Lineitmseq: 0,
      Payment_ID: '',
      Payment_Type: '',
      Amount_Opening: openamount,
      UserID: '',
    }).then(async result => {
      var hasil = result.data;
      console.log('hasil get variant: ', hasil);
      setOpenShift(false);
    });
  };

  function emptyStr(str) {
    return !str || !/[^\s]+/.test(str);
  }

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connect = row => {
    setLoading(true);
    BluetoothManager.connect(row.address).then(
      s => {
        setLoading(false);
        setBoundAddress(row.address);
        setName(row.name || 'UNKNOWN');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
          message:
            'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const delaynew = ms => new Promise(res => setTimeout(res, ms));

  //#endregion

  //#region //* EVENT

  const viewConfirmLogout = async () => {
    setMdlConfirm(true);
  };

  const viewConfirmSync = async () => {
    navigation.replace('printBluetooth');
  };

  const ViewHidePrinter = async () => {
    setMdlPrinter(false);
  };

  const handleLogout = async () => {
    // StopAll();
    navigation.replace('Login');
  };

  const GetRunno = async () => {
    getrunnobatch({
      DOCID: 'BATC',
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

  const GetUserData = () => {
    try {
      setLoad(true);
      var dataall = route.params.dataparams;
      // console.info('datauser: ',JSON.stringify(dataall));
      var param_userid = dataall.userid;
      setUSERID(param_userid);
      var param_interid = dataall.interid;
      setINTERID(param_interid);
      var param_username = dataall.username;
      setUsername(param_username);
    } catch (err) {
      console.log(err);
      setLoad(false);
    }

    delaynew(500);
    setLoad(false);
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
  const handleWalkInandOnline = async (tipesales, salesid) => {
    try {
      console.log('tipesales: ', tipesales);
      var datasalestipe = [];
      var dataparams = {
        tipesales: tipesales,
        salesid: salesid,
      };
      datasalestipe.push(dataparams);
      console.log('isi dataparams: ', dataparams);

      AsyncStorage.setItem('@datasalestype', JSON.stringify(datasalestipe));
      navigation.navigate('Menu', {
        datasalestipe,
      });
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

      {/* //* OPEN SHIFT */}
      <Modal animationType="fade" transparent={true} visible={mdlOpenShift}>
        <View style={globalStyles.centeredViewCust}>
          <View style={globalStyles.modalViewCust}>
            <View style={globalStyles.modalheader}>
              <Text style={globalStyles.modalText}>Open Shift</Text>
            </View>
            <View style={{margin: 0, marginBottom: 0}}>
              <TextInput
                style={[
                  globalStyles.textinputcustomer,
                  {backgroundColor: colors.card, color: colors.text},
                ]}
                maxLength={100}
                keyboardType="numeric"
                value={openamount.toLocaleString()}
                onChangeText={text => {
                  const cleanedValue = text.replace(/[^0-9]/g, '');
                  const numericValue = parseFloat(cleanedValue);
                  if (!isNaN(numericValue)) {
                    // Update the state with the formatted value
                    setOpenAmount(numericValue.toLocaleString());
                  } else {
                    // Handle invalid input, for example, setting an empty string
                    setOpenAmount('');
                  }
                }}
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
                onPress={() => setOpenShift(!setOpenShift)}>
                <Text style={globalStyles.textNo}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.buttonYes]}
                onPress={() => PostOpenShift(openamount)}>
                <Text style={globalStyles.textStyle}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* OPEN SHIFT */}

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

      <StatusBar
        backgroundColor={'#0096FF'}
        barStyle="light-content"></StatusBar>

      {/* //* BANNER */}
      <SafeAreaView style={globalStyles.bannerhome}>
        {/* <HeaderButtons style={{position: 'absolute', left: 10}}> */}
        <View style={{backgroundColor: '#0096FF'}}>
          <HeaderButtons
            style={{backgroundColor: '#0096FF'}}
            HeaderButtonComponent={HeaderButton}>
            <Item iconName="ios-menu" onPress={openSidebar} />
          </HeaderButtons>
        </View>
        <Text style={globalStyles.bannertext}>POS</Text>
        <View style={{position: 'absolute', right: 10}}>
          <TouchableOpacity onPress={viewConfirmSync}>
            <Icon name={'sync'} size={25} color="#0096FF"></Icon>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* //* BANNER */}

      {/* //* CONTENT */}
      <SafeAreaView style={globalStyles.viewmenu}>
        <View style={globalStyles.title1view}>
          <TouchableOpacity
            style={{position: 'absolute', right: 0}}
            onPress={viewConfirmLogout}>
            <Text style={globalStyles.title1text2}>Keluar</Text>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={globalStyles.menuviewhome}></SafeAreaView>
      </SafeAreaView>
      {/* //* CONTENT */}
      <SafeAreaView style={globalStyles.menuviewhome2}>
        {salesType.map((salesType, index) => {
          return (
            <View
              key={index}
              style={{
                flex: 2,
                flexDirection: 'column',
                flexBasis: '20%',
              }}>
              <TouchableOpacity
                style={globalStyles.menubuttonitembottom}
                onPress={() =>
                  handleWalkInandOnline(
                    salesType.salesType_Name,
                    salesType.salesType_ID,
                  )
                }>
                <Icon name={'store'} size={40} color="#0096FF" />
                <Text style={globalStyles.menubuttontextselected}>
                  {salesType.salesType_Name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </SafeAreaView>
    </SafeAreaView>
  );
};
export default Home;
