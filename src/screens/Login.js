import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  PermissionsAndroid,
  ImageBackground,
  Modal,
  BackHandler,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import {useTheme, useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import {imglogo} from '../images/images';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {user_login} from '../api/loginapi';
import {getstore} from '../api/getstore';
// import {getcompanyapi} from '../api/getcompanyapi';
import {globalStyles, invrecStyles} from '../css/global';

//#region //*DB
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'DBWMS',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);
//#endregion

const Login = () => {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Image source "null" doesn' + '' + 't exist',
  ]);
  useEffect(() => {
    setModalVisible(false);

    //companydata();
    getrememberme();
    GetStore();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  // const testloading = async () => {
  //   setLoad(true);
  //   await delaynew(2000);
  //   setLoad(false);
  // };

  //#region //* VARIABLE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interid, setINTERID] = useState('');
  const [seePassword, setSeePassword] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState([]);
  const [address, setAdress] = useState('');
  const [jmlstore, setJmlStore] = useState([]);
  const [domain, setDomain] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [information, setInformation] = useState('');
  const [isLoad, setLoad] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const colors = useTheme().colors;
  //const route = useRoute();
  const navigation = useNavigation();

  //#endregion

  //#region //*FUNCTION

  function emptyStr(str) {
    return !str || !/[^\s]+/.test(str);
  }

  const getrememberme = async () => {
    try {
      // setLoad(true);

      let remb = await AsyncStorage.getItem('rememberme');
      var flag = emptyStr(remb) ? false : JSON.parse(remb.toLowerCase());
      // console.info('flag-rememberme: '+flag);
      // if(remb == "true")
      if (flag) {
        let datahasil = await AsyncStorage.getItem('datauserrember');
        // console.info('datahasil: '+datahasil);
        if (datahasil) {
          // console.log('test masuk');
          var dataremember = JSON.parse(datahasil);
          // console.log('rember:'+dataremember);
          setEmail(dataremember['username']);
          setPassword(dataremember['password']);
          setToggleCheckBox(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }

    // await delaynew(1000);
    // setLoad(false);
  };

  async function RememberMe() {
    try {
      setLoad(true);
      // console.info('Toggle: '+ toggleCheckBox);
      var datauserremember = {
        username: email.toLocaleLowerCase(),
        password: password,
      };

      // console.info('datauserremember: ', JSON.stringify(datauserremember));

      if (toggleCheckBox == true) {
        //* REMEMBER ME
        // console.info('masuk true');
        AsyncStorage.setItem('rememberme', JSON.stringify(true));
        AsyncStorage.setItem(
          'datauserrember',
          JSON.stringify({...datauserremember}),
        );
      } else {
        // console.info('masuk false');
        AsyncStorage.setItem('rememberme', JSON.stringify(false));
        AsyncStorage.setItem('datauserrember', JSON.stringify(null));
      }
    } catch (err) {
      console.log(err.message);
    }

    await delaynew(1000);
    setLoad(false);
  }

  const companydata = async () => {
    setLoad(true);
    getcompanyapi({})
      .then(result => {
        var interidall;
        console.log('data: ', result.data.LoginResults);
        if (result.status == 200) {
          var hasil = result.data.LoginResults;
          var len = hasil.length;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              var data = hasil[i];
              var INTERID = data.INTERID.trim();
            }
            interidall = INTERID;
            console.info(interidall);
          }
        }
        setINTERID(interidall);
      })
      .catch(err => {
        console.log(err);
        let msg = 'Servers is not available.';
        msg = err.message;
        CallModalInfo(msg);
      });

    await delaynew(500);
    setLoad(false);
  };

  const CallModalInfo = async info => {
    setLoad(false);
    setInformation(info);
    setModalVisible(true);
    // Alert.alert("Information", info);
  };

  //#endregion

  //#region //* EVENT

  function handleBackButtonClick() {
    BackHandler.exitApp();
    return true;
  }

  const handleLoginTemp = () => {
    // StopAll();
    navigation.navigate('Home');
    setIsLoggedIn(true);
  };

  const handleTest = async () => {
    //#region //*for testing*/
    await delaynew(1500);
    setLoad(false);
    setEmail('');
    setPassword('');
    setToggleCheckBox(false);
    var dataparams = {
      username: email,
      userid: email,
      fullname: 'Teguh Karyadi',
      guid: '12345678',
      interid: 'BIR',
    };

    navigation.navigate('Home', {
      dataparams,
    });
    //#endregion
  };

  const handleLogin = async () => {
    setLoad(true);
    // /*
    user_login({
      EmailAddress: email,
      PASSWORD: password,
    })
      .then(async result => {
        var datauserall = [];
        console.log('result:' + JSON.stringify(result));
        if (result.status == 200) {
          console.log('data:', result.data);
          var hasil = result.data;
          console.info('hasil:', JSON.stringify(hasil));
          var len = hasil.length;
          if (len > 0) {
            //let username = email;
            let datauserlogin = hasil;
            let userid = datauserlogin[0].userID.toString();
            let emailAddress = datauserlogin[0].emailAddress.toString();
            let business_Name = datauserlogin[0].business_Name.toString();
            let country = datauserlogin[0].country.toString();

            var dataparams = {
              username: emailAddress,
              userid: userid,
              fullname: business_Name,
              country: country,
              store_ID: store,
            };
            datauserall.push(dataparams);

            AsyncStorage.setItem('@datajson', JSON.stringify(hasil));
            AsyncStorage.setItem('@dtUser', JSON.stringify(datauserall));

            RememberMe();

            await delaynew(500);
            setLoad(false);
            setEmail('');
            setPassword('');
            setToggleCheckBox(false);
            console.log('isi dataparams: ', dataparams);
            navigation.navigate('Home', {
              dataparams,
            });
          } else {
            throw new Error('No User');
          }
        }
      })
      .catch(err => {
        console.log(err);
        let msg = 'Servers is not available.';
        msg = err.message;
        CallModalInfo(msg);
      });
    // */
  };

  const GetStore = async () => {
    setStore([]);
    getstore({
      interid: '',
      ID: '',
    })
      .then(async result => {
        const results = [];
        var store;
        var hasil = result.data;
        console.log('HASIL GET STORE: ', hasil);
        if (hasil.length > 0) {
          for (let i = 0; i < hasil.length; i++) {
            let data = hasil[i];
            let value = data.store_ID;
            let alamat = data.address;
            if (i == 0) {
              store = value;
              alamat = alamat;
            }
            var joined = {
              label: data.store_Name,
              alamat: data.address,
              value: value,
            };
            results.push(joined);
          }
        }
        setStore(results);
        setAdress(results);
        setJmlStore(results.length);

        if (results.length > 0) {
          setDomain(store);
        }
        console.log('alamat toko: ', address);
        console.log('HASIL SET STORE: ', store);
      })
      .catch(async err => {
        console.log('respon: ' + err.message);
        let msg = 'Servers is not available.';
        msg = err.message;
      });
  };

  const delaynew = ms => new Promise(res => setTimeout(res, ms));

  //#endregion
  //const flexD = 'column';
  return (
    <SafeAreaView style={globalStyles.halamanfulllogin}>
      <View style={globalStyles.cartlist}>
        <View style={globalStyles.kirilogin}>
          <View style={globalStyles.logincontent}>
            <ScrollView
              style={{flex: 1, width: '100%', height: '100%', padding: 0}}>
              <SafeAreaView style={{flex: 1, width: '50%', height: '100%'}}>
                {/* //* INFORMATION */}
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}>
                  <View style={globalStyles.centeredView}>
                    <View style={globalStyles.modalView}>
                      <View style={globalStyles.modalheader}>
                        <Text style={globalStyles.modalText}>Information</Text>
                      </View>
                      <View style={{margin: 20, marginBottom: 0}}>
                        <Text style={globalStyles.textinformation}>
                          {information}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[globalStyles.button, globalStyles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={globalStyles.textStyle}>Ok</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                {/* //* INFORMATION */}
                <StatusBar
                  backgroundColor={'#0096FF'}
                  barStyle="dark-content"></StatusBar>
                {/* //! LOGO */}
                <View style={globalStyles.logoview}>
                  {/* <Image source={logoartha3} style={globalStyles.logoimage}
             /> */}
                  <Text style={[globalStyles.logotext, {color: colors.text}]}>
                    Point Of Sale
                  </Text>
                </View>
                <View style={globalStyles.logoview2}>
                  {/* <Image source={logoartha3} style={globalStyles.logoimage}
             /> */}
                  <Text style={[globalStyles.logotext, {color: colors.text}]}>
                    Login
                  </Text>
                </View>
                {/* //! LOGO */}

                {/* //! EMAIL/USERID */}
                <View style={globalStyles.viewinput}>
                  <View
                    style={[
                      globalStyles.iconinput,
                      {backgroundColor: colors.card},
                    ]}>
                    <Icon name={'user'} size={20} color="#0096FF" />
                  </View>
                  <TextInput
                    style={[
                      globalStyles.textinput,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}
                    maxLength={100}
                    placeholder={'Masukkan User ID'}
                    placeholderTextColor={colors.text}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    isPassword={false}
                  />
                </View>
                {/* //! EMAIL/USERID */}

                {/* //! PASSWORD */}
                <View style={globalStyles.viewinput}>
                  <View
                    style={[
                      globalStyles.iconinput,
                      {backgroundColor: colors.card},
                    ]}>
                    <Icon name={'lock'} size={20} color="#0096FF" />
                  </View>
                  <TextInput
                    style={[
                      globalStyles.textinput,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}
                    maxLength={100}
                    placeholder={'Masukkan Kata Sandi'}
                    placeholderTextColor={colors.text}
                    secureTextEntry={seePassword}
                    value={password}
                    onChangeText={text => setPassword(text)}
                  />
                  <TouchableOpacity
                    style={globalStyles.wrapperIcon}
                    onPress={() => setSeePassword(!seePassword)}>
                    <Icon
                      name={seePassword ? 'eye' : 'eye-slash'}
                      size={25}
                      color="#0096FF"
                      style={{marginRight: 8}}
                    />
                  </TouchableOpacity>
                </View>
                {/* //! PASSWORD */}
                <DropDownPicker
                  style={{
                    elevation: 5,
                    zIndex: 1,
                    marginRight: 0,
                    marginTop: 5,
                    width: '105%',
                  }}
                  textStyle={{fontWeight: '600', fontSize: 15}}
                  showTickIcon={true}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                    decelerationRate: 'fast',
                  }}
                  closeOnBackPressed={true}
                  closeAfterSelecting={true}
                  searchable={true}
                  items={store}
                  setOpen={setOpen}
                  value={domain}
                  setValue={setDomain}
                  setItems={setStore}
                  onSelectItem={item => {
                    selectedCat(item.value);
                    console.log('nilai cat:' + item.value);
                  }}
                  dropDownStyle={{maxHeight: 500, backgroundColor: 'white'}}
                />

                {/* //? REMEMBER ME */}
                <View style={globalStyles.viewinput}>
                  <CheckBox
                    tintColors={{true: '#0096FF', false: 'black'}}
                    value={toggleCheckBox}
                    onValueChange={newValue => setToggleCheckBox(newValue)}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setToggleCheckBox(!toggleCheckBox);
                    }}>
                    <Text
                      style={[globalStyles.textremember, {color: colors.text}]}>
                      Remember Me
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* //? REMEMBER ME */}

                {/* //* BUTTON LOGIN */}
                <View style={globalStyles.viewbutton}>
                  <TouchableOpacity
                    style={globalStyles.buttonLogin}
                    onPress={handleLogin}
                    //onPress={handhandleTest}
                  >
                    <Text style={globalStyles.text}>Login</Text>
                  </TouchableOpacity>
                  {/* {email == '' || password == '' || isLoad == true ? (
              <TouchableOpacity
                disabled
                style={globalStyles.buttonDisable}
                //onPress={handleLogin}
              >
                <Text style={globalStyles.text}>Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={globalStyles.buttonLogin}
                //onPress={handleLogin}
                // onPress={handleTest}
              >
                <Text style={globalStyles.text}>Login</Text>
              </TouchableOpacity>
            )} */}
                </View>
                {/* //* BUTTON LOGIN */}

                {/* //* NOT USE */}
                <View
                  style={{
                    marginHorizontal: 25,
                    flexDirection: 'row',
                    marginTop: 10,
                    display: 'none',
                  }}>
                  {/* <TouchableOpacity style={{flex: 1}}>
           <Text style={{fontWeight: 'bold'}}>Signup</Text>
            </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={{fontWeight: 'bold'}}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                {/* //* NOT USE */}
              </SafeAreaView>
            </ScrollView>
            {/* //* FOOTER */}
            {/* //* FOOTER */}
          </View>
        </View>
        <View style={globalStyles.kananlogin}>
          <Image
            source={imglogo}
            style={{width: '150%', height: '1000%'}}></Image>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
