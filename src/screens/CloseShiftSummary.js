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

  useEffect(() => {
    setMdlDiscount(true);
    GetSummayShift();
    //ShowWarning();
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
      let datashift = await dbconn.ShiftDetail_getdataClos(
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
      let datashift = await dbconn.ShiftDetail_getdataClos(
        db,
        'ShiftDetail',
        formattedDate,
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
      setDifferentAmt(datashift[0].Difference);
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

  const updateSearch = search => {
    setSearch(search);
  };

  const viewModalCloseShift = async () => {
    var sumexpected = cash + amtin;
    var totexpected = sumexpected - amtout;
    setExpected(totexpected);
    setMdlCloseShift(true);
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
                {store_ID}
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
          <SafeAreaView style={invrecStyles.form}>
            <View style={globalStyles.kiri}>
              <View style={globalStyles.textshift}>
                <Text
                  style={[
                    invrecStyles.labelinputshifthdr,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Difference
                </Text>
              </View>
            </View>
            <View style={globalStyles.kanan}>
              <Text
                style={[
                  invrecStyles.labelinputshifthdr,
                  {backgroundColor: colors.card, color: colors.text},
                ]}>
                Rp {Intl.NumberFormat('id-ID').format(differenamt)}
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
          <View style={globalStyles.kanan3}>
            <View style={[invrecStyles.menuitemsubmit3]}>
              <TouchableOpacity
                style={globalStyles.buttoncashmanag}
                onPress={handleBackButtonClick}>
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
