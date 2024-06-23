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
} from 'react-native';

import {useTheme, useRoute, useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';
const Receipts = () => {
  const increment = useRef(null);
  const navigation = useNavigation();
  const [mdlDiscount, setMdlDiscount] = useState(false);
  const [dateFrom, setDateFrom] = useState('17-08-2023');
  const [dateTo, setDateTo] = useState('17-08-2023');
  const [salesType, setSalesType] = useState([]);
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
    return () => {
      clearInterval(increment.current);
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  function handleBackButtonClick() {
    navigation.replace('Home');
    return true;
  }

  function HideModalDiscount() {
    setMdlDiscount(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipts</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={dateFrom}
          onChangeText={setDateFrom}
        />
        <TextInput
          style={styles.input}
          value={dateTo}
          onChangeText={setDateTo}
        />
        <Picker
          selectedValue={salesType}
          style={styles.picker}
          onValueChange={itemValue => setSalesType(itemValue)}>
          <Picker.Item label="Walk In" value="Walk In" />
          <Picker.Item label="Online" value="Online" />
          <Picker.Item label="Phone" value="Phone" />
        </Picker>
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
                style={styles.receiptContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cecece',
    padding: 10,
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
});

export default Receipts;
