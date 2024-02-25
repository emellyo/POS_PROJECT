import React, {useEffect, useState} from 'react';
import {View, Button, Alert} from 'react-native';
import BluetoothPrinter from 'react-native-bluetooth-printer';

const PrinterScreen = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    connectToPrinter();
  }, []);

  const connectToPrinter = async () => {
    try {
      const devices = await BluetoothPrinter.list();
      // Find and connect to your printer
      // For example:
      const printer = devices.find(device => device.name === 'YourPrinterName');
      if (printer) {
        await BluetoothPrinter.connect(printer.id);
        setConnected(true);
      } else {
        Alert.alert('Printer not found');
      }
    } catch (error) {
      console.error('Error connecting to printer:', error);
    }
  };

  const generatePrintContent = () => {
    // Example content
    return `
    <h1>Printed Content</h1>
    <p>This is an example printout from React Native app.</p>
    <p>You can format the content as needed.</p>
  `;
  };

  const printContent = async () => {
    try {
      const content = generatePrintContent();
      await BluetoothPrinter.print(content);
      console.log('Print successful');
    } catch (error) {
      console.error('Error printing:', error);
    }
  };

  return (
    <View>
      <Button
        title="Print"
        onPress={() => {
          if (connected) {
            // Proceed to print your content
            printContent();
          } else {
            Alert.alert('Printer not connected');
          }
        }}
      />
    </View>
  );
};

export default PrinterScreen;
