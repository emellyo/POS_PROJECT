import DeviceInfo, {getManufacturerSync} from 'react-native-device-info';
import {getManufacturer} from 'react-native-device-info';
import {
  useBatteryLevel,
  useBatteryLevelIsLow,
  usePowerState,
  useFirstInstallTime,
  useDeviceName,
  useHasSystemFeature,
  useIsEmulator,
} from 'react-native-device-info';

import {Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const DeviceInfoAsync = async () => {
  let deviceJSON = {};
  try {
    deviceJSON.manufacturer = await getManufacturer();
    deviceJSON.buildId = await DeviceInfo.getBuildId();
    deviceJSON.isCameraPresent = await DeviceInfo.isCameraPresent();
    // deviceJSON.deviceName = await DeviceInfo.getDeviceName();
    await DeviceInfo.getDeviceName().then(deviceName => {
      deviceJSON.deviceName = deviceName;
    });
    await DeviceInfo.getUniqueId().then(uniqueId => {
      deviceJSON.uniqueId = uniqueId;
    });
    deviceJSON.usedMemory = await DeviceInfo.getUsedMemory();
    deviceJSON.userAgent = await DeviceInfo.getUserAgent();
    deviceJSON.instanceId = await DeviceInfo.getInstanceId();
    deviceJSON.installReferrer = await DeviceInfo.getInstallReferrer();
    deviceJSON.installerPackageName =
      await DeviceInfo.getInstallerPackageName();
    deviceJSON.isEmulator = await DeviceInfo.isEmulator();
    deviceJSON.fontScale = await DeviceInfo.getFontScale();
    deviceJSON.hasNotch = await DeviceInfo.hasNotch();
    deviceJSON.firstInstallTime = await DeviceInfo.getFirstInstallTime();
    deviceJSON.lastUpdateTime = await DeviceInfo.getLastUpdateTime();
    deviceJSON.serialNumber = await DeviceInfo.getSerialNumber();
    deviceJSON.androidId = await DeviceInfo.getAndroidId();
    deviceJSON.IpAddress = await DeviceInfo.getIpAddress();
    // For MacAddress add android.permission.ACCESS_WIFI_STATE
    deviceJSON.MacAddress = await DeviceInfo.getMacAddress();
    // For phoneNumber add android.permission.READ_PHONE_STATE
    deviceJSON.phoneNumber = await DeviceInfo.getPhoneNumber();
    deviceJSON.ApiLevel = await DeviceInfo.getApiLevel();
    deviceJSON.carrier = await DeviceInfo.getCarrier();
    deviceJSON.totalMemory = await DeviceInfo.getTotalMemory();
    deviceJSON.maxMemory = await DeviceInfo.getMaxMemory();
    deviceJSON.totalDiskCapacity = await DeviceInfo.getTotalDiskCapacity();
    deviceJSON.totalDiskCapacityOld =
      await DeviceInfo.getTotalDiskCapacityOld();
    deviceJSON.freeDiskStorage = await DeviceInfo.getFreeDiskStorage();
    deviceJSON.freeDiskStorageOld = await DeviceInfo.getFreeDiskStorageOld();
    deviceJSON.batteryLevel = await DeviceInfo.getBatteryLevel();
    deviceJSON.isLandscape = await DeviceInfo.isLandscape();
    deviceJSON.isAirplaneMode = await DeviceInfo.isAirplaneMode();
    deviceJSON.isBatteryCharging = await DeviceInfo.isBatteryCharging();
    deviceJSON.isPinOrFingerprintSet = await DeviceInfo.isPinOrFingerprintSet();
    deviceJSON.supportedAbis = await DeviceInfo.supportedAbis();
    deviceJSON.hasSystemFeature = await DeviceInfo.hasSystemFeature(
      'android.software.webview',
    );
    deviceJSON.getSystemAvailableFeatures =
      await DeviceInfo.getSystemAvailableFeatures();
    deviceJSON.powerState = await DeviceInfo.getPowerState();
    deviceJSON.isLocationEnabled = await DeviceInfo.isLocationEnabled();
    deviceJSON.headphones = await DeviceInfo.isHeadphonesConnected();
    // deviceJSON.getAvailableLocationProviders = await DeviceInfo.getAvailableLocationProviders();
    await DeviceInfo.getAvailableLocationProviders().then(loc => {
      deviceJSON.getAvailableLocationProviders = loc;
    });
    deviceJSON.bootloader = await DeviceInfo.getBootloader();
    deviceJSON.device = await DeviceInfo.getDevice();
    deviceJSON.display = await DeviceInfo.getDisplay();
    deviceJSON.fingerprint = await DeviceInfo.getFingerprint();
    deviceJSON.hardware = await DeviceInfo.getHardware();
    deviceJSON.host = await DeviceInfo.getHost();
    deviceJSON.product = await DeviceInfo.getProduct();
    deviceJSON.tags = await DeviceInfo.getTags();
    deviceJSON.type = await DeviceInfo.getType();
    deviceJSON.baseOS = await DeviceInfo.getBaseOs();
    deviceJSON.previewSdkInt = await DeviceInfo.getPreviewSdkInt();
    deviceJSON.securityPatch = await DeviceInfo.getSecurityPatch();
    deviceJSON.codename = await DeviceInfo.getCodename();
    deviceJSON.incremental = await DeviceInfo.getIncremental();
    deviceJSON.supported32BitAbis = await DeviceInfo.supported32BitAbis();
    deviceJSON.supported64BitAbis = await DeviceInfo.supported64BitAbis();
    deviceJSON.synchronizedUniqueId = await DeviceInfo.syncUniqueId();
    try {
      deviceJSON.deviceToken = await DeviceInfo.getDeviceToken();
    } catch (e) {
      console.log('Unable to get device token.Either simulator or not iOS11+');
    }
  } catch (e) {
    console.log('Trouble getting device info ', e);
  }
  // eslint-disable-next-line react/no-did-mount-set-state
  return deviceJSON;
};

export const DeviceInfoConstants = () => {
  let deviceJSON = {};
  deviceJSON.uniqueId = DeviceInfo.getUniqueId();
  // DeviceInfo.getUniqueId().then((uniqueId) => {
  //   deviceJSON.uniqueId = uniqueId;
  // });
  deviceJSON.deviceId = DeviceInfo.getDeviceId();
  deviceJSON.bundleId = DeviceInfo.getBundleId();
  deviceJSON.systemName = DeviceInfo.getSystemName();
  deviceJSON.systemVersion = DeviceInfo.getSystemVersion();
  deviceJSON.version = DeviceInfo.getVersion();
  deviceJSON.readableVersion = DeviceInfo.getReadableVersion();
  deviceJSON.buildNumber = DeviceInfo.getBuildNumber();
  deviceJSON.isTablet = DeviceInfo.isTablet();
  deviceJSON.appName = DeviceInfo.getApplicationName();
  deviceJSON.brand = DeviceInfo.getBrand();
  deviceJSON.model = DeviceInfo.getModel();
  deviceJSON.deviceType = DeviceInfo.getDeviceType();
  return deviceJSON;
};

export const DeviceInfoSync = () => {
  let deviceJSON = {};
  deviceJSON.manufacturer = getManufacturerSync();
  deviceJSON.buildId = DeviceInfo.getBuildIdSync();
  deviceJSON.isCameraPresent = DeviceInfo.isCameraPresentSync();
  deviceJSON.deviceName = DeviceInfo.getDeviceNameSync();
  deviceJSON.usedMemory = DeviceInfo.getUsedMemorySync();
  deviceJSON.instanceId = DeviceInfo.getInstanceIdSync();
  deviceJSON.installReferrer = DeviceInfo.getInstallReferrerSync();
  deviceJSON.installerPackageName = DeviceInfo.getInstallerPackageNameSync();
  deviceJSON.isEmulator = DeviceInfo.isEmulatorSync();
  deviceJSON.fontScale = DeviceInfo.getFontScaleSync();
  deviceJSON.hasNotch = DeviceInfo.hasNotch();
  deviceJSON.firstInstallTime = DeviceInfo.getFirstInstallTimeSync();
  deviceJSON.lastUpdateTime = DeviceInfo.getLastUpdateTimeSync();
  deviceJSON.serialNumber = DeviceInfo.getSerialNumberSync();
  deviceJSON.androidId = DeviceInfo.getAndroidIdSync();
  deviceJSON.IpAddress = DeviceInfo.getIpAddressSync();
  // needs android.permission.ACCESS_WIFI_STATE
  deviceJSON.MacAddress = DeviceInfo.getMacAddressSync();
  // needs android.permission.READ_PHONE_STATE
  deviceJSON.phoneNumber = DeviceInfo.getPhoneNumberSync();
  deviceJSON.ApiLevel = DeviceInfo.getApiLevelSync();
  deviceJSON.carrier = DeviceInfo.getCarrierSync();
  deviceJSON.totalMemory = DeviceInfo.getTotalMemorySync();
  deviceJSON.maxMemory = DeviceInfo.getMaxMemorySync();
  deviceJSON.totalDiskCapacity = DeviceInfo.getTotalDiskCapacitySync();
  deviceJSON.totalDiskCapacityOld = DeviceInfo.getTotalDiskCapacityOldSync();
  deviceJSON.freeDiskStorage = DeviceInfo.getFreeDiskStorageSync();
  deviceJSON.freeDiskStorageOld = DeviceInfo.getFreeDiskStorageOldSync();
  deviceJSON.batteryLevel = DeviceInfo.getBatteryLevelSync();
  deviceJSON.isLandscape = DeviceInfo.isLandscapeSync();
  deviceJSON.isAirplaneMode = DeviceInfo.isAirplaneModeSync();
  deviceJSON.isBatteryCharging = DeviceInfo.isBatteryChargingSync();
  deviceJSON.isPinOrFingerprintSet = DeviceInfo.isPinOrFingerprintSetSync();
  deviceJSON.supportedAbis = DeviceInfo.supportedAbisSync();
  deviceJSON.hasSystemFeature = DeviceInfo.hasSystemFeatureSync(
    'android.software.webview',
  );
  deviceJSON.getSystemAvailableFeatures =
    DeviceInfo.getSystemAvailableFeaturesSync();
  deviceJSON.powerState = DeviceInfo.getPowerStateSync();
  deviceJSON.isLocationEnabled = DeviceInfo.isLocationEnabledSync();
  deviceJSON.headphones = DeviceInfo.isHeadphonesConnectedSync();
  deviceJSON.getAvailableLocationProviders =
    DeviceInfo.getAvailableLocationProvidersSync();
  deviceJSON.bootloader = DeviceInfo.getBootloaderSync();
  deviceJSON.device = DeviceInfo.getDeviceSync();
  deviceJSON.display = DeviceInfo.getDisplaySync();
  deviceJSON.fingerprint = DeviceInfo.getFingerprintSync();
  deviceJSON.hardware = DeviceInfo.getHardwareSync();
  deviceJSON.host = DeviceInfo.getHostSync();
  deviceJSON.product = DeviceInfo.getProductSync();
  deviceJSON.tags = DeviceInfo.getTagsSync();
  deviceJSON.type = DeviceInfo.getTypeSync();
  deviceJSON.baseOS = DeviceInfo.getBaseOsSync();
  deviceJSON.previewSdkInt = DeviceInfo.getPreviewSdkIntSync();
  deviceJSON.securityPatch = DeviceInfo.getSecurityPatchSync();
  deviceJSON.codename = DeviceInfo.getCodenameSync();
  deviceJSON.incremental = DeviceInfo.getIncrementalSync();
  deviceJSON.supported32BitAbis = DeviceInfo.supported32BitAbisSync();
  deviceJSON.supported64BitAbis = DeviceInfo.supported64BitAbisSync();

  return deviceJSON;
};

export const isNetworkAvailable = async () => {
  const response = await NetInfo.fetch();
  return response.isConnected;
};
