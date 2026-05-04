#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceDetails, NSObject)

RCT_EXTERN_METHOD(getDeviceDetails:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
