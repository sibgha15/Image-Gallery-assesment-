/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const mockRN = require('react-native');
  return {
  __esModule: true,
  default: {
    View: mockRN.View,
    Text: mockRN.Text,
    Image: mockRN.Image,
    createAnimatedComponent: (c) => c,
  },
  useSharedValue: (v) => ({ value: v }),
  useAnimatedStyle: (fn) => {
    try {
      return typeof fn === 'function' ? fn() : {};
    } catch {
      return {};
    }
  },
  withSpring: (v) => v,
  withTiming: (v) => v,
  withSequence: (...args) => args[args.length - 1],
  };
});

jest.mock('./src/native/DeviceDetails', () => ({
  fetchDeviceDetails: jest.fn().mockResolvedValue({
    brand: 'TestBrand',
    model: 'TestModel',
    systemVersion: '1.0',
  }),
}));
