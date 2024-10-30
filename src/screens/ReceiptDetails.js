import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
  PermissionsAndroid,
  LogBox,
} from 'react-native';
import {useTheme, useRoute, useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import {getsalestype} from '../api/getsalestype';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {globalStyles, invrecStyles} from '../css/global';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getstore} from '../api/getstore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {gettrxhist} from '../api/gettrxhist';
import * as dbconn from '../db/TrxHist';
import * as dbconnTrx from '../db/TrxHistDtl';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';

const Receipts = () => {
  const colors = useTheme().colors;
  const increment = useRef(null);
  const navigation = useNavigation();
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [isDateFromPickerVisible, setDateFromPickerVisibility] =
    useState(false);
  const [isDateToPickerVisible, setDateToPickerVisibility] = useState(false);
  const [mdlDiscount, setMdlDiscount] = useState(false);
  const [salesType, setSalesType] = useState('');
  const [salesTypes, setSalesTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [itemdetail, setItemdetail] = useState([]);
  const [mdlDetail, setModaldetail] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [docnumber, setDocnumber] = useState('');
  const [totaltrx, setTotaltrx] = useState(0);
  const [employee, setEmployee] = useState('');
  const [tipesales, setTipesales] = useState('');
  const [trxdate, setTrxDate] = useState('');
  const [trxtime, setTrxtime] = useState('');
  const [tottax, setTotTax] = useState(0);
  const [paymentName, setPaymentName] = useState('');
  const [changes, setChanges] = useState(0);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [boundAddress, setBoundAddress] = useState('');
  const [bleOpend, setBleOpend] = useState(false);
  const [dataprint, setDataPrint] = useState([]);
  const [loading, setLoading] = useState(true);
  const [namatoko1, setNamaToko] = useState('');
  const [namapos, setNamaPos] = useState('');
  const [alamattoko, setAlamatToko] = useState('');
  const [runno, setRunno] = useState('');
  const [custname, setCustName] = useState('');
  const [variantname, setVariantName] = useState('');
  const [itemprice, setItemPrice] = useState(0);
  const [discId, setDiscID] = useState('');
  const [discamt, setDiscAmt] = useState(0);
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
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    GetStorename();
    GetSalesType();
    LOADTBLHIST();
    //setModaldetail(true);
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

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

  const LOADTBLHIST = async () => {
    try {
      const db = await dbconn.getDBConnection();
      const dbdtl = await dbconnTrx.getDBConnection();
      await dbconnTrx.TrxHistDtl_CreateTbl(dbdtl, 'TrxHistDtl');
      await dbconn.TrxHist_CreateTbl(db, 'TrxHist');
      await dbconn.deletedataAllTbl(db, 'TrxHist');
    } catch (error) {
      console.error(error);
    }
  };

  const GetStorename = async () => {
    try {
      let datauser = await AsyncStorage.getItem('@dtUser');
      datauser = JSON.parse(datauser);
      let alamat = datauser[0].alamat;
      let namatoko = datauser[0].namatoko;
      let posname = datauser[0].namapos;
      let alamat1 = alamat[0].alamat;
      let namatokodesc = namatoko[0].label;
      let namapos = posname[0].devicename;
      setAlamatToko(alamat1);
      setNamaToko(namatokodesc);
      setNamaPos(namapos);
      console.log('namapos: ', namapos);
      //console.log('nama toko: ', namatoko1);
    } catch (error) {
      console.log(msg);
      let msg = error.message;
    }
  };

  const GetSalesType = async () => {
    try {
      getsalestype({
        interid: '',
        ID: '',
      }).then(async result => {
        var hasil = result.data;
        console.log('return sales type: ', hasil);
        setSalesTypes(hasil);
        setSalesType(hasil[0]?.salesType_ID || '');
        //setSalesName(param_salesname);
        //console.log('TIPE SALES: ', salesname);
      });
    } catch (error) {
      let msg = error.message;
      //(msg);
    }
  };

  const GetHistoryTrxHDR = async () => {
    try {
      const db = await dbconn.getDBConnection();
      const fromdate = format(new Date(dateFrom), 'yyyy-MM-dd');
      const todate = format(new Date(dateTo), 'yyyy-MM-dd');
      gettrxhist({
        DOCNUMBER: '',
        DateFrom: fromdate,
        DateTo: todate,
        SalesType_ID: salesType,
        Search: '',
      }).then(async result => {
        let dtTrxHisthdr = [];
        var hasil = result.data;
        await dbconn.deletedataAllTbl(db, 'TrxHist');
        await dbconn.TrxHist_savedata(db, 'TrxHist', hasil);
        dtTrxHisthdr = await dbconn.TrxHist_getdataHDR(db, 'TrxHist');
        console.log('hasil get hist hdr: ', dtTrxHisthdr);
        setReceipts(dtTrxHisthdr);
      });
    } catch (error) {
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const GetHistoryTrxDTL = async item => {
    try {
      setModaldetail(true);
      const dbdtl = await dbconnTrx.getDBConnection();
      const fromdate = format(new Date(dateFrom), 'yyyy-MM-dd');
      const todate = format(new Date(dateTo), 'yyyy-MM-dd');
      setRunno(item.docnumber);
      gettrxhist({
        DOCNUMBER: item.docnumber,
        DateFrom: fromdate,
        DateTo: todate,
        SalesType_ID: salesType,
        Search: '',
      }).then(async result => {
        setItemdetail([]);
        let dtTrxHistdtl = [];
        let dtlitem = [];
        let abcd = [];
        var hasil = result.data;
        console.log('log return detail: ', hasil);
        await dbconnTrx.deletedataAllTbl(dbdtl, 'TrxHistDtl');
        await dbconnTrx.TrxHistDtl_savedata(dbdtl, 'TrxHistDtl', hasil);
        dtTrxHistdtl = await dbconnTrx.TrxHistDtl_getdataDTL(
          dbdtl,
          'TrxHistDtl',
          item.docnumber,
        );
        dtlitem = await dbconnTrx.TrxHistDtl_getdataItemDtl(
          dbdtl,
          'TrxHistDtl',
          item.docnumber,
        );
        console.log('hasil get hist dtl: ', dtlitem);
        setItemdetail(dtlitem);
        setItemPrice(dtTrxHistdtl[0].item_Price);
        setVariantName(dtTrxHistdtl[0].variant_Name);
        setCustName(dtTrxHistdtl[0].custName);
        setDocnumber(dtTrxHistdtl[0].docnumber);
        setTrxDate(dtTrxHistdtl[0].formatted_date);
        setTrxtime(dtTrxHistdtl[0].formatted_datetime);
        setTipesales(dtTrxHistdtl[0].salesType_Name);
        setTotaltrx(dtTrxHistdtl[0].origtotal);
        setEmployee(dtTrxHistdtl[0].userName);
        setTotTax(dtTrxHistdtl[0].tax_Amount);
        setPaymentName(dtTrxHistdtl[0].payment_Name);
        setChanges(dtTrxHistdtl[0].change_Amount);
        setDiscID(dtTrxHistdtl[0].discount_ID);
        setDiscAmt(dtlitem[0].discount_Amount);
      });
    } catch (error) {
      let msg = error.message;
      CallModalInfo(msg);
    }
  };

  const PrintStruk = async () => {
    let columnWidths = [20, 3, 17, 8];
    let columnWidthsVAR = [20, 3, 17, 8];
    let columnWidths2 = [15, 25, 8];
    const dbdtl = await dbconnTrx.getDBConnection();
    let getbills = [];
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
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['Reprint'],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [trxdate, trxtime],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Receipt Numbers', docnumber],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Customer Name', custname],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [24, 24],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ['Employee Name', employee],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [32],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        [tipesales],
        {},
      );
      await BluetoothEscposPrinter.printText(
        '================================================',
        {},
      );
      getbills = await dbconnTrx.TrxHistDtl_getdataItemDtl(
        dbdtl,
        'TrxHistDtl',
        docnumber,
      );
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
            row.item_Price,
          )}`;
          const currency = `Rp.`;
          const printData = [
            row.item_Description,
            `${row.quantity}x`,
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
        ['Discount', 'Rp.', Intl.NumberFormat('id-ID').format(discamt)],
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
        ['Total', 'Rp.', Intl.NumberFormat('id-ID').format(totaltrx)],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['PPN 11%', 'Rp.', Intl.NumberFormat('id-ID').format(tottax)],
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
        ['Grand Total', 'Rp.', Intl.NumberFormat('id-ID').format(totaltrx)],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [paymentName, 'Rp.', Intl.NumberFormat('id-ID').format(totaltrx)],
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
        ['Barang yang sudah dibeli tidak dapat ditukar'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['atau dikembalikan'],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.CENTER],
        ['(kecuali ada perjanjian).'],
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      setModaldetail(false);
    } catch (e) {
      Alert(e.message || 'ERROR');
    }
  };

  function handleBackButtonClick() {
    navigation.replace('Home');
    return true;
  }

  function HideModalDiscount() {
    setMdlDiscount(false);
  }

  const showDateFromPicker = () => {
    setDateFromPickerVisibility(true);
  };

  const hideDateFromPicker = () => {
    setDateFromPickerVisibility(false);
  };

  const handleDateFromConfirm = date => {
    setDateFrom(date);
    hideDateFromPicker();
  };

  const showDateToPicker = () => {
    setDateToPickerVisibility(true);
  };

  const hideDateToPicker = () => {
    setDateToPickerVisibility(false);
  };

  const handleDateToConfirm = date => {
    setDateTo(date);
    hideDateToPicker();
  };

  const openModal = receipt => {
    setSelectedReceipt(receipt);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReceipt(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* //* MODAL BILLS */}
      <Modal animationType="fade" transparent={true} visible={mdlDetail}>
        <View style={globalStyles.centeredViewPayment}>
          <View style={globalStyles.modalViewBills} nestedScrollEnabled={true}>
            <View style={globalStyles.modalheader}>
              <Text style={globalStyles.modalText}>Receipt Details</Text>
            </View>
            <SafeAreaView style={globalStyles.InputDetailhist}>
              <SafeAreaView style={[invrecStyles.inputantotalanreceiptdetails]}>
                <View style={globalStyles.labelinputtotalanreceiptdtls}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    {docnumber}
                  </Text>
                </View>
              </SafeAreaView>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                <View style={globalStyles.labelinputtotalanreceiptdtls2}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    {trxdate}
                  </Text>
                </View>
              </SafeAreaView>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                <View style={globalStyles.labelinputtotalanreceiptdtls3}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    {trxtime}
                  </Text>
                </View>
              </SafeAreaView>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
                <View style={globalStyles.labelinputtotalanreceiptdtls4}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    RP. {Intl.NumberFormat('id-ID').format(totaltrx)}
                  </Text>
                </View>
              </SafeAreaView>
            </SafeAreaView>
            <SafeAreaView style={globalStyles.InputDetailhist2}>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2new1]}>
                <View style={globalStyles.labelinputtotalanbillsdisc}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    Employee:
                  </Text>
                </View>
                <View style={globalStyles.kanan2}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    {employee}
                  </Text>
                </View>
              </SafeAreaView>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2new2]}>
                <View style={globalStyles.labelinputtotalanbillsdisc}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    POS:
                  </Text>
                </View>
                <View style={globalStyles.kanan2}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    {namapos}
                  </Text>
                </View>
              </SafeAreaView>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2new3]}>
                <View style={globalStyles.labelinputtotalanbillsdisc}>
                  <Text
                    style={[
                      invrecStyles.labeldetailshistdocnumber,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    {tipesales}
                  </Text>
                </View>
              </SafeAreaView>
            </SafeAreaView>
            <ScrollView
              style={globalStyles.Inputreceiptdetails}
              nestedScrollEnabled={true}>
              {/* //* BILLS*/}
              <View style={[invrecStyles.inputantotalanbillskiri]}>
                {itemdetail.map((itemdetail, index) => {
                  return (
                    <View key={index} style={globalStyles.cartlist2}>
                      <View style={globalStyles.kiri2}>
                        <View style={globalStyles.itemreceiptdtls}>
                          <Text
                            style={[
                              invrecStyles.labelinputbills,
                              {
                                backgroundColor: colors.card,
                                color: colors.text,
                              },
                            ]}>
                            {itemdetail.item_Description}
                          </Text>
                          <Text
                            style={[
                              invrecStyles.labelinputbills,
                              {
                                backgroundColor: colors.card,
                                color: colors.text,
                              },
                            ]}>
                            x{itemdetail.quantity}
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
                          {itemdetail.variant_Name}
                        </Text>
                      </View>
                      <View style={globalStyles.kanan2}>
                        {/* <TouchableOpacity
                          style={{position: 'absolute', right: 0}}
                          onPress={() => DeleteItem(bills.Lineitmseq)}>
                          <Text style={invrecStyles.labelrightdatalist}>
                            Hapus
                          </Text>
                        </TouchableOpacity> */}
                        <Text
                          style={[
                            invrecStyles.labelinputbills,
                            {
                              backgroundColor: colors.card,
                              color: colors.text,
                            },
                          ]}>
                          {itemdetail.item_Price}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              {/* //* BILLS*/}
            </ScrollView>
            <ScrollView style={globalStyles.Inputreceiptdisc}>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2new]}>
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
                    {/* Rp {total.toLocaleString('id-ID')} */}
                    Rp {Intl.NumberFormat('id-ID').format(discamt)}
                  </Text>
                </View>
              </SafeAreaView>
            </ScrollView>
            <ScrollView style={globalStyles.InputBillsdetailpaymentrcpt}>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2new]}>
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
                    Rp {Intl.NumberFormat('id-ID').format(totaltrx)}
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
              </SafeAreaView> */}
              <SafeAreaView style={[invrecStyles.inputantotalanbills2new]}>
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
                    Rp {Intl.NumberFormat('id-ID').format(tottax)}
                  </Text>
                </View>
              </SafeAreaView>
              <SafeAreaView style={[invrecStyles.inputantotalanbills2new]}>
                <View style={globalStyles.labelinputtotalanbillsdisc}>
                  <Text
                    style={[
                      invrecStyles.labelinputbills,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    {paymentName}
                  </Text>
                </View>
                <View style={globalStyles.kanan2}>
                  <Text
                    style={[
                      invrecStyles.labelinputbills,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    Rp {Intl.NumberFormat('id-ID').format(totaltrx)}
                  </Text>
                </View>
              </SafeAreaView>
            </ScrollView>
            <View style={globalStyles.ButtonPayment}>
              <SafeAreaView style={[invrecStyles.buttontotalan]}>
                <TouchableOpacity
                  style={[globalStyles.buttonNoPayment]}
                  onPress={() => setModaldetail(!mdlDetail)}>
                  <Text style={globalStyles.textNo}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.buttonYesPayment]}
                  onPress={PrintStruk}>
                  <Text style={globalStyles.textStyle}>Reprint</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </View>
        </View>
      </Modal>
      {/* //* MODAL BILLS */}
      {/* //* BANNER */}
      <SafeAreaView style={invrecStyles.bannermenureceipt}>
        <TouchableOpacity
          style={invrecStyles.bannerpanahbackreceipt}
          // onPress={() => navigation.replace('Home')}
          onPress={handleBackButtonClick}>
          <Icon name={'arrow-left'} size={20} color="#0096FF" />
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            flexDirection: 'row',
          }}></View>
      </SafeAreaView>
      {/* //* BANNER */}
      <Text style={styles.title}>Receipts</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.input} onPress={showDateFromPicker}>
          <TextInput
            value={dateFrom.toLocaleDateString()}
            editable={false}
            placeholder="Date From"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={showDateToPicker}>
          <TextInput
            value={dateTo.toLocaleDateString()}
            editable={false}
            placeholder="Date To"
          />
        </TouchableOpacity>
        {salesTypes.length > 0 ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={salesType}
              style={styles.picker}
              onValueChange={itemValue => setSalesType(itemValue)}>
              {salesTypes.map(type => (
                <Picker.Item
                  key={type.salesType_ID}
                  label={type.salesType_Name}
                  value={type.salesType_ID}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
      <Button title="Load Receipts" onPress={() => GetHistoryTrxHDR()} />
      <FlatList
        data={receipts}
        keyExtractor={item => item.docnumber}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity
              key={item.docnumber}
              style={styles.receiptContainer}
              onPress={() => GetHistoryTrxDTL(item)}>
              <Text style={styles.invoice}>{item.docnumber}</Text>
              <Text style={styles.salesType_Name}>
                {item.salesType_Name} - {item.formatted_datetime}
              </Text>
              <Text style={styles.salesType_Name}>
                {item.payment_Name} -{' '}
                {Intl.NumberFormat('id-ID').format(item.origtotal)}
              </Text>
              {item.refund && (
                <Text style={styles.refund}>
                  {Intl.NumberFormat('id-ID').format(item.amt_Refund)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
      <DateTimePickerModal
        isVisible={isDateFromPickerVisible}
        mode="date"
        onConfirm={handleDateFromConfirm}
        onCancel={hideDateFromPicker}
      />
      <DateTimePickerModal
        isVisible={isDateToPickerVisible}
        mode="date"
        onConfirm={handleDateToConfirm}
        onCancel={hideDateToPicker}
      />
      {/* <ReceiptModal
        visible={isModalVisible}
        onClose={closeModal}
        receipt={selectedReceipt}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    flex: 1,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  receiptContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
  },
  invoice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 1,
    color: '#000',
    fontWeight: '900',
  },
  payment: {
    fontSize: 14,
  },
  refund: {
    fontSize: 14,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  body: {
    alignItems: 'center',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  employee: {
    fontSize: 16,
    marginVertical: 5,
  },
  pos: {
    fontSize: 16,
    marginVertical: 5,
  },
  type: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  item: {
    fontSize: 16,
    marginVertical: 5,
  },
  discount: {
    fontSize: 16,
    marginVertical: 5,
  },
  ppn: {
    fontSize: 16,
    marginVertical: 5,
  },
  payment: {
    fontSize: 16,
    marginVertical: 5,
  },
  date: {
    fontSize: 16,
    marginVertical: 5,
  },
  time: {
    fontSize: 16,
    marginVertical: 5,
  },
  reprintButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  reprintText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Receipts;
