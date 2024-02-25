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
