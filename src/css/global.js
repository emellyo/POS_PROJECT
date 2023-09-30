import {StyleSheet, Dimensions} from 'react-native';

const screenHeight = Dimensions.get('window').height;

export const globalStyles = StyleSheet.create({
  bannermenu: {
    flexDirection: 'column',
    backgroundColor: '#021F61',
    height: 60,
    alignContent: 'center',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  bannerpanahback: {
    paddingLeft: 10,
    alignItems: 'flex-start',
  },
  bannermenutext: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  menubtnhz: {
    flex: 0.5,
    flexDirection: 'row',
    marginHorizontal: 0,
    marginVertical: 5,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    // justifyContent: 'center',
    paddingHorizontal: 15,
    alignContent: 'center',
    alignItems: 'center',
  },
  menubtnhztext: {
    color: '#212121',
    paddingHorizontal: 50,
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignContent: 'center',
  },
  titlemenutext: {
    color: '#021F61',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menubuttontextselected: {
    position: 'absolute',
    fontWeight: 'bold',
    bottom: 10,
    left: '8%',
    right: '10%',
    color: '#212121',
    fontSize: 14,
    // justifyContent: 'center',
    // alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
  },
  menubuttonitembottom: {
    flex: 0.5,
    flexDirection: 'row',
    marginHorizontal: 5,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menubuttonitemnew: {
    flex: 0.5,
    flexDirection: 'row',
    marginHorizontal: 2,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    padding: 10,
  },
  menuitemlist: {
    flex: 1,
    flexBasis: '24%',
    //width: '24%',
    flexDirection: 'column',
  },
  menubuttontextnew: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    //width: 100,
    color: '#212121',
    fontSize: 14,
    // justifyContent: 'center',
    // alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
  },
  menubuttontextonline: {
    position: 'absolute',
    bottom: 10,
    left: '9%',
    right: '10%',
    //width: 100,
    color: '#212121',
    fontSize: 14,
    // justifyContent: 'center',
    // alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    fontWeight: 'bold',
  },
  menuviewhome: {
    flex: 4,
    flexDirection: 'column',
    height: 500,
    //justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    //justifyContent: 'center',
    alignSelf: 'center',
    width: '10%',
  },
  menuviewhome2: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
    // backgroundColor: 'darkblue',
  },
  menutitletexthome: {
    marginLeft: 0,
    marginTop: 40,
    marginBottom: 20,
    fontSize: 20,
    color: '#212121',
    fontWeight: 'bold',
    width: 100,
  },
  title1view: {flex: 2, flexDirection: 'row', margin: 0},
  title1text: {color: '#212121', fontSize: 13},
  title1text2: {color: 'red', fontSize: 16, textAlign: 'right'},
  viewmenu: {
    flex: 3,
    marginVertical: 65,
    marginHorizontal: 0,
    padding: 15,
    // borderWidth: 1, borderColor: 'red'
  },
  bannertext: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bannerhome: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#0096FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '15%',
    left: 0,
    right: 0,
  },
  imageleavebalance: {width: 250, height: 250, alignContent: 'center'},
  viewleavebalance: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonCheckIn: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#021F61',
  }, // marginTop: 0,
  buttonCheckInDisable: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  imagecheckin: {
    resizeMode: 'contain',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#212121',
    width: 370,
    height: 450,
    marginBottom: 20,
    // justifyContent: 'center',
    // alignContent: 'center'
  },
  buttonSubmit: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkblue',
    borderRadius: 5,
    elevation: 10,
    marginTop: 25,
  },
  buttonSubmitFlag: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 10,
    marginTop: 25,
  },
  buttonSubmitDisable: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    elevation: 10,
    marginTop: 25,
  },
  buttonIcon: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
    borderRadius: 10,
    elevation: 10,
    marginTop: 25,
  },
  viewimagecheckin: {
    marginHorizontal: 5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textcheckin: {
    marginTop: 5,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 6,
    elevation: 5,
    paddingLeft: 10,
  },
  labelcheckin: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 5,
  },
  menuview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  menutitletext: {
    marginHorizontal: 25,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
    color: '#212121',
  },
  menuviewitem: {
    marginHorizontal: 20,
    marginVertical: 10,
    flex: 0.2,
    flexDirection: 'row',
  },
  menubuttonitem: {
    flex: 0.5,
    flexDirection: 'row',
    height: 70,
    paddingLeft: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 5,
  },
  menubuttontext: {
    // fontWeight:'700',
    color: '#212121',
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
  menubuttonitemright: {
    flex: 0.5,
    flexDirection: 'row',
    height: 70,
    paddingLeft: 25,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 5,
  },
  touchfinger: {
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textresend: {
    fontWeight: '700',
    color: '#021F61',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingLeft: 10,
  },
  textinformation: {color: 'red', fontSize: 16},
  imagebackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .5)',
  },
  logoview: {
    justifyContent: 'left',
    alignItems: 'left',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, .0)',
  },
  logoview2: {
    justifyContent: 'left',
    alignItems: 'left',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, .0)',
  },
  logoimage: {
    width: 270,
    height: 40,
  },
  logotext: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  textremember: {
    fontWeight: '600',
    flex: 1,
    paddingLeft: 5,
    paddingTop: 4,
    fontSize: 17,
  },
  viewinput: {
    flexDirection: 'row',
    width: 400,
    marginHorizontal: 0,
    marginTop: 10,
  },
  viewinput2: {
    flexDirection: 'row',
    width: '10%',
    marginHorizontal: '40%',
    //marginTop: 10,
  },
  viewbutton: {
    flexDirection: 'column',
    marginHorizontal: 0,
    marginTop: 0,
    width: 400,
  },
  iconinput: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    elevation: 5,
  },
  textinput: {
    fontWeight: '600',
    flex: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 15,
    elevation: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  textinputcustomer: {
    fontWeight: '600',
    flex: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    //elevation: 5,
    borderWidth: 1,
    //borderColor: '#212121',
    padding: 0,
    fontSize: 13,
    paddingBottom: 10,
    width: 300,
    marginTop: '20%',
  },
  textinputpayment: {
    fontWeight: '600',
    flex: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    //elevation: 5,
    borderWidth: 1,
    //borderColor: '#212121',
    //padding: 0,
    fontSize: 13,
    width: '100%',
  },
  textinputbills: {
    fontWeight: '600',
    //flex: 0,
    // borderTopLeftRadius: 3,
    // borderBottomLeftRadius: 3,
    //elevation: 5,
    //borderWidth: 1,
    //borderColor: '#212121',
    //padding: 0,
    fontSize: 13,
    width: '100%',
  },
  textinputcomment: {
    fontWeight: '600',
    flex: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    //elevation: 5,
    borderWidth: 1,
    //borderColor: '#212121',
    //padding: 0,
    fontSize: 13,
    width: '100%',
  },
  textinputqty: {
    fontWeight: '600',
    flex: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    //elevation: 5,
    borderWidth: 1,
    //borderColor: '#212121',
    padding: 5,
    fontSize: 13,
    width: '10%',
    height: '55%',
    paddingLeft: 5,
    marginLeft: '5%',
  },
  textlb: {
    marginHorizontal: 30,
    marginVertical: 10,
    fontSize: 18,
    color: '#212121',
    fontWeight: 'bold',
  },
  viewtextmap: {
    flex: 0.2,
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  textmap: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
  },
  imageloader: {
    width: 80,
    height: 80,
    alignItems: 'center',
  },
  textloader: {
    flex: 1,
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 472,
  },
  modalLoad: {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    paddingHorizontal: '100%',
    paddingVertical: '100%',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
  },
  indicatorText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginHorizontal: 20,
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    width: '100%',
  },
  inputlb: {
    color: '#212121',
    borderColor: '#cecece',
    backgroundColor: '#f5f5f5',
    fontSize: 50,
    fontWeight: 'bold',
    height: 100,
    margin: 12,
    width: 180,
    textAlign: 'center',
  },
  infosync: {
    marginHorizontal: 30,
    marginTop: 5,
    fontSize: 12,
    color: '#212121',
    fontWeight: 'bold',
  },

  wrapperIcon: {
    position: 'absolute',
    right: -10,
    padding: 18,
  },
  icon: {
    width: 25,
    height: 20,
  },
  buttonCheckOut: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'darkblue',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonCapture: {
    padding: 15,
    marginHorizontal: 0,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#021F61',
    marginTop: 15,
  },
  btnVerify: {
    paddingVertical: 15,
    marginHorizontal: 50,
    alignItems: 'center',
    backgroundColor: 'darkblue',
    borderRadius: 5,
    marginTop: 15,
  },
  btnVerifyDisable: {
    paddingVertical: 15,
    marginHorizontal: 50,
    alignItems: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    marginTop: 15,
  },

  buttonall: {
    flexDirection: 'row',
    marginTop: 20,
    alignContent: 'center',
    textAlign: 'center',
    marginHorizontal: 50,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonLogin: {
    padding: 10,
    paddingVertical: 15,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0096FF',
    borderRadius: 5,
    marginTop: 25,
  },
  buttonDisable: {
    padding: 10,
    paddingVertical: 15,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    marginTop: 25,
  },
  text: {
    color: 'white',
    fontWeight: '800',
    fontSize: 20,
  },
  textFlag: {
    color: 'green',
    fontWeight: '800',
    fontSize: 20,
  },
  textFailed: {
    marginLeft: 20,
    alignSelf: 'auto',
    color: 'red',
  },
  button: {
    marginTop: 30,
    marginBottom: -5,
    borderRadius: 15,
    justifyContent: 'center',
    width: 80,
    height: 40,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#0096FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  modalText: {
    fontSize: 18,
    color: '#FFFFFF',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  TextHeaderVariant: {
    width: '97%',
    fontSize: 18,
    color: '#212121',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  TextHeaderBills: {
    width: '97%',
    fontSize: 18,
    color: '#212121',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1,
    borderBottomColor: '#212121',
  },
  TextHeaderBills2: {
    width: '97%',
    fontSize: 18,
    color: '#0096FF',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    textAlign: 'left',
    fontWeight: 'bold',
    // borderWidth: 1,
    // borderBottomColor: '#212121',
  },
  formtitle1: {
    width: '100%',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 30,
  },
  formtitle2: {
    marginTop: 10,
    width: '100%',
    // fontWeight: '600',
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 52,
    paddingRight: 20,
    textAlign: 'left',
    fontSize: 15,
  },
  labelinput: {
    marginTop: 25,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 52,
    paddingRight: 20,
    textAlign: 'left',
    fontSize: 15,
  },
  labelinputpayment: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  inputverify: {
    marginTop: 5,
    justifyContent: 'center',
    marginHorizontal: 50,
    paddingLeft: 10,
    fontWeight: 'bold',
    borderRadius: 10,
    elevation: 5,
    fontSize: 16,
    borderWidth: 1,
  },
  labelinputcompany: {
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingRight: 20,
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 'bold',
  },
  box: {
    flex: 1,
  },
  //header
  box1: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //content
  box2: {
    flex: 10,
  },
  //footer
  box3: {
    flex: 0.5,
  },
  //content
  box4: {
    marginTop: 100,
    justifyContent: 'center',
  },
  box5: {
    position: 'absolute',
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  box6: {
    flex: 1,
    bottom: '-83%',
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconlogo: {
    width: 50,
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonNo: {
    marginTop: 30,
    marginBottom: -5,
    borderRadius: 15,
    justifyContent: 'center',
    marginHorizontal: 5,
    width: 140,
    height: 40,
    elevation: 5,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  buttonYes: {
    marginTop: 30,
    marginBottom: -5,
    borderRadius: 15,
    justifyContent: 'center',
    marginHorizontal: 5,
    width: 140,
    height: 40,
    elevation: 5,
    backgroundColor: '#0096FF',
  },
  buttonNoPayment: {
    width: '50%',
    height: 40,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  buttonYesPayment: {
    width: '50%',
    height: 40,
    backgroundColor: '#0096FF',
  },
  buttonQTYMinus: {
    width: '10%',
    height: 30,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginLeft: '30%',
  },
  buttonQTYPlus: {
    width: '10%',
    height: 30,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginLeft: '5%',
  },
  textNo: {
    color: '#212121',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  iconnotif: {
    width: 12,
    height: 12,
    justifyContent: 'flex-end',
    marginHorizontal: 30,
    marginRight: 0,
    marginVertical: 50,
    marginTop: 0,
  },
  textusuall: {
    color: 'white',
    marginTop: 20,
  },
  textBig: {
    color: 'white',
    marginTop: 30,
    fontSize: 55,
    fontWeight: '900',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  iconmenu: {
    width: 72,
    height: 72,
  },
  iconmenu2: {
    width: 30,
    height: 30,
    marginBottom: 20,
  },
  iconmenuwalkin: {
    width: '10%',
    height: '20%',
    marginBottom: '5%',
  },
  iconmenuonline: {
    width: '10%',
    height: '20%',
    marginBottom: '5%',
  },
  LookupcenteredView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LookupmodalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 20,
    height: '30%',
    width: '90%',
  },
  Lookupmodalheader: {
    backgroundColor: '#0096FF',
    width: '100%',
    height: 45,
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  centeredView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredViewCust: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredViewPayment: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingBottom: 20,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 20,
    width: '90%',
  },
  modalViewCust: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingBottom: 20,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 20,
    width: '50%',
    height: '80%',
  },
  modalViewPayment: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingBottom: 10,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 20,
    width: '60%',
    height: '90%',
  },
  modalViewBills: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingBottom: 10,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 20,
    width: '60%',
    height: '100%',
  },
  InputTender: {
    width: '100%',
    height: '10%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
  },
  InputVariant: {
    width: '100%',
    height: '10%',
    padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  InputBills: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '10%',
    //padding: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  InputBills2: {
    width: '100%',
    height: '10%',
    //padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
    borderTopWidth: 1,
    borderTopColor: '#212121',
  },
  InputBills3: {
    width: '100%',
    height: '10%',
    //padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
    borderTopWidth: 1,
    borderTopColor: '#212121',
  },
  InputTotalan: {
    width: '100%',
    height: '45%',
    display: 'flex',
    gap: 5,
    padding: 10,
  },
  InputTotalanVariant: {
    width: '100%',
    height: '40%',
    display: 'flex',
    gap: 5,
    padding: 10,
  },
  ButtonPayment: {
    width: '100%',
    height: '15%',
    display: 'flex',
    gap: 5,
    padding: 10,
  },
  labelinputtotalan: {
    width: '50%',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    height: 42,
    verticalAlign: 'middle',
  },
  labelinputtotalanbills: {
    width: '50%',
    padding: 10,
    display: 'flex',
    //flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    verticalAlign: 'middle',
  },
  cardlistvariantkiri: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardlistvariantkanan: {
    display: 'flex',
    flexDirection: 'column',
  },
  labelinputtotalanbillsdisc: {
    width: '50%',
    //padding: 5,
    display: 'flex',
    justifyContent: 'center',
    //height: 40,
    verticalAlign: 'middle',
  },
  variantkiri: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  variantkanan: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  cartlist: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
  },
  kiri: {
    display: 'flex',
    width: '70%',
    padding: 10,
  },
  kanan: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '30%',
    padding: 10,
  },
  itemqty: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  labelinputvariant: {
    width: '50%',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    verticalAlign: 'middle',
  },
  inputtotalan: {
    width: '100%',
    height: 42,
    verticalAlign: 'middle',
  },
  inputtotalanbills: {
    width: '50%',
    height: 42,
    verticalAlign: 'middle',
    marginLeft: '20%',
  },
  modalheader: {
    backgroundColor: '#0096FF',
    marginTop: 0,
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});

export const invrecStyles = StyleSheet.create({
  bannermenu: {
    //flexDirection: 'column',
    backgroundColor: '#0096FF',
    //height: '20%',
    alignContent: 'center',
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
  },
  bannermenu2: {
    flexDirection: 'column',
    backgroundColor: '#0096FF',
    //height: 60,
    alignContent: 'flex-start',
    justifyContent: 'space-between',
    // alignItems: 'center',
    //paddingBottom: 5,
  },
  bannerpanahback: {
    //paddingLeft: 10,
    //paddingTop: 10,
    //alignItems: 'flex-start',
    position: 'absolute',
    left: 20,
  },
  bannerpanahbackbills: {
    paddingLeft: 10,
    //alignItems: 'flex-start',
    paddingBottom: 0,
  },
  bannerpanahback2: {
    //paddingLeft: 10,
    // alignItems: 'flex-start',
    // marginLeft: '10%',
    // marginRight: '20%',
    fontSize: 20,
    color: '#ffff',
    //paddingBottom: 5,
  },
  bannerpanahback3: {
    //paddingLeft: 10,
    alignItems: 'flex-start',
    marginLeft: '20%',
    fontSize: 20,
    color: '#ffff',
    //paddingBottom: 5,
  },
  bannerinvoice: {
    //paddingLeft: '10%',
    //paddingTop: 5,
    //marginRight: '80%',
    // marginLeft: '8%',
    //marginBottom: '5%',
    //paddingBottom: '5%',
    //alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
  },
  bannermenutext: {
    color: '#FFFFFF',
    fontSize: 20,
    // fontWeight: 'bold',
    // position: 'absolute',
    // alignSelf: 'center',
    // justifyContent: 'center',
    // textAlign: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
  },
  bannermenutext2: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    textAlign: 'left',
    alignContent: 'space-between',
    alignItems: 'flex-start',
  },
  formtitle: {
    flex: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
  },
  menutitletexthome: {
    fontSize: 16,
    color: '#212121',
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  formpayment: {
    flex: 1,
    flexDirection: 'row',
    //marginHorizontal: 5,
    //marginBottom: 5,
  },
  menuitempayment: {
    flexDirection: 'row',
    marginVertical: 0,
    width: '50%',
    backgroundColor: '#FFFFFF',
  },
  menuitem: {
    flexDirection: 'row',
    marginVertical: 0,
    width: '50%',
    backgroundColor: '#FFFFFF',
  },
  menuitemfull: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    marginVertical: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  menuitemfullpayment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '25%',
    marginLeft: '5%',
    //marginVertical: 2,
    //width: '100%',
    backgroundColor: '#FFFFFF',
  },
  inputantotalan: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  inputantotalanbills: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    //height: '50%',
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  inputantotalanbillskiri: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    //padding: 10,
    //height: '50%',
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  inputantotalanbillskanan: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    //padding: 10,
    //height: '50%',
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  inputantotalanbills2: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    //padding: 10,
    //height: '50%',
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  inputanvariant: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    // borderBottomWidth: 1,
    // borderBottomColor: '#212121',
  },
  inputanqty: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#212121',
  },
  buttontotalan: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 5,
    padding: 5,
  },
  menuitemsubmit1: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  menuitemsubmit2: {
    flexDirection: 'row',
    width: '88%',
    backgroundColor: '#FFFFFF',
  },
  labelinput: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  labelinputbills: {
    fontSize: 20,
    fontWeight: 'bold',
    //marginLeft: 5,
  },
  labelinputbills2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  labelinputbills3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '60%',
  },
  textinput: {
    fontWeight: '600',
    flex: 1,
    borderRadius: 10,
    // paddingVertical: 15,
    elevation: 5,
    paddingLeft: 10,
    fontSize: 13,
  },
  textinputlookup: {
    fontWeight: '600',
    flex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    elevation: 5,
    paddingLeft: 10,
    fontSize: 13,
  },
  iconlookup: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
  },
  wrapperIcon: {
    position: 'absolute',
    right: 5,
    // justifyContent: 'center',
    // alignContent: 'center',
    alignSelf: 'center',
  },
  formdatalist: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 0,
    width: '100%',
    backgroundColor: '#f1f9ff',
  },
  menuitemdatalist: {
    flexDirection: 'row',
    width: '50%',
  },
  labelinputdatalist: {
    marginBottom: 7,
    width: '100%',
    // padding: 10,
    justifyContent: 'center',
    textAlign: 'left',
    fontSize: 13,
    // backgroundColor: '#F1F1F1F1',
  },
  textinputdatalist: {
    fontWeight: '600',
    flex: 1,
    paddingLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#212121',
    paddingVertical: 5,
    elevation: 0,
    fontSize: 13,
  },
  labelrightdatalist: {
    color: 'red',
    fontSize: 15,
    textAlign: 'right',
  },
});
