import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StatusBar} from 'react-native';
import {StackActions} from '@react-navigation/native';

//import {logoartha3} from '../images/images';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.dispatch(StackActions.replace('Login'));
      // this.props.navigation.dispatch(StackActions.replace('Home'))
    }, 1500);
  }

  render() {
    return (
      <View style={{flex: 2, backgroundColor: '#FFFFFF'}}>
        <StatusBar backgroundColor={'#FFFFFF'} barStyle="dark-content" />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 325,
          }}>
          <Image
            //source={logoartha3}
            style={{width: 300, height: 40, alignContent: 'center'}}
          />
        </View>
      </View>
    );
  }
}

export default Splash;
