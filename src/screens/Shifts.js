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
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {globalStyles, invrecStyles} from '../css/global';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useRoute, useTheme} from '@react-navigation/native';
import {getsummaryshift} from '../api/getshiftsummary';
import {savesummaryshift} from '../api/savesummaryshift';
import {savecashmanagement} from '../api/savecashmanagement';
import {getcashmanagement} from '../api/getcashmanagement';
import {closeshift} from '../api/closeshift';
import {SearchBar} from '@rneui/themed';
import CheckBox from '@react-native-community/checkbox';
import * as Utils from '../Helpers/Utils';
//import {loadingartha, wmsclear} from '../images/images';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as dbconn from '../db/ShiftDetails';
import * as dbconnTrx from '../db/AddTrxHdr';
import * as dbconnMng from '../db/PayInPayOut';
import moment from 'moment';

export default function Discount({navigation}) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  const colors = useTheme().colors;
  const increment = useRef(null);
  // const navigation = useNavigation();

  const [mdlDiscount, setMdlDiscount] = useState(false);
  const [mdlCloseShift, setMdlCloseShift] = useState(false);
  const [mdlCashMan, setMdlCashMan] = useState(false);
  const [search, setSearch] = useState('');
  const [information, setInformation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [expamount, setexpected_AMOUNT] = useState(0);
  const [batchid, setbatchID] = useState('');
  const [lastEdit_Date, setlastEdit_Date] = useState('');
  const [lastEdit_time, setlastEdit_time] = useState('');
  const [store_ID, setstore_ID] = useState('');
  const [poS_Device_ID, setpoS_Device_ID] = useState('');
  const [opening_Date, setopening_Date] = useState('');
  const [opening_time, setopening_time] = useState('');
  const [closing_Date, setclosing_Date] = useState('');
  const [closing_time, setclosing_time] = useState('');
  const [sum_Amount_Opening, setsum_Amount_Opening] = useState(0);
  const [sum_Amount_Closing, setsum_Amount_Closing] = useState(0);
  const [sum_Invoice_Posted, setsum_Invoice_Posted] = useState(0);
  const [sum_Tendered, setsum_Tendered] = useState(0);
  const [sum_Changes, setsum_Changes] = useState(0);
  const [sum_Amount_Discount, setsum_Amount_Discount] = useState(0);
  const [sum_Amount_Tax, setsum_Amount_Tax] = useState(0);
  const [sum_Invoice_Refund_Posted, setsum_Invoice_Refund_Posted] = useState(0);
  const [sum_Amount_PayOut, setsum_Amount_PayOut] = useState(0);
  const [sum_Amount_PayIn, setsum_Amount_PayIn] = useState(0);
  const [count_Customers, setcount_Customers] = useState(0);
  const [status_Batch, setstatus_Batch] = useState(0);
  const [created_User, setcreated_User] = useState('');
  const [created_Date, setcreated_Date] = useState('');
  const [created_time, setcreated_time] = useState('');
  const [notes, setNotes] = useState('');
  const [payin, setPayIn] = useState(0);
  const [closeamount, setCloseAmount] = useState(0);
  const [payment, setPayment] = useState([]);
  const [pipo, setPipo] = useState([]);
  const [cash, setCash] = useState(0);
  const [gross, setGross] = useState(0);
  const [netsales, setNetSales] = useState(0);
  const [totinv, setTotInv] = useState(0);
  const [tax, setTax] = useState(0);
  const [bca, setBca] = useState(0);
  const [mandiri, setMandiri] = useState(0);
  const [gopay, setGopay] = useState(0);
  const [differenamt, setDifferentAmt] = useState(0);
  const [amtin, setAmtIn] = useState(0);
  const [amtout, setAmtOut] = useState(0);
  const [expected, setExpected] = useState(0);
  const [modalWarningclose, setModalWarningclose] = useState(false);
  const [minus, setMinus] = useState(0);
  const [userid, setUSERID] = useState('');

  useEffect(() => {
    setMdlDiscount(true);
    ShowWarning();
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

  const LOADTBLPIPO = async () => {
    try {
      const pipo = await dbconnMng.getDBConnection();

      //await dbconnMng.dropTbl(pipo, 'PayInPayOut');
      await dbconnMng.PayInPayOut_CreateTbl(pipo, 'PayInPayOut');
    } catch (error) {
      console.error(error);
    }
  };

  const ShowWarning = async () => {
    try {
      const db = await dbconn.getDBConnection();
      let countdtl = [];
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      countdtl = await dbconn.ShiftDetail_getdataBillsCountSumm(
        db,
        'ShiftDetail',
        formattedDate,
        0,
      );
      var totline = countdtl[0].TOTALSHIFT;
      console.log('total SHIFT count: ', totline);
      if (totline == 1) {
        GetSummayShift();
        //GetCashManagementAll();
        LOADTBLPIPO();
      } else {
        let msg = 'Mohon opening shift terlebih dahulu, sebelum ke halaman ini';
        CallModalInfo(msg);
      }
    } catch (error) {
      console.error(error);
      CallModalInfo(error);
    }
  };

  const BackDash = async () => {
    setModalVisible(false);
    navigation.replace('Home');
  };

  const CallModalInfo = async info => {
    //setLoad(false);
    setInformation(info);
    setModalVisible(true);
    // Alert.alert("Information", info);
  };

  const OpenShiftWindow = async () => {
    const db = await dbconn.getDBConnection();
    let countdtl = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedDate = `${month}/${day}/${year}`;
    countdtl = await dbconn.ShiftDetail_getdataBillsCount(
      db,
      'ShiftDetail',
      runno,
      formattedDate,
    );
    var totline = countdtl[0].TOTALSHIFT;
    console.log('total SHIFT count: ', totline);
    if (totline == 0) {
      setOpenShift(true);
    } else {
      setOpenShift(false);
    }
  };

  const PostCloseShift = async (closeamount, differenamt) => {
    try {
      if (differenamt < 0) {
        setModalWarningclose(true);
        setMinus(differenamt);
      } else {
        setMdlCloseShift(false);
        console.log('nilai Amount_Closing', closeamount);
        let datauser = await AsyncStorage.getItem('@dtUser');
        datauser = JSON.parse(datauser);
        var userid = datauser[0].userid;
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        const formattedDate = `${month}/${day}/${year}`;
        const formattedtime = `${hours}:${minutes}`;
        console.log('TODAY DATE: ', formattedDate);
        console.log('CURRENT TIME: ', formattedtime);
        const db = await dbconn.getDBConnection();
        //const dbtrx = await dbconnTrx.getDBConnection();
        let datashift = await dbconn.ShiftDetail_getdataSum(
          db,
          'ShiftDetail',
          formattedDate,
        );
        // let datashift2 = await dbconn.ShiftDetail_getdataClos(
        //   db,
        //   'ShiftDetail',
        //   formattedDate,
        // );
        closeshift({
          Batch_ID: datashift[0].Batch_ID,
          Lineitmseq: 0,
          Payment_ID: 'PAY0001',
          Payment_Type: '',
          Amount_Opening: closeamount,
          UserID: userid,
        }).then(async result => {
          var hasil = result.data;
          console.log('hasil return post openshift: ', hasil);
          let query = `DELETE FROM ShiftDetail WHERE Closing_time != '' AND Opening_Date = '${formattedDate}' AND Status_Batch = 1;`;
          await dbconn.querydynamic(db, query);
          let datashiftABC = await dbconn.ShiftDetail_getdataAll(
            db,
            'ShiftDetail',
          );
          console.log('hasil get close after delete: ', datashiftABC);
          setMdlCloseShift(false);
          PostSummaryShiftClosing(closeamount);
        });
      }
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };

  const PostCloseShift2 = async (closeamount, differenamt) => {
    try {
      setMdlCloseShift(false);
      console.log('nilai Amount_Closing', closeamount);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const seconds = today.getSeconds();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      console.log('TODAY DATE: ', formattedDate);
      console.log('CURRENT TIME: ', formattedtime);
      const db = await dbconn.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataClos(
        db,
        'ShiftDetail',
        formattedDate,
      );
      closeshift({
        Batch_ID: datashift[0].Batch_ID,
        Lineitmseq: 0,
        Payment_ID: '',
        Payment_Type: '',
        Amount_Opening: closeamount,
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil return post openshift: ', hasil);
        let query = `DELETE FROM ShiftDetail WHERE Closing_time != '' AND Batch_ID = '${datashift[0].Batch_ID}' AND Status_Batch = 1;`;
        await dbconn.querydynamic(db, query);
        let datashift = await dbconn.ShiftDetail_getdataAll(db, 'ShiftDetail');
        console.log('hasil get close after delete: ', datashift);
        setMdlCloseShift(false);
        PostSummaryShiftClosing(closeamount);
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };

  const PostPayIn = async payin => {
    try {
      console.log('masuk pay in');
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      var storeid = datauser[0].store_ID;
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      let noitem = 0;
      const db = await dbconn.getDBConnection();
      const pipo = await dbconnMng.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
        0,
      );
      savecashmanagement({
        Batch_ID: datashift[0].Batch_ID,
        Type_CashManagement: '1',
        Amount: payin,
        Notes: notes,
        POS_ID: '',
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil return post openshift: ', hasil);
        let query = `UPDATE ShiftDetail SET Sum_Amount_PayIn = ${payin} WHERE Opening_Date = '${formattedDate}' AND Batch_ID = '${datashift[0].Batch_ID}' AND Status_Batch = 0;`;
        await dbconn.querydynamic(db, query);
        let datamax = await dbconnMng.queryselecPayInPayOut(
          pipo,
          `select * from PayInPayOut order by Sequence desc;`,
        );
        let len = datamax.length < 1 ? 0 : datamax.length;
        noitem = len + 1;
        await dbconnMng.PayInPayOut_savedata(
          pipo,
          'PayInPayOut',
          datashift[0].Batch_ID,
          1,
          payin,
          noitem,
          notes,
          userid,
          formattedDate,
          formattedtime,
        );
        setMdlCashMan(false);
        PostSummaryShift(payin);
        //PostSummaryShift(payin);
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };

  const PostPayOut = async payin => {
    try {
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      let noitem = 0;
      const db = await dbconn.getDBConnection();
      const pipo = await dbconnMng.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
        0,
      );
      savecashmanagement({
        Batch_ID: datashift[0].Batch_ID,
        Type_CashManagement: '2',
        Amount: payin,
        Notes: notes,
        POS_ID: 'POS01',
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil return post openshift: ', hasil);
        let query = `UPDATE ShiftDetail SET Sum_Amount_PayOut = ${payin} WHERE Opening_Date = '${formattedDate}' AND Batch_ID = '${datashift[0].Batch_ID}' AND Status_Batch = 0;`;
        await dbconn.querydynamic(db, query);
        let datamax = await dbconnMng.queryselecPayInPayOut(
          pipo,
          `select * from PayInPayOut order by Sequence desc;`,
        );
        let len = datamax.length < 1 ? 0 : datamax.length;
        noitem = len + 1;
        await dbconnMng.PayInPayOut_savedata(
          pipo,
          'PayInPayOut',
          datashift[0].Batch_ID,
          2,
          payin,
          noitem,
          notes,
          userid,
          formattedDate,
          formattedtime,
        );
        setMdlCashMan(false);
        //GetCashManagementOut();
        PostSummaryShiftOut(payin);
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };

  const PostSummaryShift = async payin => {
    try {
      console.log('MASUK SUMMARY SHIFT POST');
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      console.log('TODAY DATE: ', formattedDate);
      console.log('CURRENT TIME: ', formattedtime);
      console.log('nilai pay in', payin);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      var storeid = datauser[0].store_ID;
      const db = await dbconn.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
        0,
      );
      console.log('data shift: ', datashift);
      let Opening_Date = datashift[0].Opening_Date;
      console.log('opening date: ', Opening_Date);
      savesummaryshift({
        Batch_ID: datashift[0].Batch_ID,
        LastEdit_Date: formattedDate,
        LastEdit_time: formattedtime,
        Store_ID: storeid[0].value,
        POS_Device_ID: '',
        Opening_Date: datashift[0].Opening_Date,
        Opening_time: datashift[0].Opening_time,
        Closing_Date: '1900-01-01 00:00:00.000',
        Closing_time: '1900-01-01 00:00:00.000',
        Sum_Amount_Opening: datashift[0].Sum_Amount_Opening,
        Sum_Amount_Closing: 0,
        Sum_Invoice_Posted: 0,
        Sum_Tendered: 0,
        Sum_Changes: 0,
        Sum_Amount_Discount: 0,
        Sum_Amount_Tax: 0,
        Sum_Invoice_Refund_Posted: 0,
        Sum_Amount_PayOut: 0,
        Sum_Amount_PayIn: payin,
        Count_Customers: 0,
        Status_Batch: 0,
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil return save shift: ', hasil);
        GetSummayShift();
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };
  const PostSummaryShiftOut = async payin => {
    try {
      console.log('MASUK SUMMARY SHIFT POST');
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      console.log('TODAY DATE: ', formattedDate);
      console.log('CURRENT TIME: ', formattedtime);
      console.log('nilai pay in', payin);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      var storeid = datauser[0].store_ID;
      const db = await dbconn.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
        0,
      );
      console.log('data shift: ', datashift);
      let Opening_Date = datashift[0].Opening_Date;
      console.log('opening date: ', Opening_Date);
      savesummaryshift({
        Batch_ID: datashift[0].Batch_ID,
        LastEdit_Date: formattedDate,
        LastEdit_time: formattedtime,
        Store_ID: storeid[0].value,
        POS_Device_ID: '',
        Opening_Date: datashift[0].Opening_Date,
        Opening_time: datashift[0].Opening_time,
        Closing_Date: '1900-01-01 00:00:00.000',
        Closing_time: '1900-01-01 00:00:00.000',
        Sum_Amount_Opening: datashift[0].Sum_Amount_Opening,
        Sum_Amount_Closing: 0,
        Sum_Invoice_Posted: 0,
        Sum_Tendered: 0,
        Sum_Changes: 0,
        Sum_Amount_Discount: 0,
        Sum_Amount_Tax: 0,
        Sum_Invoice_Refund_Posted: 0,
        Sum_Amount_PayOut: payin,
        Sum_Amount_PayIn: 0,
        Count_Customers: 0,
        Status_Batch: 0,
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil return save shift: ', hasil);
        GetSummayShift();
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };
  const PostSummaryShiftClosing = async closeamount => {
    try {
      console.log('MASUK SUMMARY SHIFT POST');
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      console.log('TODAY DATE: ', formattedDate);
      console.log('CURRENT TIME: ', formattedtime);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      var storeid = datauser[0].store_ID;
      const db = await dbconn.getDBConnection();
      const dbtrx = await dbconnTrx.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
      );
      let datatrx = await dbconnTrx.AddTrxHdr_getdatashift(
        dbtrx,
        'AddTrxHdr',
        datashift[0].Batch_ID,
      );
      console.log('data shift: ', datashift);
      let Opening_Date = datashift[0].Opening_Date;
      console.log('opening date: ', Opening_Date);
      savesummaryshift({
        Batch_ID: datashift[0].Batch_ID,
        LastEdit_Date: formattedDate,
        LastEdit_time: formattedtime,
        Store_ID: storeid[0].value,
        POS_Device_ID: '',
        Opening_Date: datashift[0].Opening_Date,
        Opening_time: datashift[0].Opening_time,
        Closing_Date: formattedDate,
        Closing_time: formattedtime,
        Sum_Amount_Opening: datashift[0].Sum_Amount_Opening,
        Sum_Amount_Closing: closeamount,
        Sum_Invoice_Posted: 0,
        Sum_Tendered: 0,
        Sum_Changes: 0,
        Sum_Amount_Discount: 0,
        Sum_Amount_Tax: 0,
        Sum_Invoice_Refund_Posted: 0,
        Sum_Amount_PayOut: payin,
        Sum_Amount_PayIn: 0,
        Count_Customers: 0,
        Status_Batch: 0,
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil return save shift: ', hasil);
        let query = `UPDATE ShiftDetail SET Sum_Amount_Closing = ${closeamount}, Status_Batch = 1, Sum_Invoice_Posted = ${datatrx[0].InvoicePosted}, Difference = ${differenamt}, Closing_Date = '${formattedDate}', Closing_time = '${formattedtime}'
        WHERE Opening_Date = '${formattedDate}' AND Batch_ID = '${datashift[0].Batch_ID}' AND Status_Batch = 0;`;
        await dbconn.querydynamic(db, query);
        navigation.replace('Close');
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };
  const GetCashManagementAll = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      console.log('nilai pay in manage', payin);
      const db = await dbconn.getDBConnection();
      const dbtrx = await dbconnTrx.getDBConnection();
      const pipo = await dbconnMng.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
      );
      let datacash = await dbconnTrx.AddTrxHdr_getdatacash(
        dbtrx,
        'AddTrxHdr',
        datashift[0].Batch_ID,
      );
      let datapayin = await dbconnMng.PayInPayOut_getsumpayin(
        pipo,
        'PayInPayOut',
        datashift[0].Batch_ID,
      );
      let datapayout = await dbconnMng.PayInPayOut_getsumpayout(
        pipo,
        'PayInPayOut',
        datashift[0].Batch_ID,
      );
      console.log('BATCH ID MANAGE: ', datashift[0].Batch_ID);
      getcashmanagement(datashift[0].Batch_ID).then(async result => {
        var hasil = result.data;
        console.log('hasil return get cash mng: ', hasil);
        if (hasil.length > 0) {
          setAmtIn(datapayin[0].TOTALPAYIN ?? 0);
          setAmtOut(datapayout[0].TOTALPAYOUT ?? 0);
          console.log(
            'amount masing2: ',
            datacash[0].TOTALCASH,
            hasil[0].amounT_IN,
            hasil[0].amounT_OUT,
          );
          let totcash =
            datashift[0].Sum_Amount_Opening +
            datacash[0].TOTALCASH +
            (datapayin[0].TOTALPAYIN ?? 0);
          let allexpected = totcash - (datapayout[0].TOTALPAYOUT ?? 0);
          console.log('TOTAL EXPECTED: ', allexpected);
          setExpected(allexpected);
        } else {
          setAmtIn(0); // or any default value you prefer
          setAmtOut(0); // or any default value you prefer
          console.log(
            'amount masing2: ',
            datacash[0].TOTALCASH,
            sum_Amount_Opening,
            0,
          );
          let totpipo = 0; // no amounts to subtract
          let totcash = datashift[0].Sum_Amount_Opening + datacash[0].TOTALCASH;
          let allexpected = totcash - totpipo; // no adjustments needed
          setExpected(allexpected);
        }
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };
  const GetCashManagement = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      console.log('nilai pay in manage', payin);
      const db = await dbconn.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
      );
      console.log('BATCH ID MANAGE: ', datashift[0].Batch_ID);
      getcashmanagement(datashift[0].Batch_ID).then(async result => {
        var hasil = result.data;
        console.log('hasil return get cash mng: ', hasil);
        setAmtIn(hasil[0].amounT_IN);
        setAmtOut(hasil[0].amounT_OUT);
        PostSummaryShift(hasil[0].amounT_IN);
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };
  const GetCashManagementOut = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedtime = `${hours}:${minutes}`;
      console.log('nilai pay in manage', payin);
      const db = await dbconn.getDBConnection();
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
      );
      console.log('BATCH ID MANAGE: ', datashift[0].Batch_ID);
      getcashmanagement(datashift[0].Batch_ID).then(async result => {
        var hasil = result.data;
        console.log('hasil return get cash mng: ', hasil);
        setAmtIn(hasil[0].amounT_IN);
        setAmtOut(hasil[0].amounT_OUT);
        PostSummaryShiftOut(hasil[0].amounT_OUT);
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };
  const GetSummayShift = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      const db = await dbconn.getDBConnection();
      const dbtrx = await dbconnTrx.getDBConnection();
      const pipo = await dbconnMng.getDBConnection();
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      setUSERID(userid);
      let datashift = await dbconn.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
        0,
      );
      let datatrx = await dbconnTrx.AddTrxHdr_getdatashift(
        dbtrx,
        'AddTrxHdr',
        datashift[0].Batch_ID,
      );
      let datacash = await dbconnTrx.AddTrxHdr_getdatacash(
        dbtrx,
        'AddTrxHdr',
        datashift[0].Batch_ID,
      );
      let databca = await dbconnTrx.AddTrxHdr_getdatabca(
        dbtrx,
        'AddTrxHdr',
        datashift[0].Batch_ID,
      );
      let datamandiri = await dbconnTrx.AddTrxHdr_getdatamandiri(
        dbtrx,
        'AddTrxHdr',
        datashift[0].Batch_ID,
      );
      let datagopay = await dbconnTrx.AddTrxHdr_getdatagopay(
        dbtrx,
        'AddTrxHdr',
        datashift[0].Batch_ID,
      );
      let getpipo = await dbconnMng.PayInPayOut_getdataHDR(
        pipo,
        'PayInPayOut',
        datashift[0].Batch_ID,
      );
      setPipo(getpipo);
      let totbca = databca[0].TOTALCASH;
      let totmandiri = datamandiri[0].TOTALCASH;
      let totgopay = datagopay[0].TOTALCASH;
      let grosssales = datatrx[0].ORIGTOTL;
      let netsales = datatrx[0].ORIGTOTL - datatrx[0].setsum_Amount_Tax;
      let tax = datatrx[0].setsum_Amount_Tax;
      setTax(tax);
      setMandiri(totmandiri);
      setGopay(totgopay);
      setBca(totbca);
      setNetSales(netsales);
      setTotInv(datatrx[0].InvoicePosted);
      setGross(grosssales);
      setCash(datacash[0].TOTALCASH);
      setPayment(datatrx);
      getsummaryshift({
        Batch_ID: datashift[0].Batch_ID,
      }).then(async result => {
        if (result.status == 200) {
          var hasil = result.data;
          console.log('hasil get summary shift: ', hasil);
          console.log('hasil batch id summary shift: ', hasil[0].batch_ID);
          const formattedDateOpening = moment(hasil[0].opening_Date).format(
            'YYYY-MM-DD',
          );
          const formattedTimeOpening = moment(hasil[0].opening_time).format(
            'HH:mm',
          );
          setexpected_AMOUNT(hasil[0].expecteD_AMOUNT);
          setbatchID(hasil[0].batch_ID);
          setlastEdit_Date(hasil[0].lastEdit_Date);
          setlastEdit_time(hasil[0].lastEdit_Date);
          setopening_Date(formattedDateOpening);
          setopening_time(formattedTimeOpening);
          setclosing_Date(hasil[0].closing_Date);
          setclosing_time(hasil[0].closing_time);
          setsum_Amount_Opening(hasil[0].sum_Amount_Opening);
          setsum_Amount_Closing(hasil[0].sum_Amount_Closing);
          setsum_Invoice_Posted(hasil[0].sum_Invoice_Posted);
          setsum_Tendered(hasil[0].sum_Tendered);
          setsum_Changes(hasil[0].sum_Changes);
          setsum_Amount_Discount(hasil[0].sum_Amount_Discount);
          setsum_Amount_Tax(hasil[0].sum_Amount_Tax);
          setsum_Invoice_Refund_Posted(hasil[0].sum_Invoice_Refund_Posted);
          setsum_Amount_PayOut(hasil[0].sum_Amount_PayOut);
          setsum_Amount_PayIn(hasil[0].sum_Amount_PayIn);
          setcount_Customers(hasil[0].count_Customers);
          setstatus_Batch(hasil[0].status_Batch);
          setcreated_User(hasil[0].created_User);
          setcreated_Date(hasil[0].created_Date);
          setcreated_time(hasil[0].created_time);
          setstore_ID(hasil[0].store_ID);
          GetCashManagementAll();
        }
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };

  const DifferentAmount = async closeamount => {
    try {
      let changes = closeamount - expected;
      console.log('hasil changes: ', changes);
      setDifferentAmt(changes);
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const updateSearch = search => {
    setSearch(search);
  };

  const viewModalCloseShift = async () => {
    setMdlCloseShift(true);
  };
  const closeModalClose = async () => {
    setModalWarningclose(false);
    setMdlCloseShift(false);
  };
  const viewModalCashMan = async () => {
    setPayIn(0);
    setNotes('');
    setMdlCashMan(true);
  };
  function handleBackButtonClick() {
    navigation.replace('Home');
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

      {/* //* INFORMATION */}
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
                BackDash();
                //RELOADPAGE();
              }}>
              <Text style={globalStyles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* //* MODAL WARNING CLOSE */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalWarningclose}>
        <View style={globalStyles.centeredView}>
          <View style={globalStyles.modalView}>
            <View style={globalStyles.modalheader}>
              <Text style={globalStyles.modalText}>Warning</Text>
            </View>
            <View style={{margin: 20, marginBottom: 0}}>
              <Text style={{color: '#212121', fontSize: 16}}>
                Nilai Cash kurang dari yang ada di sistem senilai
              </Text>
              <Text
                style={{
                  color: '#ff0000',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                {Intl.NumberFormat('id-ID').format(minus)}
              </Text>
            </View>
            <View style={{margin: 20, marginBottom: 0}}>
              <Text style={{color: '#212121', fontSize: 16}}>
                Yakin close shift?
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 0}}>
              <TouchableOpacity
                style={[globalStyles.buttonNo]}
                onPress={() => closeModalClose()}>
                <Text style={globalStyles.textNo}>Tidak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.buttonYes]}
                onPress={() => PostCloseShift2(closeamount, differenamt)}>
                <Text style={globalStyles.textStyle}>Ya</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* MODAL WARNING CLOSE */}

      {/* //* MODAL CLOSE SHIFT */}
      <Modal animationType="fade" transparent={true} visible={mdlCloseShift}>
        <View style={globalStyles.centeredViewPayment}>
          <View style={globalStyles.modalViewBills} nestedScrollEnabled={true}>
            <View style={globalStyles.modalheader}>
              <Text style={globalStyles.modalText}>Close Shift</Text>
            </View>
            <ScrollView style={globalStyles.InputClose}>
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
                        Expected
                      </Text>
                    </View>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Cash Amount
                    </Text>
                  </View>
                  <View style={globalStyles.kanan}>
                    <TextInput
                      style={[
                        globalStyles.textinputcashclose,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      keyboardType="string"
                      value={expected.toLocaleString()}
                      editable={false}
                      //onChangeText={text => setPassword(text)}
                    />
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
                        Actual
                      </Text>
                    </View>
                    <Text
                      style={[
                        invrecStyles.labelinputbills,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}>
                      Cash Amount
                    </Text>
                  </View>
                  <View style={globalStyles.kanan}>
                    <TextInput
                      style={[
                        globalStyles.textinputcashclose,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      keyboardType="numeric"
                      value={closeamount.toLocaleString()}
                      onChangeText={text => {
                        const cleanedValue = text.replace(/[^0-9]/g, '');
                        const numericValue = parseFloat(cleanedValue);
                        if (!isNaN(numericValue)) {
                          // Update the state with the formatted value
                          setCloseAmount(numericValue);
                        } else {
                          // Handle invalid input, for example, setting an empty string
                          setCloseAmount('');
                        }
                      }}
                      onBlur={() => {
                        DifferentAmount(closeamount);
                      }}
                    />
                  </View>
                </View>
              </SafeAreaView>
              {/* //* BILLS*/}
            </ScrollView>
            <ScrollView style={globalStyles.InputBills2}>
              <SafeAreaView style={[invrecStyles.inputantotalanbillskiri]}>
                <View style={globalStyles.cartlist}>
                  <View style={globalStyles.kiri}>
                    <View style={globalStyles.itemqty}>
                      <Text
                        style={[
                          invrecStyles.labelinputbills,
                          {backgroundColor: colors.card, color: colors.text},
                        ]}>
                        Difference
                      </Text>
                    </View>
                  </View>
                  <View style={globalStyles.kanan}>
                    <TextInput
                      style={[
                        globalStyles.textinputcashclose,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      keyboardType="numeric"
                      editable={false}
                      value={differenamt.toLocaleString()}
                    />
                  </View>
                </View>
              </SafeAreaView>
            </ScrollView>
            <View style={globalStyles.ButtonCloseShift}>
              <SafeAreaView style={[invrecStyles.buttontotalanclose]}>
                <TouchableOpacity
                  style={[globalStyles.buttonclose2]}
                  onPress={() => PostCloseShift(closeamount, differenamt)}>
                  <Text style={globalStyles.textCloseShift}>CLOSE SHIFT</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* MODAL CLOSE SHIFT */}

      {/* //* MODAL CASH MANGEMENT */}
      <Modal animationType="fade" transparent={true} visible={mdlCashMan}>
        <View style={globalStyles.centeredViewPayment}>
          <View style={globalStyles.modalViewBills} nestedScrollEnabled={true}>
            <View style={globalStyles.modalheadercashman}>
              <TouchableOpacity
                style={invrecStyles.bannerpanahbackcashman}
                onPress={() => setMdlCashMan(!mdlCashMan)}>
                <Icon name={'arrow-left'} size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={globalStyles.modalTextcashman}>Cash Management</Text>
            </View>

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
                      Amount
                    </Text>
                  </View>
                </View>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Mengatur perilaku berdasarkan platform
                  style={globalStyles.containerkeyboard} // Menerapkan gaya ke KeyboardAvoidingView
                >
                  <View style={globalStyles.kananpipo}>
                    <TextInput
                      style={[
                        globalStyles.textinputcashmng,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      keyboardType="numeric"
                      editable={true}
                      value={payin.toLocaleString()}
                      onChangeText={text => {
                        const cleanedValue = text.replace(/[^0-9]/g, '');
                        const numericValue = parseFloat(cleanedValue);
                        if (!isNaN(numericValue)) {
                          // Update the state with the formatted value
                          setPayIn(numericValue);
                        } else {
                          // Handle invalid input, for example, setting an empty string
                          setPayIn('');
                        }
                      }}
                    />
                  </View>
                </KeyboardAvoidingView>
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
                      Notes
                    </Text>
                  </View>
                </View>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Mengatur perilaku berdasarkan platform
                  style={globalStyles.containerkeyboard} // Menerapkan gaya ke KeyboardAvoidingView
                >
                  <View style={globalStyles.kananpipo}>
                    <TextInput
                      style={[
                        globalStyles.textinputcashmng,
                        {backgroundColor: colors.card, color: colors.text},
                      ]}
                      maxLength={100}
                      value={notes}
                      placeholderTextColor={colors.text}
                      onChangeText={text => setNotes(text)}
                    />
                  </View>
                </KeyboardAvoidingView>
              </View>
            </SafeAreaView>
            <View style={globalStyles.ButtonCloseShift}>
              <SafeAreaView style={[invrecStyles.buttontotalanclose]}>
                <TouchableOpacity
                  style={[globalStyles.buttonclose]}
                  onPress={() => PostPayIn(payin)}>
                  <Text style={globalStyles.textCloseShift}>PAY IN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.buttonpayout]}
                  onPress={() => PostPayOut(payin)}>
                  <Text style={globalStyles.textpayout}>PAY OUT</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
            {/* //* BILLS*/}

            {/* <ScrollView style={globalStyles.InputBills2}>
              <Text style={globalStyles.Payinout}>Pay In/Pay Out</Text>
            </ScrollView> */}
            <Text style={globalStyles.Payinout}>Pay In/Pay Out</Text>
            <FlatList
              data={pipo}
              keyExtractor={item => item.Sequence}
              renderItem={({item}) => (
                <View style={globalStyles.receiptContainer}>
                  <Text style={globalStyles.invoice}>
                    {item.Date} {item.Time}
                  </Text>
                  <Text style={globalStyles.invoice}>{item.Notes}</Text>
                  <Text style={globalStyles.invoice}>
                    Rp. {Intl.NumberFormat('id-ID').format(item.Amount)}
                  </Text>
                  <View style={globalStyles.kananpipolist}>
                    <Text style={globalStyles.invoice2}>{item.Tipe_Cash}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
      {/* //* MODAL CASH MANAGEMENT */}

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
                {opening_Date}
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
                {opening_time}
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
                {batchid}
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
                {userid}
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
                Rp. {Intl.NumberFormat('id-ID').format(sum_Amount_Opening)}
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
                Rp {Intl.NumberFormat('id-ID').format(cash)}
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
                Rp {Intl.NumberFormat('id-ID').format(amtin)}
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
                Rp {Intl.NumberFormat('id-ID').format(amtout)}
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
                  Expected Cash Amount
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshifthdr,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(expected)}
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
                  Sales Summary
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
                  Gross Sales
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(gross)}
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
                  Refunds
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
                  Discounts
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {sum_Amount_Discount}
              </Text>
            </View>
          </SafeAreaView>
        </View>
        <ScrollView
          style={{borderBottomWidth: 1, borderBottomColor: '#212121'}}>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshifthdr,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Net Sales
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(netsales)}
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
                  Cash
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(cash)}
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
                  DEBIT BCA
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(bca)}
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
                  DEBIT MANDIRI
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(mandiri)}
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
                  GOPAY
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(gopay)}
              </Text>
            </View>
          </SafeAreaView>
        </ScrollView>
        <View style={{borderBottomWidth: 1, borderBottomColor: '#212121'}}>
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshift,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Taxes
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshift,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(tax)}
              </Text>
            </View>
          </SafeAreaView>
        </View>
        <View style={[invrecStyles.form]}>
          <View style={globalStyles.kiri}>
            <View style={[invrecStyles.menuitemsubmit2]}>
              <TouchableOpacity
                style={globalStyles.buttoncashmanag}
                onPress={viewModalCashMan}>
                <Text style={globalStyles.textbut}>CASH MANAGEMENT</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={globalStyles.kanan}>
            <View style={[invrecStyles.menuitemsubmit3]}>
              <TouchableOpacity
                style={globalStyles.buttoncashmanag}
                onPress={viewModalCloseShift}>
                <Text style={globalStyles.textbut}>CLOSE SHIFT</Text>
              </TouchableOpacity>
            </View>
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
