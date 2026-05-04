package com.imagegallery

import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeviceDetailsModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = MODULE_NAME

  @ReactMethod
  fun getDeviceDetails(promise: Promise) {
    try {
      val map =
        Arguments.createMap().apply {
          putString("brand", Build.BRAND)
          putString("manufacturer", Build.MANUFACTURER)
          putString("model", Build.MODEL)
          putString("device", Build.DEVICE)
          putString("product", Build.PRODUCT)
          putString("systemVersion", Build.VERSION.RELEASE)
          putInt("sdkInt", Build.VERSION.SDK_INT)
        }
      promise.resolve(map)
    } catch (e: Exception) {
      promise.reject("E_DEVICE_DETAILS", e.message, e)
    }
  }

  companion object {
    const val MODULE_NAME = "DeviceDetails"
  }
}
