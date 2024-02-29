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
import {getdiscount} from '../api/getdiscount';
import {getpayment} from '../api/getpaymentype';
import * as dbconn from '../db/Variant';
import * as dbconnTrx from '../db/AddTrx';
import {run} from 'jest';

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
  const [mdlEditVariant, setMdlEditVariant] = useState(false);
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
  const [notes, setNotes] = useState('');
  const [bills, setBills] = useState([]);
  const [discount, setDisCount] = useState([]);
  const [tax, setTax] = useState([]);
  const [total, setTotal] = useState([]);
  const [grandtotal, setGrandTotal] = useState([]);
  const [seqTemp, setSeqTemp] = useState(0);
  const [paymentType, setPaymentType] = useState([]);
  const [salesid, setSalesID] = useState('');
  const [amttendered, setAmtTender] = useState({});
  const [tottender, setTotTender] = useState('');
  const [changes, setChanges] = useState('');
  const [paymentID, setPaymentID] = useState('');
  const [hasDot, setHasDot] = useState(false);
  const [totchanges, setTotChanges] = useState('');
  //#endregion

  useEffect(() => {
    setMdlPayment(false);
    LOADMENU();
    Categories();
    GetItems();
    GetRunno();
    LOADTBLADDITEM();
    GetDiscount();
    GetSalesType();
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const LOADMENU = async () => {
    try {
      setDisCount([]);
      setAddTemp([]);
      setBills([]);
      setMdlConfirmCust(true);
      setMdlBills(false);
      setMdlPayment(false);
      setMdlVariant(false);
      setModalVisible(false);
      setCount(1);
      setTotChanges('');
      setTotTender('');
    } catch (error) {
      console.error(error);
    }
  };

  const LOADTBLADDITEM = async () => {
    try {
      const db = await dbconn.getDBConnection();
      const dbtrx = await dbconnTrx.getDBConnection();
      //await dbconnTrx.dropTbl(db, 'AddTrxDtl');
      //await dbconn.dropTbl(db, 'Variant');
      await dbconn.Variant_CreateTbl(db, 'Variant');
      await dbconnTrx.AddTrxDtl_CreateTbl(dbtrx, 'AddTrxDtl');
      await dbconn.deletedataAllTbl(db, 'Variant');
      await dbconnTrx.deletedataAllTbl(dbtrx, 'AddTrxDtl');
      const storedTbl = await dbconn.Variant_getdata(db, 'Variant');
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
    setCategory([]);
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
      TABLE: 'POS_TrxHeader_POST',
      FIELD: 'DOCNUMBER',
      DOCID: 'INV',
      NEWNUMBER: '',
    })
      .then(async result => {
        if (result.status == 200) {
          var hasil = result.data;
          console.log('hasil getrunno: ', hasil);
          var number = hasil[0].output;
          setRunno(number);
          console.log('INI ISI RUNNO: ', runno);
        }
      })
      .catch(async err => {
        console.log('respon: ' + err.message);
        let msg = 'Servers is not available.';
        msg = err.message;
        CallModalInfo(msg);
      });
  };

  const GetItems = async () => {
    setItem([]);
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

  const GetDiscount = async category => {
    setDisCount([]);
    console.log('category: ', category);
    getdiscount({}).then(async result => {
      var hasil = result.data;
      setDisCount(hasil);
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
      let dtVariant = [];
      var hasil = result.data;
      console.log('hasil get variant: ', hasil);
      const db = await dbconn.getDBConnection();
      await dbconn.Variant_savedata(db, 'Variant', hasil);
      dtVariant = await dbconn.Variant_getdata(db, 'Variant');
      setAddTemp(dtVariant);
      console.log('isi dtVariant: ', dtVariant);
      setVariant(hasil);
      viewModalVariant();
      //console.log('HASIL GET VARIANT', hasil);
    });
  };

  const GetSalesType = async () => {
    try {
      let datatipesales = await AsyncStorage.getItem('@datasalestype');
      datatipesales = JSON.parse(datatipesales);
      var param_tipesales = datatipesales[0].salesid;
      setSalesID(param_tipesales);
      console.log('TIPE SALES: ', param_tipesales);
    } catch (error) {
      let msg = error.message;
      console.log(msg);
      CallModalInfo(msg);
    }
  };

  const AddItemTemp = async () => {
    try {
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      console.log('TODAY DATE: ', formattedDate);

      const db = await dbconnTrx.getDBConnection();
      let dtVariant = await dbconn.Variant_getdataChoose(db, 'Variant');
      let noitem = 0;

      console.log('HASIL VARIANT YANG DIPILIH: ', dtVariant);

      if (dtVariant.length == 0) {
        console.log('masuk if length');
        noitem = noitem + 1;
      } else {
        console.log('masuk else if length');
        let datamax = await dbconnTrx.queryselectTrx(
          db,
          `select * from AddTrxDtl order by Lineitmseq desc;`,
        );
        console.log('isi data max dari table detail: ', datamax);
        let len = datamax.length < 1 ? 0 : datamax.length;
        noitem = len + 1;
        console.log('total noitem: ', noitem);
      }
      console.log('kelar ngitung sequence');
      console.log('ISI DETAIL VARIANT: ', dtVariant[0].item_Price);
      console.log('RUNNING NUMBER: ', runno);
      console.log('DATE: ', formattedDate);
      console.log('SEQUENCE: ', noitem);
      console.log('QTY ORDER: ', count);
      console.log('ISI NOTES: ', notes);
      await dbconnTrx.AddTrxDtl_savedata(
        db,
        'AddTrxDtl',
        runno,
        formattedDate,
        noitem,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        dtVariant[0].variant_Name,
      );
      let dataDetail = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      console.log('data detail: ', dataDetail);
      setMdlVariant(false);
    } catch (error) {
      console.log(error);
      let msg = 'Terjadi kesalahan, silahkan input ulang kembali';
      msg = error.message;
      CallModalInfo(msg);
    }
  };

  const GetBills = async () => {
    try {
      console.log('modal bills');
      setMdlBills(true);
      const db = await dbconnTrx.getDBConnection();
      let getbills = await dbconnTrx.AddTrxDtl_getdataBills(
        db,
        'AddTrxDtl',
        runno,
      );
      setBills(getbills);
      console.log('DATA BILLS: ', getbills);
      CalculateTotal();
    } catch (error) {
      console.log(error.message);
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const UpdateItem = async () => {
    try {
      console.log('isi sequence: ', seqTemp);
      const db = await dbconnTrx.getDBConnection();
      let dtVariant = await dbconn.Variant_getdataChoose(db, 'Variant');
      let variantedit = dtVariant[0].variant_Name;
      console.log('isi variant choose: ', variantedit);
      let updatedetail = await dbconnTrx.queryselectTrx(
        db,
        `UPDATE AddTrxDtl SET Quantity = ${count}, variant_Name = '${variantedit}' WHERE Lineitmseq = ${seqTemp}`,
      );
      let detailUpdate = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      setBills(detailUpdate);
      setMdlEditVariant(false);
      CalculateTotal();
    } catch (error) {
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const DeleteItem = async Lineitmseq => {
    try {
      console.log('ISI LNITMSEQ: ', Lineitmseq);
      const db = await dbconnTrx.getDBConnection();
      let query = `DELETE FROM AddTrxDtl WHERE Lineitmseq = ${Lineitmseq} `;
      await dbconnTrx.querydynamic(db, query);
      let CurrentDtl = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      setBills(CurrentDtl);
      console.log('ISI DETAIL SETELAH DELETE: ', CurrentDtl);
      CalculateTotal();
    } catch (error) {
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const CalculateTotal = async () => {
    try {
      const db = await dbconnTrx.getDBConnection();
      let qty = await dbconnTrx.queryselectTrx(
        db,
        `SELECT SUM(IFNULL(Item_Price * Quantity, 0))as TOTAL FROM AddTrxDtl`,
      );
      // let querysum = `SELECT (Item_Price * Quantity) AS TOTALPRICE FROM AddTrxDtl`;
      // let sumtotal = await dbconnTrx.querydynamic(db, querysum);
      let querytax = await dbconnTrx.queryselectTrx(
        db,
        `SELECT (${qty[0].TOTAL} * 0.11) as totalppn`,
      );
      let querytotal = await dbconnTrx.queryselectTrx(
        db,
        `SELECT (${qty[0].TOTAL} + ${querytax[0].totalppn}) AS GRANDTOTAL`,
      );
      // let total = await dbconnTrx.querydynamic(db, querytotal);
      console.log('HASIL QTY * PRICE: ', qty[0].TOTAL);
      // console.log('HASIL SUM TOTAL', sumtotal);

      console.log('HASIL TAX: ', querytax[0].totalppn);
      // console.log('HASIL TOTAL: ', total);
      if (querytotal.length == 0) {
        setGrandTotal([0]);
      } else {
        setGrandTotal([querytotal[0].GRANDTOTAL]);
      }
      if (querytax.length == 0) {
        setTax([0]);
      } else {
        setTax([querytax[0].totalppn]);
      }

      if (qty.length == 0) {
        console.log('haha: ', qty.length);
        setTotal([0]);
      } else {
        setTotal([qty[0].TOTAL]);
      }
      console.log('nilai total: ', total);
    } catch (error) {
      console.log('ERROR CALCULATE: ', error.message);
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const GetPayment = async () => {
    try {
      setMdlBills(false);
      setMdlPayment(true);
      setTotChanges('');
      const db = await dbconnTrx.getDBConnection();
      let datatipesales = await AsyncStorage.getItem('@datasalestype');
      datatipesales = JSON.parse(datatipesales);
      var param_tipesales = datatipesales[0].salesid;
      getpayment({
        interid: '',
        ID: '',
      }).then(async result => {
        var hasil = result.data;
        console.log('DATA PAYMENT: ', hasil);
        setPaymentType(hasil);
      });
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const handleTextInputChange = (paymentkey, newValue) => {
    const hasMoreThanOneDot =
      newValue.includes('.') && newValue.split('.').length > 2;
    if (!hasMoreThanOneDot) {
      setHasDot(newValue.includes('.'));
      setAmtTender(prevState => ({
        ...prevState,
        [paymentkey]: newValue,
      }));
    }
  };

  const Changes = async (paymentid, amounttender) => {
    try {
      setAmtTender('');
      console.log('payment ID, ', paymentid.payment_ID);
      console.log('amount tender: ', amounttender);
      let changes = amounttender - grandtotal;
      let tendertot = amounttender;
      console.log('hasil changes: ', changes);
      setTotTender(tendertot);
      setChanges(changes);
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const ChangesAll = async () => {
    try {
      let tenderall = grandtotal;
      let changesall = grandtotal - grandtotal;
      setTotTender(tenderall);
      setTotChanges(changesall);
      console.log('TOTAL TENDER ALL: ', tenderall);
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const SyncPayment = async () => {
    try {
      setTotTender('');
      setTotChanges('');
      setGrandTotal('');
      setChanges('');
      setMdlPayment(false);
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
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

  const UpdateDataList = async (
    itemnumber,
    flag,
    lineItem_Variant,
    lineItem_Option,
  ) => {
    console.log('flag: ', flag);
    console.log('line item variant: ', lineItem_Variant);
    console.log('line item option: ', lineItem_Option);
    const db = await dbconn.getDBConnection();
    let flagvar = !flag;
    let query = `UPDATE Variant SET flag = ${flagvar} WHERE lineItem_Option = ${lineItem_Option} and item_Number = '${itemnumber}' `;
    await dbconn.querydynamic(db, query);
    GetlistAfterUpdateVar();
  };

  GetlistAfterUpdateVar = async () => {
    const db = await dbconn.getDBConnection();
    let dtVariant = await dbconn.Variant_getdata(db, 'Variant');
    setVariant(dtVariant);
  };

  //#endregion

  //#region //* EVENT

  const viewModalVariant = async () => {
    setMdlVariant(true);
  };

  const viewModalEditVariant = async Lineitmseq => {
    setSeqTemp(Lineitmseq);
    console.log('SEQUENCE: ', seqTemp);
    setMdlEditVariant(true);
  };

  const viewModalBills = async () => {
    setMdlBills(true);
  };

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  const CallModalInfo = async info => {
    //setLoad(false);
    setInformation(info);
    setModalVisible(true);
    // Alert.alert("Information", info);
  };

  //#endregion

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={{flex: 1, width: '100%', height: '100%', padding: 0}}>
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
                {paymentType.map((paymentType, index) => {
                  return (
                    <View
                      key={index}
                      style={[invrecStyles.inputantotalanbills2]}>
                      <View style={globalStyles.labelinputtotalanbillsdisc}>
                        <Text
                          style={[
                            invrecStyles.labelinput,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}>
                          {paymentType.payment_Name}
                        </Text>
                      </View>
                      <View style={globalStyles.kanan2}>
                        <TextInput
                          style={[
                            globalStyles.textinputpayment,
                            {backgroundColor: colors.card, color: colors.text},
                          ]}
                          maxLength={100}
                          keyboardType="numeric"
                          value={
                            amttendered &&
                            amttendered[`${paymentType.payment_ID}`] !==
                              undefined
                              ? amttendered[`${paymentType.payment_ID}`]
                              : ''
                          }
                          onChangeText={value => {
                            const newValue = value ? value : '';
                            handleTextInputChange(
                              `${paymentType.payment_ID}`,
                              newValue,
                            );
                          }}
                          onBlur={() => {
                            Changes(
                              paymentType,
                              amttendered[`${paymentType.payment_ID}`],
                            );
                          }}
                        />
                        <TouchableOpacity
                          style={[globalStyles.buttonAll]}
                          onPress={() => ChangesAll()}>
                          <Text style={globalStyles.textStyle}>All</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                {/* //* TENDER INPUT*/}
              </ScrollView>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                <View style={globalStyles.labelinputtotalanbillsdisc}>
                  <Text
                    style={[
                      invrecStyles.labelinput,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    Total Amount
                  </Text>
                </View>
                <View style={globalStyles.kanan2}>
                  <TextInput
                    style={[
                      globalStyles.textinputpayment,
                      {backgroundColor: '#f5f5f5', color: colors.text},
                    ]}
                    editable={false}
                    maxLength={100}
                    value={grandtotal.toLocaleString('id-ID')}
                  />
                </View>
                <View style={globalStyles.labelinputtotalanbillsdisc}>
                  <Text
                    style={[
                      invrecStyles.labelinput,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    Total Tendered
                  </Text>
                </View>
                <View style={globalStyles.kanan2}>
                  <TextInput
                    style={[
                      globalStyles.textinputpayment,
                      {backgroundColor: '#f5f5f5', color: colors.text},
                    ]}
                    editable={false}
                    maxLength={100}
                    value={tottender.toLocaleString('id-ID')}
                  />
                </View>
                <View style={globalStyles.labelinputtotalanbillsdisc}>
                  <Text
                    style={[
                      invrecStyles.labelinput,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    Changes
                  </Text>
                </View>
                <View style={globalStyles.kanan2}>
                  <TextInput
                    style={[
                      globalStyles.textinputpayment,
                      {backgroundColor: '#f5f5f5', color: colors.text},
                    ]}
                    editable={false}
                    maxLength={100}
                    value={changes.toLocaleString('id-ID')}
                    //onChangeText={text => setPassword(text)}
                  />
                </View>
              </SafeAreaView>
              <View style={globalStyles.ButtonPayment}>
                <SafeAreaView style={[invrecStyles.buttontotalan]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonNoPayment]}
                    onPress={() => setMdlPayment(!mdlPayment)}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    onPress={() => SyncPayment()}>
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
                        {variant.flag == 1 ? (
                          <TouchableOpacity
                            style={[globalStyles.buttonSubmitFlagChoose]}
                            //disabled={true}
                            onPress={() =>
                              UpdateDataList(
                                variant.item_Number,
                                variant.flag,
                                variant.lineItem_Variant,
                                variant.lineItem_Option,
                              )
                            }>
                            <Text style={globalStyles.textFlag}>
                              {variant.variant_Name}
                            </Text>
                            <Text style={globalStyles.textFlag2}>
                              {variant.item_Price}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={[globalStyles.buttonSubmitFlag]}
                            onPress={() =>
                              UpdateDataList(
                                variant.item_Number,
                                variant.flag,
                                variant.lineItem_Variant,
                                variant.lineItem_Option,
                              )
                            }>
                            <Text style={globalStyles.textFlag}>
                              {variant.variant_Name}
                            </Text>
                            <Text style={globalStyles.textFlag2}>
                              {variant.item_Price}
                            </Text>
                          </TouchableOpacity>
                        )}
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
                      value={notes}
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
                    editable={false}
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
                    onPress={() => {
                      AddItemTemp();
                    }}>
                    <Text style={globalStyles.textStyle}>Add Item</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL VARIANT */}
        {/* //* MODAL EDIT VARIANT */}
        <Modal animationType="fade" transparent={true} visible={mdlEditVariant}>
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
                        {variant.flag == 1 ? (
                          <TouchableOpacity
                            style={[globalStyles.buttonSubmitFlagChoose]}
                            //disabled={true}
                            onPress={() =>
                              UpdateDataList(
                                variant.item_Number,
                                variant.flag,
                                variant.lineItem_Variant,
                                variant.lineItem_Option,
                              )
                            }>
                            <Text style={globalStyles.textFlag}>
                              {variant.variant_Name}
                            </Text>
                            <Text style={globalStyles.textFlag2}>
                              {variant.item_Cost}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={[globalStyles.buttonSubmitFlag]}
                            onPress={() =>
                              UpdateDataList(
                                variant.item_Number,
                                variant.flag,
                                variant.lineItem_Variant,
                                variant.lineItem_Option,
                              )
                            }>
                            <Text style={globalStyles.textFlag}>
                              {variant.variant_Name}
                            </Text>
                            <Text style={globalStyles.textFlag2}>
                              {variant.item_Cost}
                            </Text>
                          </TouchableOpacity>
                        )}
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
                      value={notes}
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
                    editable={false}
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
                    onPress={() => setMdlEditVariant(!mdlEditVariant)}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    onPress={() => {
                      UpdateItem(variant.Lineitmseq);
                    }}>
                    <Text style={globalStyles.textStyle}>Edit Item</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL EDIT VARIANT */}
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
              <ScrollView
                style={globalStyles.InputBills}
                nestedScrollEnabled={true}>
                {/* //* BILLS*/}
                <View style={[invrecStyles.inputantotalanbillskiri]}>
                  {bills.map((bills, index) => {
                    return (
                      <View key={index} style={globalStyles.cartlist}>
                        <View style={globalStyles.kiri}>
                          <View style={globalStyles.itemqty}>
                            <TouchableOpacity
                              onPress={() => {
                                viewModalEditVariant(bills.Lineitmseq);
                              }}>
                              <Text
                                style={[
                                  invrecStyles.labelinputbills,
                                  {
                                    backgroundColor: colors.card,
                                    color: colors.text,
                                  },
                                ]}>
                                {bills.Item_Description}
                              </Text>
                            </TouchableOpacity>
                            <Text
                              style={[
                                invrecStyles.labelinputbills,
                                {
                                  backgroundColor: colors.card,
                                  color: colors.text,
                                },
                              ]}>
                              x{bills.Quantity}
                            </Text>
                          </View>
                          <Text
                            style={[
                              invrecStyles.labelinputbills,
                              {
                                backgroundColor: colors.card,
                                color: colors.text,
                              },
                            ]}>
                            {bills.variant_Name}
                          </Text>
                        </View>
                        <View style={globalStyles.kanan}>
                          <TouchableOpacity
                            style={{position: 'absolute', right: 0}}
                            onPress={() => DeleteItem(bills.Lineitmseq)}>
                            <Text style={invrecStyles.labelrightdatalist}>
                              Hapus
                            </Text>
                          </TouchableOpacity>
                          <Text
                            style={[
                              invrecStyles.labelinputbills,
                              {
                                backgroundColor: colors.card,
                                color: colors.text,
                              },
                            ]}>
                            {bills.Item_Price}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                {/* //* BILLS*/}
              </ScrollView>
              <ScrollView style={globalStyles.InputBills2}>
                <Text style={globalStyles.TextHeaderBills2}>Discounts</Text>
                {discount.map((discount, index) => {
                  return (
                    <View
                      key={index}
                      style={[invrecStyles.inputantotalanbills2]}>
                      <View style={globalStyles.labelinputtotalanbillsdisc}>
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          {discount.discount_Name}
                        </Text>
                      </View>
                      <View style={globalStyles.viewinput2}>
                        <CheckBox
                          tintColors={{true: '#0096FF', false: 'black'}}
                          //value={toggleCheckBox}
                          onValueChange={newValue =>
                            setToggleCheckBox(newValue)
                          }
                        />
                      </View>
                    </View>
                  );
                })}
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
                      Rp {total.toLocaleString('id-ID')}
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
                      Rp {tax.toLocaleString('id-ID')}
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
                      Rp {grandtotal.toLocaleString('id-ID')}
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
                    onPress={() => GetPayment()}>
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
              onPress={() => {
                GetBills();
              }}>
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
              searchable={true}
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
