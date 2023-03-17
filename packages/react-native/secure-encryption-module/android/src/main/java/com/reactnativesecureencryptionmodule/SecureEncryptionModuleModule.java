package com.reactnativesecureencryptionmodule;

import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativesecureencryptionmodule.service.EncryptionService;

@ReactModule(name = SecureEncryptionModuleModule.NAME)
public class SecureEncryptionModuleModule extends ReactContextBaseJavaModule {

  public static final String NAME = "SecureEncryptionModule";
  private final EncryptionService encryptionService;

  public SecureEncryptionModuleModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.encryptionService = new EncryptionService();
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void generateKeyPair(String alias, Promise promise) {
    try {
      promise.resolve(encryptionService.generateKeyPair(alias));
    } catch(Exception e) {
      e.printStackTrace();
      promise.reject(e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void deleteKeyPair(String alias, Promise promise) {
    try {
      promise.resolve(encryptionService.deleteKeyPair(alias));
    } catch(Exception e) {
      e.printStackTrace();
      promise.reject(e);
    }
  }
  

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void encrypt(String clearText, String keyName, Promise promise) {
    try {
      promise.resolve(encryptionService.encrypt(keyName, clearText));
    } catch(Exception e) {
      promise.reject(e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void decrypt(String encryptedText, String keyName, Promise promise) {
    try {
      promise.resolve(encryptionService.decrypt(keyName, encryptedText));
    } catch(Exception e) {
      e.printStackTrace();
      promise.reject(e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void signMessage(String message, String keyName, Promise promise) {
    try {
      promise.resolve(encryptionService.sign(keyName, message));
    } catch(Exception e) {
      e.printStackTrace();
      promise.reject(e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void verifySignature(
    String signature,
    String message,
    String keyName,
    Promise promise
  ) {
    try {
      promise.resolve(encryptionService.verify(keyName, signature, message));
    }catch (Exception e) {
      e.printStackTrace();
      promise.reject(e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void isKeySecuredOnHardware(String keyName, Promise promise) {
    try {
      promise.resolve(encryptionService.isKeySecuredOnHardware(keyName));
    } catch (Exception e) {
      e.printStackTrace();
      promise.reject(e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  @ReactMethod
  public void getKey(String alias, Promise promise) {
    try {
      promise.resolve(encryptionService.getKey(alias));
    } catch(Exception e) {
      promise.reject(e);
      e.printStackTrace();
    }
  }
}
