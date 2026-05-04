import { NativeModules, Platform } from 'react-native';

export type DeviceDetailsPayload = {
  brand: string;
  manufacturer?: string;
  model: string;
  device?: string;
  product?: string;
  systemVersion: string;
  sdkInt?: number;
  name?: string;
};

type NativeDeviceDetails = {
  getDeviceDetails: () => Promise<DeviceDetailsPayload>;
};

const native: NativeDeviceDetails | undefined =
  NativeModules.DeviceDetails as NativeDeviceDetails | undefined;

export async function fetchDeviceDetails(): Promise<DeviceDetailsPayload> {
  if (native?.getDeviceDetails) {
    return native.getDeviceDetails();
  }
  return {
    brand: 'unknown',
    model: 'unknown',
    systemVersion: String(Platform.Version),
  };
}
