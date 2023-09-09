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
import {useTheme, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
//import {imgback, logoartha3, loadingartha} from '../images/images';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import {user_login} from '../api/loginapi';
// import {getcompanyapi} from '../api/getcompanyapi';
import {globalStyles} from '../css/global';

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

const Login = ({navigation}) => {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Image source "null" doesnt exist',
  ]);
  useEffect(() => {
    setModalVisible(false);

    //companydata();
    getrememberme();

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

  const [modalVisible, setModalVisible] = useState(false);
  const [information, setInformation] = useState('');
  const [isLoad, setLoad] = useState(false);

  const colors = useTheme().colors;
  const route = useRoute();

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

  const handleLoginTemp = async () => {
    // StopAll();
    navigation.replace('Home');
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
      username: email,
      password: password,
      domainname: '',
    })
      .then(async result => {
        var datauserall = [];
        if (result.status == 200) {
          console.log('data:', result.data.LoginResults);
          var hasil = result.data.LoginResults;
          console.info('hasil:', JSON.stringify(hasil));
          var len = hasil.length;
          if (len > 0) {
            let username = email;
            let datauserlogin = hasil;
            let userid = datauserlogin[0].USERID.toString();
            let fullname = datauserlogin[0].USERNAME.toString();
            let guid = datauserlogin[0].GUID.toString();

            var dataparams = {
              username: username,
              userid: userid,
              fullname: fullname,
              guid: guid,
              interid: interid,
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

  const delaynew = ms => new Promise(res => setTimeout(res, ms));

  //#endregion
  //const flexD = 'column';
  return (
    <SafeAreaView
      style={{flex: 1, flexDirection: 'column', backgroundColor: '#FFFFFF'}}>
      <ImageBackground style={globalStyles.imagebackground}>
        <ScrollView
          style={{flex: 1, width: '100%', height: '100%', padding: 15}}>
          <SafeAreaView style={{flex: 1, width: '100%', height: '100%'}}>
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

            <StatusBar
              backgroundColor={'#FFF'}
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
                <Icon name={'user'} size={20} color="#bdbdbd" />
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
                <Icon name={'lock'} size={20} color="#bdbdbd" />
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
                  color="#021F61"
                  style={{marginRight: 8}}
                />
              </TouchableOpacity>
            </View>
            {/* //! PASSWORD */}

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
                <Text style={[globalStyles.textremember, {color: colors.text}]}>
                  Remember Me
                </Text>
              </TouchableOpacity>
            </View>
            {/* //? REMEMBER ME */}

            {/* //* BUTTON LOGIN */}
            <View style={globalStyles.viewbutton}>
              <TouchableOpacity
                style={globalStyles.buttonLogin}
                onPress={handleLoginTemp}
                // onPress={handleTest}
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
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;
