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

import {useTheme, useRoute, useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
import {getsalestype} from '../api/getsalestype';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {globalStyles, invrecStyles} from '../css/global';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ReceiptModal = ({visible, onClose, receipt}) => {
  if (!receipt) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name={'arrow-left'} size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Receipt Details</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.invoice}>{receipt.invoice}</Text>
            <Text style={styles.amount}>Rp. {receipt.amount}</Text>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.employee}>Employee: {receipt.employee}</Text>
            <Text style={styles.pos}>POS: {receipt.pos}</Text>
            <Text style={styles.type}>{receipt.type}</Text>
            <Text style={styles.item}>{receipt.item}</Text>
            <Text style={styles.discount}>Discount: {receipt.discount}</Text>
            <Text style={styles.total}>Total: Rp. {receipt.total}</Text>
            <Text style={styles.ppn}>PPN 11%: Rp. {receipt.ppn}</Text>
            <Text style={styles.payment}>BCA: Rp. {receipt.bca}</Text>
            <Text style={styles.date}>{receipt.date}</Text>
            <Text style={styles.time}>{receipt.time}</Text>
            <TouchableOpacity style={styles.reprintButton} onPress={() => {}}>
              <Text style={styles.reprintText}>REPRINT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  const [receipts, setReceipts] = useState([
    {
      date: 'Thursday, 17 August 2023',
      data: [
        {
          id: '1',
          invoice: 'INV202308170003',
          type: 'Walk In',
          time: '16:21',
          payment: 'BCA - Rp. 75.000',
        },
        {
          id: '2',
          invoice: 'INV202308170002',
          type: 'Walk In',
          time: '13:18',
          payment: 'CASH - Rp. 25.000',
          refund: 'Refund #1-1001',
        },
        {
          id: '3',
          invoice: 'INV202308170001',
          type: 'Walk In',
          time: '10:34',
          payment: 'CASH - Rp. 25.000',
        },
      ],
    },
    {
      date: 'Wednesday, 16 August 2023',
      data: [
        {
          id: '4',
          invoice: 'INV202308160002',
          type: 'Walk In',
          time: '13:18',
          payment: 'CASH - Rp. 25.000',
        },
        {
          id: '5',
          invoice: 'INV202308160001',
          type: 'Walk In',
          time: '10:34',
          payment: 'CASH - Rp. 25.000',
        },
      ],
    },
  ]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    GetSalesType();
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

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
      <Button title="Load Receipts" onPress={() => {}} />
      <FlatList
        data={receipts}
        keyExtractor={item => item.date}
        renderItem={({item}) => (
          <View>
            <Text style={styles.date}>{item.date}</Text>
            {item.data.map(receipt => (
              <TouchableOpacity
                key={receipt.id}
                style={styles.receiptContainer}
                onPress={() => openModal(receipt)}>
                <Text style={styles.invoice}>{receipt.invoice}</Text>
                <Text style={styles.type}>
                  {receipt.type} - {receipt.time}
                </Text>
                <Text style={styles.payment}>{receipt.payment}</Text>
                {receipt.refund && (
                  <Text style={styles.refund}>{receipt.refund}</Text>
                )}
              </TouchableOpacity>
            ))}
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
    fontSize: 14,
    color: 'gray',
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
