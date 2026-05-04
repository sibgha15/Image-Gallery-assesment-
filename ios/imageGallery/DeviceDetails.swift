import Foundation
import React
import UIKit

@objc(DeviceDetails)
class DeviceDetails: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(getDeviceDetails:rejecter:)
  func getDeviceDetails(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let device = UIDevice.current
    resolve([
      "brand": "Apple",
      "manufacturer": "Apple",
      "model": device.model,
      "device": device.model,
      "product": device.model,
      "systemVersion": device.systemVersion,
      "name": device.name,
    ])
  }
}
