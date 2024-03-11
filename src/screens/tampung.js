{
  /* //* MODAL EDIT VARIANT */
}
<Modal animationType="fade" transparent={true} visible={mdlEditVariant}>
  <View style={globalStyles.centeredViewPayment}>
    <View style={globalStyles.modalViewPayment}>
      <View style={globalStyles.modalheader}>
        <Text style={globalStyles.modalText}>Variant</Text>
      </View>
      <Text style={globalStyles.TextHeaderVariant}>Variant</Text>
      <ScrollView style={globalStyles.InputVariant} nestedScrollEnabled={true}>
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
</Modal>;
{
  /* //* MODAL EDIT VARIANT */
}

// const PrintStruk = async () => {
//    //   let columnWidths = [8, 20, 20];
// //   try {
// //     let datauser = await AsyncStorage.getItem('@dtUser');
// //     datauser = JSON.parse(datauser);
// //     let alamat = datauser[0].alamat;
// //     let namatoko = datauser[0].namatoko;
// //     setAlamatToko(alamat[0].alamat);
// //     setNamaToko(namatoko[0].label);
// //     console.log('alamat: ', alamattoko);
// //     console.log('nama toko: ', namatoko1);
// //     await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
// //     //  await BluetoothEscposPrinter.printPic(hsdLogo, {
// //     //    width: 250,
// //     //    left: 150,
// //     //  });
// //     await BluetoothEscposPrinter.printerAlign(
// //       BluetoothEscposPrinter.ALIGN.CENTER,
// //     );
// //     await BluetoothEscposPrinter.printerAlign(
// //       [48],
// //       BluetoothEscposPrinter.ALIGN.CENTER,
// //       [{namatoko1}],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [48],
// //       [BluetoothEscposPrinter.ALIGN.CENTER],
// //       [{alamattoko}],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [32],
// //       [BluetoothEscposPrinter.ALIGN.CENTER],
// //       ['https://xfood.id'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText(
// //       '================================================',
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [24, 24],
// //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// //       ['Customer', 'Prawito Hudoro'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [24, 24],
// //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// //       ['Packaging', 'Iya'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [24, 24],
// //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// //       ['Delivery', 'Ambil Sendiri'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText(
// //       '================================================',
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText('Products\r\n', {
// //       widthtimes: 1,
// //     });
// //     await BluetoothEscposPrinter.printText(
// //       '================================================',
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       columnWidths,
// //       [
// //         BluetoothEscposPrinter.ALIGN.LEFT,
// //         BluetoothEscposPrinter.ALIGN.LEFT,
// //         BluetoothEscposPrinter.ALIGN.RIGHT,
// //       ],
// //       ['1x', 'Cumi-Cumi', 'Rp.200.000'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       columnWidths,
// //       [
// //         BluetoothEscposPrinter.ALIGN.LEFT,
// //         BluetoothEscposPrinter.ALIGN.LEFT,
// //         BluetoothEscposPrinter.ALIGN.RIGHT,
// //       ],
// //       ['1x', 'Tongkol Kering', 'Rp.300.000'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       columnWidths,
// //       [
// //         BluetoothEscposPrinter.ALIGN.LEFT,
// //         BluetoothEscposPrinter.ALIGN.LEFT,
// //         BluetoothEscposPrinter.ALIGN.RIGHT,
// //       ],
// //       ['1x', 'Ikan Tuna', 'Rp.400.000'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText(
// //       '================================================',
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [24, 24],
// //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// //       ['Subtotal', 'Rp.900.000'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [24, 24],
// //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// //       ['Packaging', 'Rp.6.000'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [24, 24],
// //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// //       ['Delivery', 'Rp.0'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText(
// //       '================================================',
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [24, 24],
// //       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
// //       ['Total', 'Rp.906.000'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText('\r\n\r\n', {});
// //     await BluetoothEscposPrinter.printerAlign(
// //       BluetoothEscposPrinter.ALIGN.CENTER,
// //     );
// //     await BluetoothEscposPrinter.printQRCode(
// //       'DP0837849839',
// //       280,
// //       BluetoothEscposPrinter.ERROR_CORRECTION.L,
// //     );
// //     await BluetoothEscposPrinter.printerAlign(
// //       BluetoothEscposPrinter.ALIGN.CENTER,
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [48],
// //       [BluetoothEscposPrinter.ALIGN.CENTER],
// //       ['DP0837849839'],
// //       {widthtimes: 2},
// //     );
// //     await BluetoothEscposPrinter.printText(
// //       '================================================',
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printColumn(
// //       [48],
// //       [BluetoothEscposPrinter.ALIGN.CENTER],
// //       ['Sabtu, 18 Juni 2022 - 06:00 WIB'],
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText(
// //       '================================================',
// //       {},
// //     );
// //     await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
// //     await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
// //   } catch (e) {
// //     Alert(e.message || 'ERROR');
// //   }
