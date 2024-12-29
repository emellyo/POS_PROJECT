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
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import {globalStyles, invrecStyles} from '../css/global';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useRoute, useTheme} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import * as Utils from '../Helpers/Utils';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getcategories} from '../api/getcategories';
import {getitem} from '../api/getitem';
import {Item} from 'react-navigation-header-buttons';
import {getvariant} from '../api/getvariant';
import {getrunno} from '../api/generatenumberperday';
import {getrunnobatch} from '../api/getrunnobatch';
import {getdiscount} from '../api/getdiscount';
import {getpayment} from '../api/getpaymentype';
import {closeshift} from '../api/closeshift';
import {savesummaryshift} from '../api/savesummaryshift';
import {syncup} from '../api/syncuptrx';
import {hsdLogo} from './dummy-logo';
import * as dbconn from '../db/Variant';
import * as dbconnTrx from '../db/AddTrx';
import * as dbhdr from '../db/AddTrxHdr';
import * as dbshift from '../db/ShiftDetails';
import {Picker} from '@react-native-picker/picker';
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
  const [mdlnonVariant, setMdlNonVariant] = useState(false);
  const [mdlEditVariant, setMdlEditVariant] = useState(false);
  const [mdlEditNonVariant, setMdlEditNonVariant] = useState(false);
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
  const [runnobatch, setRunnoBatch] = useState('');
  const [custname, setCustName] = useState('');
  const [addtemp, setAddTemp] = useState([]);
  const [notes, setNotes] = useState('');
  const [bills, setBills] = useState([]);
  const [discount, setDisCount] = useState([]);
  const [tax, setTax] = useState([]);
  const [tax1, setTax1] = useState([]);
  const [total, setTotal] = useState(0);
  const [total1, setTotal1] = useState(0);
  const [grandtotal, setGrandTotal] = useState(0);
  const [grandtotalview, setGrandTotalview] = useState(0);
  const [seqTemp, setSeqTemp] = useState(0);
  const [paymentType, setPaymentType] = useState([]);
  const [salesid, setSalesID] = useState('');
  const [salesname, setSalesName] = useState('');
  const [amttendered, setAmtTender] = useState([]);
  const [tottender, setTotTender] = useState(0);
  const [changes, setChanges] = useState(0);
  const [paymentID, setPaymentID] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [totaldtl, setTotDetail] = useState(0);
  const [hasDot, setHasDot] = useState(false);
  const [totchanges, setTotChanges] = useState('');
  const [namatoko1, setNamaToko] = useState('');
  const [alamattoko, setAlamatToko] = useState('');
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [currenttime, setCurrentTime] = useState('');
  const [dataprint, setDataPrint] = useState([]);
  const [isChecked, setIsChecked] = useState(discount.map(() => false));
  const [nilaidisc, setNilaiDisc] = useState(0);
  const [nilaidiscbills, setNilaiDiscBills] = useState(0);
  const [nilaidiscview, setNilaiDiscView] = useState(0);
  const [nilaidiscitem, setNilaiDiscItem] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [discid, setDiscId] = useState('');
  const [activePaymentID, setActivePaymentID] = useState(null);
  const [itemdescvar, setItemDescvar] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedDiscountitem, setSelectedDiscountItem] = useState('');
  const [selectedDiscountitemvalue, setSelectedDiscountItemValue] = useState(0);
  const [discitemtype, setDiscItemType] = useState(0);
  //#endregion

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled));
        setLoading(false);
      },
      err => {
        err;
      },
    );
    setMdlPayment(false);
    LOADMENU();
    Categories();
    GetItems();
    GetRunno();
    LOADTBLADDITEM();
    GetDiscount();
    GetSalesType();
    GetStorename();
    getCurrentTime();
    console.log('Current time:', getCurrentTime());
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

  useEffect(() => {
    // Recalculate total whenever relevant states change
    if (discitemtype !== 1 && discitemtype !== 2) {
      CalculateTotal();
    }
  }, [selectedDiscount, total, nilaidisc]);

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
      setTotTender(0);
    } catch (error) {
      console.error(error);
    }
  };

  const LOADTBLADDITEM = async () => {
    try {
      const db = await dbconn.getDBConnection();
      const dbtrx = await dbconnTrx.getDBConnection();
      const dbtrxhdr = await dbhdr.getDBConnection();
      //await dbconnTrx.dropTbl(db, 'AddTrxHdr');
      //await dbconn.dropTbl(db, 'Variant');
      //await dbconnTrx.dropTbl(dbtrx, 'AddTrxDtlTemp');
      await dbconnTrx.AddTrxDtl_CreateTbl(dbtrx, 'AddTrxDtl');
      await dbconnTrx.AddTrxDtlTemp_CreateTbl(dbtrx, 'AddTrxDtlTemp');
      await dbconn.Variant_CreateTbl(db, 'Variant');
      await dbhdr.AddTrxHdr_CreateTbl(dbtrxhdr, 'AddTrxHdr');
      await dbhdr.AddTrxHdrTemp_CreateTbl(dbtrxhdr, 'AddTrxHdrTemp');
      await dbhdr.deletedataAllTbl(dbtrxhdr, 'AddTrxHdrTemp');
      await dbconnTrx.deletedataAllTbl(dbtrx, 'AddTrxDtl');
      await dbconnTrx.deletedataAllTbl(dbtrx, 'AddTrxDtlTemp');
      await dbconn.deletedataAllTbl(db, 'Variant');
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

  // const GetRunno = async () => {
  //   getrunno({
  //     TABLE: 'POS_TrxHeader_POST',
  //     FIELD: 'DOCNUMBER',
  //     DOCID: 'INV',
  //     NEWNUMBER: '',
  //   })
  //     .then(async result => {
  //       if (result.status == 200) {
  //         var hasil = result.data;
  //         console.log('hasil getrunno: ', hasil);
  //         var number = hasil[0].output;
  //         setRunno(number);
  //         console.log('INI ISI RUNNO: ', runno);
  //       }
  //     })
  //     .catch(async err => {
  //       console.log('respon: ' + err.message);
  //       let msg = 'Servers is not available.';
  //       msg = err.message;
  //       CallModalInfo(msg);
  //     });
  // };

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
    var itmdesc = variant.item_Name;
    var isVarian = variant.isVariant;
    var price = variant.item_Price;
    setItemDescvar(itmdesc);
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
      if (hasil.length == 0) {
        const db = await dbconn.getDBConnection();
        await dbconn.Variant_savedataNonVariant(
          db,
          'Variant',
          itmno,
          itmdesc,
          price,
          variant.item_Cost,
          variant.inStock,
          variant.lowStock,
        );
        dtVariant = await dbconn.Variant_getdata(db, 'Variant');
        setAddTemp(dtVariant);
        setCount(1);
        viewModalVariant(isVarian, price);
      } else {
        const db = await dbconn.getDBConnection();
        await dbconn.Variant_savedata(db, 'Variant', hasil);
        dtVariant = await dbconn.Variant_getdata(db, 'Variant');
        setAddTemp(dtVariant);
        console.log('isi dtVariant: ', dtVariant);
        setVariant(hasil);
        setCount(1);
        viewModalVariant(isVarian, price);
        //console.log('HASIL GET VARIANT', hasil);
      }
    });
  };

  const GetSalesType = async () => {
    try {
      let datatipesales = await AsyncStorage.getItem('@datasalestype');
      datatipesales = JSON.parse(datatipesales);
      var param_tipesales = datatipesales[0].salesid;
      var param_salesname = datatipesales[0].tipesales;
      setSalesID(param_tipesales);
      setSalesName(param_salesname);
      console.log('TIPE SALES: ', param_tipesales);
    } catch (error) {
      let msg = error.message;
      console.log(msg);
      CallModalInfo(msg);
    }
  };

  const filteredDiscItem = discount.filter(item => item.discount_Type === 2);
  const filteredDiscBills = discount.filter(item1 => item1.discount_Type === 1);

  const handleDiscountItem = async discount => {
    let newDiscountValue = 0;
    const db = await dbconnTrx.getDBConnection();
    const selectedItem = filteredDiscItem.find(
      item => item.discount_ID === discount,
    );
    console.log('SELECTED ITEM: ', selectedItem);
    if (selectedItem.type === 1) {
      let getbills = await dbconnTrx.AddTrxDtl_getdataBills(
        db,
        'AddTrxDtl',
        runno,
      );
      newDiscountValue = Math.round(
        (getbills[0].Item_Price * selectedItem.discount_Value) / 100,
      );
      //CalculateTotalDiscItem(newDiscountValue);
    } else if (selectedItem.type == 2) {
      console.log('masuk discount type 2');
      newDiscountValue = Math.round(selectedItem.discount_Value);
      //CalculateTotalDiscItem(newDiscountValue);
      //setTotal(discountedTotalamt);
    }
    setDiscId(selectedItem.discount_ID);
    setSelectedDiscountItemValue(selectedItem.discount_Value);
    setDiscItemType(selectedItem.type);
    // setSelectedDiscountItem(discount.discount_ID);
    // setDiscId(discount.discount_ID);
    setNilaiDiscItem(newDiscountValue);
    //setNilaiDisc(JSON.stringify(newDiscountValue).split('.')[0]);
    //await new Promise(resolve => setTimeout(resolve, 0));
    // Here you would typically apply the discount to your total
    //CalculateTotal();
    //console.log(`Applied discount: ${discount.discount_Name}`);
  };

  const handleDiscountChange = async discount => {
    if (selectedDiscount === discount.discount_ID) {
      setSelectedDiscount(null); // Uncheck if already selected
      setNilaiDiscBills(0);
    } else {
      let newDiscountValue = 0;
      let totalall = Number(total1);
      console.log('TOTAL ALL: ', totalall);
      if (discount.type === 1) {
        console.log('masuk discount type 1');
        newDiscountValue = Math.round(
          (totalall * discount.discount_Value) / 100,
        );
      } else if (discount.type === 2) {
        console.log('masuk discount type 2');
        newDiscountValue = Math.round(discount.discount_Value);
        //setTotal(discountedTotalamt);
      }
      setSelectedDiscount(discount.discount_ID);
      setDiscId(discount.discount_ID);
      setNilaiDiscBills(JSON.stringify(newDiscountValue).split('.')[0]);
    }
    await new Promise(resolve => setTimeout(resolve, 0));
    // Here you would typically apply the discount to your total
    //CalculateTotal();
    console.log(`Applied discount: ${discount.discount_Name}`);
  };

  const ChooseCalc = async () => {
    try {
      if (discitemtype == 1 || discitemtype == 2) {
        console.log('masuk disc item');
        AddItemTemp();
      } else {
        console.log('masuk disc bills');
        AddItemTempNormal();
      }
    } catch (error) {
      console.log(error.message);
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const ChooseCalcnonvar = async () => {
    try {
      if (discitemtype == 1 || discitemtype == 2) {
        console.log('masuk disc item');
        AddItemTempNonvar();
      } else {
        console.log('masuk disc bills');
        AddItemTempNonvarNormal();
      }
    } catch (error) {
      console.log(error.message);
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const AddItemTemp = async variant => {
    try {
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      //console.log('TODAY DATE: ', formattedDate);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var storeid = datauser[0].store_ID;
      const db = await dbconnTrx.getDBConnection();
      let dtVariant = await dbconn.Variant_getdataChoose(db, 'Variant');
      //console.log('ISI DTVARIANT: ', dtVariant);
      let noitem = 0;
      let amtdiscitem = nilaidiscitem * count;
      let totnet = dtVariant[0].item_Price * count;
      let subtotal = Math.round(totnet / 1.11);
      let tax = Math.round(totnet - subtotal);

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
      await dbconnTrx.AddTrxDtl_savedata(
        db,
        'AddTrxDtl',
        runno,
        formattedDate,
        noitem,
        dtVariant[0].lineItem_Option,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        dtVariant[0].variant_Name,
        storeid[0].value,
        1,
        discid,
        amtdiscitem,
      );
      await dbconnTrx.AddTrxDtlTemp_savedata(
        db,
        'AddTrxDtlTemp',
        runno,
        formattedDate,
        noitem,
        dtVariant[0].lineItem_Option,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        dtVariant[0].variant_Name,
        storeid[0].value,
        1,
        discid,
        amtdiscitem,
        totnet,
        subtotal,
        tax,
      );
      let dataDetail = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      let dataDetailTemp = await dbconnTrx.AddTrxDtlTemp_getdata(
        db,
        'AddTrxDtlTemp',
      );
      console.log('data detail: ', dataDetail);
      console.log('data detail temp: ', dataDetailTemp);
      setMdlVariant(false);
      setDiscItemType(0);
      setNilaiDiscItem(0);
    } catch (error) {
      console.log(error);
      let msg = 'Terjadi kesalahan, silahkan input ulang kembali';
      msg = error.message;
      CallModalInfo(msg);
    }
  };

  const AddItemTempNormal = async variant => {
    try {
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      //console.log('TODAY DATE: ', formattedDate);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var storeid = datauser[0].store_ID;
      const db = await dbconnTrx.getDBConnection();
      let dtVariant = await dbconn.Variant_getdataChoose(db, 'Variant');
      //console.log('ISI DTVARIANT: ', dtVariant);
      let noitem = 0;
      let amtdiscitem = 0;
      let totnet = dtVariant[0].item_Price * count - amtdiscitem;
      let subtotal = Math.round(totnet / 1.11);
      let tax = Math.round(totnet - subtotal);
      console.log('totnet: ', totnet);
      console.log('subtotal: ', subtotal);
      console.log('tax: ', tax);
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
      //console.log('kelar ngitung sequence');
      //console.log('ISI DETAIL VARIANT: ', dtVariant[0].item_Price);
      // console.log('ISI STORE ID: ', storeid[0].value);
      // console.log('RUNNING NUMBER: ', runno);
      // console.log('DATE: ', formattedDate);
      // console.log('SEQUENCE: ', noitem);
      // console.log('QTY ORDER: ', count);
      // console.log('ISI NOTES: ', notes);
      await dbconnTrx.AddTrxDtl_savedata(
        db,
        'AddTrxDtl',
        runno,
        formattedDate,
        noitem,
        dtVariant[0].lineItem_Option,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        dtVariant[0].variant_Name,
        storeid[0].value,
        1,
        '',
        0,
      );
      await dbconnTrx.AddTrxDtlTemp_savedata(
        db,
        'AddTrxDtlTemp',
        runno,
        formattedDate,
        noitem,
        dtVariant[0].lineItem_Option,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        dtVariant[0].variant_Name,
        storeid[0].value,
        1,
        '',
        0,
        totnet,
        subtotal,
        tax,
      );
      let dataDetail = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      let dataDetailTemp = await dbconnTrx.AddTrxDtlTemp_getdata(
        db,
        'AddTrxDtlTemp',
      );
      console.log('data detail: ', dataDetail);
      console.log('data detail temp: ', dataDetailTemp);
      setMdlVariant(false);
    } catch (error) {
      console.log(error);
      let msg = 'Terjadi kesalahan, silahkan input ulang kembali';
      msg = error.message;
      CallModalInfo(msg);
    }
  };

  const AddItemTempNonvar = async () => {
    try {
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      console.log('TODAY DATE: ', formattedDate);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var storeid = datauser[0].store_ID;
      const db = await dbconnTrx.getDBConnection();
      let dtVariant = await dbconn.Variant_getdataChooseNonVar(db, 'Variant');
      let noitem = 0;
      let amtdiscitem = nilaidiscitem * count;
      let totnet = dtVariant[0].item_Price * count;
      let subtotal = totnet / 1.11;
      let tax = totnet - subtotal;

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
      console.log('ISI STORE ID: ', storeid[0].value);
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
        0,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        '',
        storeid[0].value,
        0,
        discid,
        amtdiscitem,
      );
      await dbconnTrx.AddTrxDtlTemp_savedata(
        db,
        'AddTrxDtlTemp',
        runno,
        formattedDate,
        noitem,
        0,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        '',
        storeid[0].value,
        0,
        discid,
        amtdiscitem,
        totnet,
        subtotal,
        tax,
      );
      let dataDetail = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      console.log('data detail: ', dataDetail);
      setMdlNonVariant(false);
      setDiscItemType(0);
      setNilaiDiscItem(0);
    } catch (error) {
      console.log(error);
      let msg = 'Terjadi kesalahan, silahkan input ulang kembali';
      msg = error.message;
      CallModalInfo(msg);
    }
  };

  const AddItemTempNonvarNormal = async () => {
    try {
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      console.log('TODAY DATE: ', formattedDate);
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var storeid = datauser[0].store_ID;
      const db = await dbconnTrx.getDBConnection();
      let dtVariant = await dbconn.Variant_getdataChooseNonVar(db, 'Variant');
      let noitem = 0;
      let amtdiscitem = 0;
      let totnet = dtVariant[0].item_Price * count - amtdiscitem;
      let subtotal = totnet / 1.11;
      let tax = totnet - subtotal;

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
      console.log('ISI STORE ID: ', storeid[0].value);
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
        0,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        '',
        storeid[0].value,
        0,
        '',
        0,
      );
      await dbconnTrx.AddTrxDtlTemp_savedata(
        db,
        'AddTrxDtlTemp',
        runno,
        formattedDate,
        noitem,
        0,
        count,
        notes,
        dtVariant[0].item_Number,
        dtVariant[0].item_Name,
        dtVariant[0].item_Price,
        dtVariant[0].item_Cost,
        '',
        storeid[0].value,
        0,
        '',
        0,
        0,
        subtotal,
        tax,
      );
      let dataDetail = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      console.log('data detail: ', dataDetail);
      setMdlNonVariant(false);
    } catch (error) {
      console.log(error);
      let msg = 'Terjadi kesalahan, silahkan input ulang kembali';
      msg = error.message;
      CallModalInfo(msg);
    }
  };

  const GetBills = async () => {
    try {
      setTotTender(0);
      setTotChanges('');
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
      // if (discitemtype == 1 || discitemtype == 2) {
      //   console.log('masuk disc item');
      //   CalculateTotalDiscItem();
      // } else {
      //   console.log('masuk disc bills');
      //   CalculateTotal();
      // }
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
      let variantseq = dtVariant[0].lineItem_Option;
      console.log('isi variant choose: ', variantedit);
      let updatedetail = await dbconnTrx.queryselectTrx(
        db,
        `UPDATE AddTrxDtl SET Quantity = ${count}, lineItem_Option = ${variantseq}, variant_Name = '${variantedit}' WHERE Lineitmseq = ${seqTemp}`,
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

  const UpdateItemNonvar = async () => {
    try {
      console.log('isi sequence: ', seqTemp);
      const db = await dbconnTrx.getDBConnection();
      let dtVariant = await dbconn.Variant_getdataChoose(db, 'Variant');
      let variantedit = dtVariant[0].variant_Name;
      console.log('isi variant choose: ', variantedit);
      let updatedetail = await dbconnTrx.queryselectTrx(
        db,
        `UPDATE AddTrxDtl SET Quantity = ${count} WHERE Lineitmseq = ${seqTemp}`,
      );
      let detailUpdate = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      setBills(detailUpdate);
      setMdlEditNonVariant(false);
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
      let query2 = `DELETE FROM AddTrxDtlTemp WHERE Lineitmseq = ${Lineitmseq} `;
      await dbconnTrx.querydynamic(db, query);
      await dbconnTrx.querydynamic(db, query2);
      let CurrentDtl = await dbconnTrx.AddTrxDtl_getdata(db, 'AddTrxDtl');
      setBills(CurrentDtl);
      console.log('ISI DETAIL SETELAH DELETE: ', CurrentDtl);
      CalculateTotal();
    } catch (error) {
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const CalculateTotalDiscItem = async () => {
    try {
      console.log('masuk CalculateTotalDiscItem');
      const db = await dbconnTrx.getDBConnection();
      let qty = await dbconnTrx.queryselectTrx(
        db,
        `SELECT SUM(IFNULL(Item_Price * Quantity, 0)) AS TOTAL, SUM(IFNULL(TOTALNET,0)) AS TOTALNET, SUM(IFNULL(Discount_Amount,0)) AS TOTALDISCITEM, Quantity, (SUM(IFNULL(Item_Price * Quantity, 0)) - SUM(IFNULL(Discount_Amount,0))) / 1.11 AS SUBTOTAL  FROM AddTrxDtlTemp`,
      );
      //let querysum = `SELECT (${nilaidiscitem} * Quantity) AS TOTALDISCITEM FROM AddTrxDtl`;
      // let sumtotal = await dbconnTrx.querydynamic(db, querysum);
      let querytax = await dbconnTrx.queryselectTrx(
        db,
        `SELECT SUM(IFNULL(Item_Price * Quantity, 0)) AS TOTAL, SUM(IFNULL(TOTALNET,0)) AS TOTALNET, (SUM(IFNULL(Item_Price * Quantity, 0)) - SUM(IFNULL(Discount_Amount,0))) / 1.11 AS SUBTOTAL, (SUM(IFNULL(Item_Price * Quantity, 0)) - ((SUM(IFNULL(Item_Price * Quantity, 0)) - SUM(IFNULL(Discount_Amount,0))) / 1.11)) AS totalppn FROM AddTrxDtlTemp`,
      );
      let querytotal = await dbconnTrx.queryselectTrx(
        db,
        `SELECT(${qty[0].TOTAL} - (${qty[0].Quantity} * ${nilaidiscitem})) / 1.11 AS GRANDTOTAL`,
      );
      // let total = await dbconnTrx.querydynamic(db, querytotal);
      console.log('HASIL SUBTOTAL: ', qty[0].SUBTOTAL);
      console.log('HASIL GRANDTOTAL: ', qty[0].TOTAL - qty[0].TOTALDISCITEM);
      // console.log('HASIL SUM TOTAL', sumtotal);
      console.log(
        'HASIL TAX: ',
        qty[0].TOTAL - qty[0].TOTALDISCITEM - qty[0].SUBTOTAL,
      );
      console.log('HASIL DISCOUNT: ', nilaidisc);
      if (querytotal.length == 0) {
        setGrandTotal(0);
      } else {
        const roundedTotal = Math.round(qty[0].TOTAL - qty[0].TOTALDISCITEM);
        setGrandTotal(JSON.stringify(roundedTotal));
      }
      if (querytax.length == 0) {
        setTax(0);
      } else {
        const roundedTotal = Math.round(
          qty[0].TOTAL - qty[0].TOTALDISCITEM - qty[0].SUBTOTAL,
        );
        setTax(JSON.stringify(roundedTotal).split('.')[0]);
      }
      if (qty.length == 0) {
        console.log('haha: ', qty.length);
        setTotal(0);
        setNilaiDiscView(0);
      } else {
        console.log('NILAI DISCOUNT ITEM: ', qty[0].TOTALNET);
        const roundedTotal = Math.round(qty[0].SUBTOTAL);
        const roundedTotal1 = Math.round(qty[0].TOTAL);
        const roundedTotal2 = Math.round(qty[0].TOTALDISCITEM);
        setTotal(JSON.stringify(roundedTotal).split('.')[0]);
        setTotal1(JSON.stringify(roundedTotal1).split('.')[0]);
        setNilaiDiscView(JSON.stringify(roundedTotal2).split('.')[0]);
      }
      // if (querysum.length == 0) {
      //   setNilaiDisc(0);
      // } else {
      //   const roundedTotal = Math.round(querysum[0].TOTALDISCITEM);
      //   console.log('NILAI DISCOUNT ITEM: ', roundedTotal);
      //   setNilaiDisc(JSON.stringify(roundedTotal).split('.')[0]);
      // }
      // console.log('nilai grandtotal: ', grandtotal);
      // console.log('nilai total: ', total);
    } catch (error) {
      console.log('ERROR CALCULATE: ', error.message);
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const CalculateTotal = async () => {
    try {
      const db = await dbconnTrx.getDBConnection();
      let qty = await dbconnTrx.queryselectTrxTemp(
        db,
        `SELECT SUM(IFNULL(Item_Price * Quantity, 0)) TOTALPRICE, SUM(IFNULL(TOTALNET, 0))as GRANDTOTAL, SUM(IFNULL(Discount_Amount, 0)) AS TOTDISC, SUM(IFNULL(SUBTOTAL, 0)) as TOTAL, SUM(IFNULL(TAX, 0)) as tax FROM AddTrxDtlTemp`,
      );
      // let querysum = `SELECT (Item_Price * Quantity) AS TOTALPRICE FROM AddTrxDtl`;
      // let sumtotal = await dbconnTrx.querydynamic(db, querysum);
      // let querytax = await dbconnTrx.queryselectTrx(
      //   db,
      //   `SELECT (${qty[0].TOTAL / 1.11} * 0.11) as totalppn`,
      // );
      // let querytotal = await dbconnTrx.queryselectTrx(
      //   db,
      //   `SELECT (${qty[0].TOTAL / 1.11} + ${
      //     querytax[0].totalppn
      //   }) AS GRANDTOTAL`,
      // );
      // let total = await dbconnTrx.querydynamic(db, querytotal);
      console.log('HASIL TOTAL: ', qty[0].TOTAL);
      console.log('HASIL TOTALPRICE: ', qty[0].TOTALPRICE);
      console.log('HASIL DISCOUNT ITEM: ', qty[0].TOTDISC);
      console.log('HASIL DISCOUNT bills: ', nilaidiscbills);
      console.log('HASIL TAX: ', qty[0].tax);
      console.log('HASIL GRANDTOTAL: ', qty[0].GRANDTOTAL);
      // if (querytotal.length == 0) {
      //   setGrandTotal(0);
      // } else {
      //   const roundedTotal = Math.round(querytotal[0].GRANDTOTAL - nilaidisc);
      //   setGrandTotal(JSON.stringify(roundedTotal));
      // }
      // if (querytax.length == 0) {
      //   setTax(0);
      // } else {
      //   const roundedTotal = Math.round(querytax[0].totalppn);
      //   setTax(JSON.stringify(roundedTotal).split('.')[0]);
      // }

      if (qty.length == 0) {
        console.log('haha: ', qty.length);
        setTotal(0);
        setGrandTotal(0);
        setTax(0);
        setTotal1(0);
        setNilaiDiscView(0);
        setNilaiDisc(0);
      } else {
        const roundedTotal = Math.round(qty[0].TOTAL);
        const resultDisc = Math.abs(qty[0].TOTDISC - nilaidiscbills);
        const roundedTotal1 = Math.round(qty[0].GRANDTOTAL - resultDisc);
        //setTotal(JSON.stringify(roundedTotal).split('.')[0]);
        //setTax(JSON.stringify(qty[0].tax).split('.')[0]);
        setTotal1(JSON.stringify(qty[0].TOTALPRICE).split('.')[0]);
        setNilaiDiscView(JSON.stringify(resultDisc).split('.')[0]);
        setGrandTotalview(JSON.stringify(roundedTotal1).split('.')[0]);
        //setNilaiDisc(JSON.stringify(resultDisc).split('.')[0]);
      }
      // console.log('nilai grandtotal: ', grandtotal);
      // console.log('nilai total: ', total);
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
      AddHdrTemp();
      //setAmtTender([]);
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
      //setAmtTender([]);
      console.log('payment ID, ', paymentid.payment_ID);
      console.log('payment name: ', paymentid.payment_Name);
      console.log('amount tender: ', amounttender);
      let changes = amounttender - grandtotalview;
      let tendertot = amounttender;
      console.log('hasil changes: ', changes);
      setPaymentName(paymentid.payment_Name);
      setPaymentID(paymentid.payment_ID);
      setTotTender(tendertot);
      setChanges(changes);
      handleActivePayment(paymentid.payment_ID);
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const ChangesAll = paymentid => {
    try {
      setAmtTender([]);
      setChanges(0);
      console.log('payment name: ', paymentid.payment_Name);
      console.log('Previous amttendered:', amttendered);
      console.log('isi array amttender:', amttendered);
      let tenderall = grandtotalview;
      let changesall = grandtotalview - grandtotalview;
      const updatedAmtTender = {
        ...amttendered,
        [paymentid.payment_ID]: tenderall,
      };
      setAmtTender(updatedAmtTender);
      setTotTender(tenderall);
      setTotChanges(changesall);
      setPaymentName(paymentid.payment_Name);
      setPaymentID(paymentid.payment_ID);
      console.log('TOTAL TENDER ALL: ', tenderall);
      console.log('New amttendered:', amttendered);
      handleActivePayment(paymentid.payment_ID);
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const handleActivePayment = paymentID => {
    // Clear any previously active payment ID
    if (activePaymentID && activePaymentID !== paymentID) {
      setAmtTender(prevState => ({
        ...prevState,
        [activePaymentID]: '',
      }));
    }
    setActivePaymentID(paymentID);
  };

  const SyncPayment = async payment_Name => {
    try {
      console.log('payment name: ', payment_Name);
      let getbills = [];
      console.log('isi tot tender: ', tottender);
      if (tottender == 0) {
        console.log('MASUK KONDISI A');
        let msg = 'Nominal Pembayaran tidak sesuai, mohon diperiksa kembali';
        CallModalInfo(msg);
      } else if (tottender < 0) {
        console.log('MASUK KONDISI B');
        let msg = 'Nominal Pembayaran tidak sesuai, mohon diperiksa kembali';
        CallModalInfo(msg);
      } else if (Number(tottender) < grandtotal) {
        console.log('GRAND TOTAL: ', grandtotal);
        console.log('TOTTENDER: ', tottender);
        console.log('MASUK KONDISI C');
        let msg = 'Nominal Pembayaran tidak sesuai, mohon diperiksa kembali';
        CallModalInfo(msg);
      } else {
        const db = await dbconnTrx.getDBConnection();
        getbills = await dbconnTrx.AddTrxDtl_getdataPrint(
          db,
          'AddTrxDtl',
          runno,
        );
        console.log('DATA YANG MAU DI PRINT: ', getbills);
        setDataPrint(getbills);
        console.log('ISI DATA PRINT: ', dataprint);
        SyncUpFinal(payment_Name);
      }
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const AddHdrTemp = async () => {
    try {
      const db = await dbconnTrx.getDBConnection();
      let qty = await dbconnTrx.queryselectTrxTemp(
        db,
        `SELECT SUM(IFNULL(Item_Price * Quantity, 0)) TOTALPRICE, SUM(IFNULL(TOTALNET, 0) - IFNULL(Discount_Amount, 0)) as GRANDTOTAL, SUM(IFNULL(Discount_Amount, 0)) AS TOTDISC, SUM(IFNULL(SUBTOTAL, 0)) as TOTAL, SUM(IFNULL(TAX, 0)) as tax FROM AddTrxDtlTemp`,
      );
      let grandtotal = Math.round(qty[0].TOTALPRICE - nilaidiscview);
      let subtotal = Math.round(grandtotal / 1.11);
      let taxtotal = Math.round(grandtotal - subtotal);
      let disctotal = Math.round(nilaidiscview);

      console.log('HASIL SUBTOTAL: ', subtotal);
      console.log('HASIL TOTAL DISCOUNT: ', disctotal);
      console.log('HASIL TAX: ', taxtotal);
      console.log('HASIL GRANDTOTAL: ', grandtotal);
      const dbtrxhdr = await dbhdr.getDBConnection();
      await dbhdr.AddTrxHdrTemp_savedata(
        dbtrxhdr,
        'AddTrxHdrTemp',
        runno,
        qty[0].GRANDTOTAL,
        subtotal,
        taxtotal,
        discid,
        disctotal,
      );
      setTotal(subtotal);
      setGrandTotal(grandtotal);
      setTax(taxtotal);
      setNilaiDisc(disctotal);
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const GetStorename = async () => {
    try {
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      let alamat = datauser[0].alamat;
      let namatoko = datauser[0].namatoko;
      setAlamatToko(alamat[0].alamat);
      setNamaToko(namatoko[0].label);
      console.log('alamat: ', alamattoko);
      console.log('nama toko: ', namatoko1);
    } catch (error) {
      console.log(error);
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format hours, minutes, and seconds to ensure they are always displayed with two digits
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedtime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    setCurrentTime(formattedtime);
    console.log('time sekarang: ', currenttime);
    // Return the formatted time as a string

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const SyncUpFinal = async payment_Name => {
    try {
      let countdtl = [];
      const db = await dbconnTrx.getDBConnection();
      const dbshiftdtl = await dbshift.getDBConnection();
      const dbtrxhdr = await dbhdr.getDBConnection();
      console.log('masuk kondisi else');
      setTotTender(0);
      //setTotChanges('');
      setGrandTotal('');
      setChanges('');
      const today = new Date();
      // Get various parts of the date
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // Months are zero-indexed
      const day = today.getDate();
      const formattedDate = `${month}/${day}/${year}`;
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      var userid = datauser[0].userid;
      var storeid = datauser[0].store_ID;
      console.log('STORE ID: ', storeid[0].value);
      countdtl = await dbconnTrx.AddTrxDtl_getdataBillsCount(
        db,
        'AddTrxDtl',
        runno,
      );
      var totline = countdtl[0].TOTALDETAIL;
      console.log('total detail count: ', totline);
      setTotDetail(totline);
      let detail = await dbconnTrx.AddTrxDtl_getdataBillsDetails(
        db,
        `AddTrxDtl`,
        runno,
      );
      let shiftdtl = await dbshift.ShiftDetail_getdataSum(
        dbshiftdtl,
        'ShiftDetail',
        formattedDate,
        0,
      );
      console.log('total detail : ', detail);
      console.log('batch id: ', shiftdtl[0].Batch_ID);
      await dbhdr.AddTrxHdr_savedata(
        dbtrxhdr,
        'AddTrxHdr',
        userid,
        runno,
        formattedDate,
        storeid[0].value,
        salesid,
        custname,
        totline,
        grandtotal,
        total,
        tax,
        nilaidisc,
        tottender,
        changes,
        shiftdtl[0].Batch_ID,
        paymentID,
        payment_Name,
      );
      let gethdr = await dbhdr.AddTrxHdr_getdata(dbtrxhdr, 'AddTrxHdr');
      console.log('HASIL GET HDR: ', gethdr);
      syncup({
        UserID: userid,
        DOCNUMBER: runno,
        DOCTYPE: 1,
        DOCDATE: formattedDate,
        Store_ID: storeid[0].value,
        Site_ID: '',
        SalesType_ID: salesid,
        CustName: custname,
        Total_Line_Item: totline,
        ORIGTOTAL: grandtotal,
        SUBTOTAL: total,
        Tax_Amount: tax,
        Discount_ID: discid,
        Discount_Amount: nilaidisc,
        Amount_Tendered: tottender,
        Change_Amount: changes,
        Batch_ID: shiftdtl[0].Batch_ID,
        POS_Device_ID: '',
        POS_Version: '',
        SyncStatus: 0,
        Payment_ID: paymentID,
        Payment_Type: paymentID,
        Lnitmseq: 0,
        TrxDetailTYPE: detail,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil syncup ', hasil.code);
        if (hasil.code == 400) {
          console.log('error 400');
          setMdlPayment(false);
          CallModalInfo(hasil.desc);
        } else if (hasil[0].code == 200) {
          setMdlPayment(false);
          PostCloseShift();
          //PrintStruk();
          //handleBackButtonClick();
        }
        //console.log('HASIL GET VARIANT', hasil);
      });
    } catch (error) {
      let msg = error.message;
      console.log(error);
      CallModalInfo(msg);
    }
  };

  const PostCloseShift = async () => {
    try {
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
      //const db = await dbconn.getDBConnection();
      const dbshiftdtl = await dbshift.getDBConnection();
      let datashift = await dbshift.ShiftDetail_getdataSum(
        dbshiftdtl,
        'ShiftDetail',
        formattedDate,
        0,
      );
      closeshift({
        Batch_ID: datashift[0].Batch_ID,
        Lineitmseq: 0,
        Payment_ID: paymentID,
        Payment_Type: paymentName,
        Amount_Opening: grandtotal,
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        console.log('hasil return post openshift: ', hasil);
        PostSummaryShiftClosing(grandtotal);
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
      const db = await dbshift.getDBConnection();
      const dbtrxhdr = await dbhdr.getDBConnection();
      //const dbtrx = await dbconnTrx.getDBConnection();
      let datashift = await dbshift.ShiftDetail_getdataSum(
        db,
        'ShiftDetail',
        formattedDate,
      );
      let datahdrtemp = await dbhdr.queryselectTrx(
        dbtrxhdr,
        `SELECT SUM(IFNULL(Discount_Amount, 0)) as TOTALDISCOUNT FROM AddTrxHdrTemp`,
      );
      let Opening_Date = datashift[0].Opening_Date;
      console.log('opening date: ', Opening_Date);
      console.log('NILAI DISCOUNT BEFORE SUMMARY SHIFT: ', nilaidisc);
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
        Sum_Amount_Discount: datahdrtemp[0].TOTALDISCOUNT,
        Sum_Amount_Tax: 0,
        Sum_Invoice_Refund_Posted: 0,
        Sum_Amount_PayOut: 0,
        Sum_Amount_PayIn: 0,
        Count_Customers: 0,
        Status_Batch: 0,
        UserID: userid,
      }).then(async result => {
        var hasil = result.data;
        PrintStruk();
      });
    } catch (error) {
      let msg = error;
      CallModalInfo(msg);
    }
  };

  const PrintStruk = async () => {
    let columnWidths = [20, 3, 17, 8];
    let columnWidthsVAR = [20, 3, 17, 8];
    let columnWidths2 = [15, 25, 8];
    const db = await dbconnTrx.getDBConnection();
    let getbills = [];
    const today = new Date();
    // Get various parts of the date
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-indexed
    const day = today.getDate();
    const formattedDate = `${month}/${day}/${year}`;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // Format hours, minutes, and seconds to ensure they are always displayed with two digits
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedtime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    try {
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [namatoko1],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [alamattoko],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [formattedDate, formattedtime],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Receipt Numbers', runno],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Customer Name', custname],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [salesname],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      getbills = await dbconnTrx.AddTrxDtl_getdataPrint(db, 'AddTrxDtl', runno);
      try {
        let alignments = [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ];
        const variantAlignments = [
          // Separate alignments for variant line
          BluetoothEscposPrinter.ALIGN.LEFT, // Adjust for variant alignment if needed
          BluetoothEscposPrinter.ALIGN.LEFT, // Adjust for variant alignment if needed
          BluetoothEscposPrinter.ALIGN.RIGHT, // Align with description column
          BluetoothEscposPrinter.ALIGN.RIGHT, // Align with description column
        ];
        for (let row of getbills) {
          const formattedPrice = `${Intl.NumberFormat('id-ID').format(
            row.Item_Price,
          )}`;
          const currency = `Rp.`;
          const printData = [
            row.Item_Description,
            `${row.Quantity}x`,
            currency,
            formattedPrice,
          ];
          // Adjust alignment for variant line if needed
          console.log('Print Data:', printData);
          await BluetoothEscposPrinter.printColumn(
            columnWidths,
            alignments,
            printData,
            {},
          );
          await BluetoothEscposPrinter.printColumn(
            columnWidthsVAR,
            variantAlignments,
            [row.variant_Name, '', '', ''],
            {},
          );
        }
      } catch (error) {
        console.error('Error printing: ', error);
      }
      await BluetoothEscposPrinter.printText('\n', {});
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Discount', 'Rp.', Intl.NumberFormat('id-ID').format(nilaidiscview)],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Total', 'Rp.', Intl.NumberFormat('id-ID').format(total1)],
        {},
      );
      // await BluetoothEscposPrinter.printColumn(
      //   columnWidths2,
      //   [
      //     BluetoothEscposPrinter.ALIGN.LEFT,
      //     BluetoothEscposPrinter.ALIGN.RIGHT,
      //     BluetoothEscposPrinter.ALIGN.RIGHT,
      //   ],
      //   ['PPN 11%', 'Rp.', Intl.NumberFormat('id-ID').format(tax)],
      //   {},
      // );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          'Grand Total',
          'Rp.',
          Intl.NumberFormat('id-ID').format(grandtotalview),
        ],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [paymentName, 'Rp.', Intl.NumberFormat('id-ID').format(tottender)],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Changes', 'Rp.', Intl.NumberFormat('id-ID').format(changes)],
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['THANK YOU'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Barang yang sudah dibeli dapat ditukar'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['jika sesuai dengan kondisi awal dan '],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['MAX 2 hari dari tanggal pembelian'],
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      handleBackButtonClick();
    } catch (e) {
      Alert(e.message || 'ERROR');
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

  const handleButtonPress = (
    itemNumber,
    flag,
    lineItemVariant,
    lineItemOption,
    index,
  ) => {
    setSelectedButtonIndex(index === selectedButtonIndex ? null : index); // Toggle selection on every click
    UpdateDataList(itemNumber, flag, lineItemVariant, lineItemOption);
  };

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

  const CancelPayment = async () => {
    setChanges(0);
    setAmtTender([]);
    setMdlPayment(false);
  };

  GetlistAfterUpdateVar = async () => {
    const db = await dbconn.getDBConnection();
    let dtVariant = await dbconn.Variant_getdata(db, 'Variant');
    setVariant(dtVariant);
  };

  //#endregion

  //#region //* EVENT

  const viewModalVariant = async (isVarian, price) => {
    if (isVarian == 0) {
      console.log('masuk view non variant');
      viewModalnonVariant(isVarian, price);
    } else {
      setMdlVariant(true);
    }
  };

  const viewModalnonVariant = async (isVarian, price) => {
    setMdlNonVariant(true);
  };

  const viewModalEditNonVariant = async Lineitmseq => {
    setSeqTemp(Lineitmseq);
    console.log('SEQUENCE: ', seqTemp);
    setMdlEditNonVariant(true);
  };

  const viewModalEditVariant = async (Lineitmseq, isVarian) => {
    if (isVarian == 0) {
      setSeqTemp(Lineitmseq);
      viewModalnonVariant();
    } else {
      setSeqTemp(Lineitmseq);
      console.log('SEQUENCE: ', seqTemp);
      setMdlEditVariant(true);
    }
  };

  const viewModalBills = async () => {
    setMdlBills(true);
  };

  function handleBackButtonClick() {
    navigation.replace('Home');
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
    <SafeAreaView style={{flex: 1, width: '100%', height: '100%'}}>
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
                  value={custname}
                  onChangeText={text => setCustName(text)}
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
                      {paymentType.payment_Name === 'CASH' ||
                      paymentType.amount !== 0 ? (
                        <View style={globalStyles.kanan2}>
                          <TextInput
                            style={[
                              globalStyles.textinputpayment,
                              {
                                backgroundColor: colors.card,
                                color: colors.text,
                              },
                            ]}
                            maxLength={100}
                            keyboardType="numeric"
                            value={amttendered[paymentType.payment_ID] || ''}
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
                                amttendered[`${paymentType.payment_ID}`] ||
                                  paymentType.amount.toString(),
                              );
                            }}
                          />
                          {amttendered.length > 0 && (
                            <View style={globalStyles.kanan2}>
                              {amttendered.map((amt, index) => (
                                <TextInput
                                  key={index} // Add a unique key for each input
                                  editable={false}
                                  style={[
                                    globalStyles.textinputpayment,
                                    {
                                      backgroundColor: '#F5F5F5',
                                      color: colors.text,
                                    },
                                  ]}
                                  maxLength={100}
                                  keyboardType="numeric"
                                  value={amt || ''}
                                />
                              ))}
                              {paymentType.payment_Name !== 'CASH' ? ( // Only show "All" for non-CASH payments
                                <TouchableOpacity
                                  style={[
                                    globalStyles.buttonAll,
                                    {opacity: amttendered.length > 0 ? 0.5 : 1},
                                  ]}
                                  disabled={amttendered.length > 0}>
                                  <Text style={globalStyles.textStyle}>
                                    All
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  style={[globalStyles.buttonAll]}
                                  onPress={() => ChangesAll(paymentType)}>
                                  <Text style={globalStyles.textStyle}>
                                    All
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={globalStyles.kanan2}>
                          <TextInput
                            editable={false}
                            style={[
                              globalStyles.textinputpayment,
                              {
                                backgroundColor: '#f5f5f5',
                                color: colors.text,
                              },
                            ]}
                            maxLength={100}
                            keyboardType="numeric"
                            value={amttendered[paymentType.payment_ID] || ''}
                          />
                          <TouchableOpacity
                            style={[globalStyles.buttonAll]}
                            onPress={() => ChangesAll(paymentType)}>
                            <Text style={globalStyles.textStyle}>All</Text>
                          </TouchableOpacity>
                        </View>
                      )}
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
                    value={Intl.NumberFormat('id-ID').format(grandtotalview)}
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
                    value={Intl.NumberFormat('id-ID').format(tottender)}
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
                    value={Intl.NumberFormat('id-ID').format(changes)}
                    //onChangeText={text => setPassword(text)}
                  />
                </View>
              </SafeAreaView>
              <View style={globalStyles.ButtonPayment}>
                <SafeAreaView style={[invrecStyles.buttontotalan]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonNoPayment]}
                    onPress={() => CancelPayment()}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    onPress={() => SyncPayment(paymentName)}>
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
                <Text style={globalStyles.modalText}>{itemdescvar}</Text>
              </View>
              <Text style={globalStyles.TextHeaderVariant}>{itemdescvar}</Text>
              <ScrollView
                style={globalStyles.InputVariant}
                nestedScrollEnabled={true}>
                {/* //* VARIANT*/}
                <View style={[invrecStyles.inputantotalan]}>
                  {variant.map((variant, index) => {
                    return (
                      <View key={index} style={globalStyles.inputtotalan}>
                        <TouchableOpacity
                          style={[
                            globalStyles.buttonSubmitFlag,
                            selectedButtonIndex !== null &&
                              index !== selectedButtonIndex &&
                              globalStyles.disabledButton,
                          ]}
                          onPress={() =>
                            handleButtonPress(
                              variant.item_Number,
                              variant.flag,
                              variant.lineItem_Variant,
                              variant.lineItem_Option,
                              index,
                            )
                          }
                          disabled={
                            selectedButtonIndex !== null &&
                            index !== selectedButtonIndex
                          } // Disable based on selectedButtonIndex
                        >
                          <Text style={globalStyles.textFlag}>
                            {variant.variant_Name}
                          </Text>
                          <Text style={globalStyles.textFlag2}>
                            {variant.item_Price}
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
                      value={notes}
                      onChangeText={text => setNotes(text)}
                    />
                  </View>
                </SafeAreaView>
                <View
                  style={{
                    //marginRight: 0,
                    //marginTop: 5,
                    bottom: 40,
                    width: '100%',
                    borderWidth: 1,
                  }}>
                  <Picker
                    selectedValue={selectedDiscountitem}
                    onValueChange={handleDiscountItem}>
                    {filteredDiscItem.map(item => (
                      <Picker.Item
                        key={item.discount_ID}
                        label={`${item.discount_Name}`}
                        // Use name as the value, but you could use any unique identifier
                        value={item.discount_ID}
                      />
                    ))}
                  </Picker>
                </View>
                <SafeAreaView style={[invrecStyles.inputanqty]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYMinus]}
                    onPress={handleDecrement}>
                    <Text style={globalStyles.textNo}> - </Text>
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
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYPlus]}
                    onPress={handleIncrement}>
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
                <Text style={globalStyles.modalText}>{itemdescvar}</Text>
              </View>
              <Text style={globalStyles.TextHeaderVariant}>{itemdescvar}</Text>
              <ScrollView
                style={globalStyles.InputVariant}
                nestedScrollEnabled={true}>
                {/* //* VARIANT*/}
                <View style={[invrecStyles.inputantotalan]}>
                  {variant.map((variant, index) => {
                    return (
                      <View key={index} style={globalStyles.inputtotalan}>
                        <TouchableOpacity
                          style={[
                            globalStyles.buttonSubmitFlag,
                            selectedButtonIndex !== null &&
                              index !== selectedButtonIndex &&
                              globalStyles.disabledButton,
                          ]}
                          onPress={() =>
                            handleButtonPress(
                              variant.item_Number,
                              variant.flag,
                              variant.lineItem_Variant,
                              variant.lineItem_Option,
                              index,
                            )
                          }
                          disabled={
                            selectedButtonIndex !== null &&
                            index !== selectedButtonIndex
                          } // Disable based on selectedButtonIndex
                        >
                          <Text style={globalStyles.textFlag}>
                            {variant.variant_Name}
                          </Text>
                          <Text style={globalStyles.textFlag2}>
                            {variant.item_Price}
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
                      value={notes}
                    />
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputanqty]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYMinus]}
                    onPress={handleDecrement}>
                    <Text style={globalStyles.textNo}> - </Text>
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
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYPlus]}
                    onPress={handleIncrement}>
                    <Text style={globalStyles.textNo}> + </Text>
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
        {/* //* MODAL NON VARIANT */}
        <Modal animationType="fade" transparent={true} visible={mdlnonVariant}>
          <View style={globalStyles.centeredViewPayment}>
            <View style={globalStyles.modalViewPayment}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>{itemdescvar}</Text>
              </View>
              <Text style={globalStyles.TextHeaderVariant}></Text>
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
                      onChangeText={text => setNotes(text)}
                    />
                  </View>
                </SafeAreaView>
                <SafeAreaView style={[invrecStyles.inputanqty]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYMinus]}
                    onPress={handleDecrement}>
                    <Text style={globalStyles.textNo}> - </Text>
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
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYPlus]}
                    onPress={handleIncrement}>
                    <Text style={globalStyles.textNo}> + </Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
              <View style={globalStyles.ButtonPayment}>
                <SafeAreaView style={[invrecStyles.buttontotalan]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonNoPayment]}
                    onPress={() => setMdlNonVariant(!mdlnonVariant)}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    onPress={() => {
                      AddItemTempNonvar();
                    }}>
                    <Text style={globalStyles.textStyle}>Add Item</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL NON VARIANT */}
        {/* //* MODAL EDIT NON VARIANT */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={mdlEditNonVariant}>
          <View style={globalStyles.centeredViewPayment}>
            <View style={globalStyles.modalViewPayment}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>{itemdescvar}</Text>
              </View>
              <Text style={globalStyles.TextHeaderVariant}></Text>
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
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYMinus]}
                    onPress={handleDecrement}>
                    <Text style={globalStyles.textNo}> - </Text>
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
                  <TouchableOpacity
                    style={[globalStyles.buttonQTYPlus]}
                    onPress={handleIncrement}>
                    <Text style={globalStyles.textNo}> + </Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
              <View style={globalStyles.ButtonPayment}>
                <SafeAreaView style={[invrecStyles.buttontotalan]}>
                  <TouchableOpacity
                    style={[globalStyles.buttonNoPayment]}
                    onPress={() => setMdlEditNonVariant(!mdlEditNonVariant)}>
                    <Text style={globalStyles.textNo}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[globalStyles.buttonYesPayment]}
                    onPress={() => {
                      UpdateItemNonvar(variant.Lineitmseq);
                    }}>
                    <Text style={globalStyles.textStyle}>Edit Item</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </View>
          </View>
        </Modal>
        {/* //* MODAL EDIT NON VARIANT */}
        {/* //* MODAL BILLS */}
        <Modal animationType="fade" transparent={true} visible={mdlBills}>
          <View style={globalStyles.centeredViewPayment}>
            <View
              style={globalStyles.modalViewBills}
              nestedScrollEnabled={true}>
              <View style={globalStyles.modalheader}>
                <Text style={globalStyles.modalText}>Invoice</Text>
              </View>
              <Text style={globalStyles.TextHeaderBills}>{salesname}</Text>
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
                                viewModalEditVariant(
                                  bills.Lineitmseq,
                                  bills.isVarian,
                                );
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
                {filteredDiscBills.map((discount, index) => {
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
                          value={selectedDiscount === discount.discount_ID}
                          onValueChange={() => handleDiscountChange(discount)}
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
                      {/* Rp {total.toLocaleString('id-ID')} */}
                      Rp {Intl.NumberFormat('id-ID').format(total1)}
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
                      Rp {Intl.NumberFormat('id-ID').format(nilaidiscview)}
                    </Text>
                  </View>
                </SafeAreaView>
                {/* <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
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
                      Rp {Intl.NumberFormat('id-ID').format(tax)}
                    </Text>
                  </View>
                </SafeAreaView> */}
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
                      Rp {Intl.NumberFormat('id-ID').format(grandtotalview)}
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
        <View>
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
              dropDownStyle={{maxHeight: 500}}
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
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 5,
                //height: '100%',
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
        </View>
        {/* //* CONTENT */}
        {/* //* FOOTER */}
        {/* //* FOOTER */}
      </SafeAreaView>
    </SafeAreaView>
  );
}
