/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import {ReanimatedRoot} from 'react-native-reanimated';
import App from './App';
import {name as appName} from './app.json';
//import POS_PEOJECT from './app.json';

//AppRegistry.registerComponent('POS_PEOJECT', () => POS_PEOJECT);
AppRegistry.registerComponent(appName, () => App);
