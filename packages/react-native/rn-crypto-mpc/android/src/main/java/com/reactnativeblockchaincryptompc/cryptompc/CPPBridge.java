package com.reactnativeblockchaincryptompc.cryptompc;

public class CPPBridge {
  static {
    try {
      System.loadLibrary("nativempc");
      //   Log.d(TAG, "-------- libcpp-code: loaded");
    } catch (Exception e) {
      //   Log.d(TAG, "-------- libcpp-code: loaded", e);
    }
  }

  public static native long multiply(long a, long b);
}
