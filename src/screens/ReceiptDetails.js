import React, {useState, useEffect, useRef} from 'react';
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
} from 'react-native';

import {globalStyles, invrecStyles} from '../css/global';
import {useTheme, useRoute, useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import {getsalestype} from '../api/getsalestype';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {globalStyles, invrecStyles} from '../css/global';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {gettrxhist} from '../api/gettrxhist';
import * as dbconn from '../db/TrxHist';
import * as dbconnTrx from '../db/TrxHistDtl';
import {format} from 'date-fns';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';

// const ReceiptModal = ({visible, onClose, receipt}) => {
//   if (!receipt) return null;

//   // return (
//   //   <Modal
//   //     animationType="slide"s
//   //     transparent={true}
//   //     visible={visible}
//   //     onRequestClose={onClose}>
//   //     <View style={styles.modalContainer}>
//   //       <View style={styles.modalContent}>
//   //         <View style={styles.header}>
//   //           <TouchableOpacity onPress={onClose}>
//   //             <Icon name={'arrow-left'} size={24} color="white" />
//   //           </TouchableOpacity>
//   //           <Text style={styles.headerText}>Receipt Details</Text>
//   //         </View>
//   //         <View style={styles.body}>
//   //           <Text style={styles.invoice}>{receipt.invoice}</Text>
//   //           <Text style={styles.amount}>Rp. {receipt.amount}</Text>
//   //           <Text style={styles.total}>Total</Text>
//   //           <Text style={styles.employee}>Employee: {receipt.employee}</Text>
//   //           <Text style={styles.pos}>POS: {receipt.pos}</Text>
//   //           <Text style={styles.type}>{receipt.type}</Text>
//   //           <Text style={styles.item}>{receipt.item}</Text>
//   //           <Text style={styles.discount}>Discount: {receipt.discount}</Text>
//   //           <Text style={styles.total}>Total: Rp. {receipt.total}</Text>
//   //           <Text style={styles.ppn}>PPN 11%: Rp. {receipt.ppn}</Text>
//   //           <Text style={styles.payment}>BCA: Rp. {receipt.bca}</Text>
//   //           <Text style={styles.date}>{receipt.date}</Text>
//   //           <Text style={styles.time}>{receipt.time}</Text>
//   //           <TouchableOpacity style={styles.reprintButton} onPress={() => {}}>
//   //             <Text style={styles.reprintText}>REPRINT</Text>
//   //           </TouchableOpacity>
//   //         </View>
//   //       </View>
//   //     </View>
//   //   </Modal>
//   // );
// };

const Receipts = () => {
  const increment = useRef(null);
  const navigation = useNavigation();
  const [dateFrom, setDateFrom] = useState(new Date('2023-08-17'));
  const [dateTo, setDateTo] = useState(new Date('2023-08-17'));
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
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    GetSalesType();
    LOADTBLHIST();
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

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
      });
    } catch (error) {
      let msg = error.message;
      CallModalInfo(msg);
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
      setModalVisible(true);
      const db = await dbconn.getDBConnection();
      const fromdate = format(new Date(dateFrom), 'yyyy-MM-dd');
      const todate = format(new Date(dateTo), 'yyyy-MM-dd');
      gettrxhist({
        DOCNUMBER: item.docnumber,
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
        ['Discount', 'Rp.', '0'],
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
        ['Total', 'Rp.', Intl.NumberFormat('id-ID').format(total)],
        {},
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidths2,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['PPN 11%', 'Rp.', Intl.NumberFormat('id-ID').format(tax)],
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
        ['Grand Total', 'Rp.', Intl.NumberFormat('id-ID').format(grandtotal)],
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
      handleBackButtonClick();
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
              <Text style={globalStyles.modalText}>Invoice</Text>
            </View>
            <Text style={globalStyles.TextHeaderBills}>Receipt Details</Text>
            <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
              <View style={globalStyles.labelinputtotalanbillsdisc}>
                <Text
                  style={[
                    invrecStyles.labeldetailshistdocnumber,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  DOCNUMBER
                </Text>
              </View>
            </SafeAreaView>
            <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
              <View style={globalStyles.labelinputtotalanbillsdisc}>
                <Text
                  style={[
                    invrecStyles.labeldetailshistdocnumber,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  RP. 70.000
                </Text>
              </View>
            </SafeAreaView>
            <SafeAreaView style={[invrecStyles.inputantotalanbills2]}>
              <View style={globalStyles.labelinputtotalanbillsdisc}>
                <Text
                  style={[
                    invrecStyles.labeldetailshistdocnumber,
                    {backgroundColor: colors.card, color: colors.text},
                  ]}>
                  Total
                </Text>
              </View>
            </SafeAreaView>
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
              {/* <View
                key={index}
                style={[invrecStyles.inputantotalanbills2]}></View> */}
              {/* {discount.map((discount, index) => {
                return (
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
                    //value={isChecked}
                    //onValueChange={() => DiscBill(discount)}
                  />
                </View>
                );
              })} */}
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
                    Rp {Intl.NumberFormat('id-ID').format(total)}
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
                    Rp {Intl.NumberFormat('id-ID').format(tax)}
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
                    BCA
                  </Text>
                </View>
                <View style={globalStyles.kanan2}>
                  <Text
                    style={[
                      invrecStyles.labelinputbills,
                      {backgroundColor: colors.card, color: colors.text},
                    ]}>
                    Rp {Intl.NumberFormat('id-ID').format(grandtotal)}
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
              <Text style={styles.payment}>
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
      <ReceiptModal
        visible={isModalVisible}
        onClose={closeModal}
        receipt={selectedReceipt}
      />
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
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
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
