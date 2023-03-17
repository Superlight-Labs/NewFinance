package com.reactnativeblockchaincryptompc;

import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativeblockchaincryptompc.cryptompc.Context;
import com.reactnativeblockchaincryptompc.cryptompc.MPCException;
import com.reactnativeblockchaincryptompc.cryptompc.StepManager;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Signature;
import java.security.SignatureException;
import java.security.interfaces.ECPublicKey;
import java.security.spec.InvalidKeySpecException;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

@ReactModule(name = BlockchainCryptoMpcModule.NAME)
public class BlockchainCryptoMpcModule extends ReactContextBaseJavaModule {

  public static final String NAME = "BlockchainCryptoMpc";

  StepManager stepManager = null;
  boolean protocolfinished;
  Signature sig;

  public BlockchainCryptoMpcModule(ReactApplicationContext reactContext) {
    super(reactContext);
    try {
      sig = Signature.getInstance("NoneWithECDSA", new BouncyCastleProvider());
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    }
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void initGenerateEcdsaKey(Promise promise) {
    try {
      stepManager = new StepManager(Context.initGenerateEcdsaKey(1), null);
      promise.resolve(true);
    } catch (MPCException e) {
      e.printStackTrace();
      promise.resolve(false);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void initSignEcdsa(ReadableArray message, Promise promise) {
    byte[] messageChars = readableArrayToByteArray(message);

    try {
      stepManager.setContext(stepManager.getShare().initEcdsaSign(1, messageChars, true));
      promise.resolve(true);
    } catch (MPCException e) {
      e.printStackTrace();
      promise.resolve(false);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void getSignature(Promise promise) {
    if (!protocolfinished) {
      promise.resolve("Not finished");
      return;
    }

    try {
      byte[] sig = stepManager.getContext().getResultEcdsaSign();
      promise.resolve(byteArrayToWritableArray(sig));
    } catch (MPCException e) {
      e.printStackTrace();
      promise.resolve("Failure " + e.errorCode);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void verifySignature(
    ReadableArray message,
    ReadableArray signature,
    Promise promise
  ) {
    byte[] messagechars = readableArrayToByteArray(message);
    byte[] signaturechars = readableArrayToByteArray(signature);

    try {
      ECPublicKey pubKey = stepManager.getShare().getEcdsaPublic();
      sig.initVerify(pubKey);
      sig.update(messagechars);

      if (!sig.verify(signaturechars)) {
        promise.resolve(false);
        return;
      }

      promise.resolve(true);
    } catch (SignatureException e) {
      promise.resolve(
        "Something is wrong with the signature " + e.getMessage()
      );
      e.printStackTrace();
    } catch (InvalidKeyException e) {
      e.printStackTrace();
      promise.resolve("Invalid Key " + e.getMessage());
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
      promise.resolve("No Such Algorithm supported " + e.getMessage());
    } catch (InvalidKeySpecException e) {
      promise.resolve("Invalid Key Spec " + e.getMessage());
      e.printStackTrace();
    } catch (MPCException e) {
      promise.resolve("Failure " + e.getMessage());

      e.printStackTrace();
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void getPublicKey(Promise promise) {
    ECPublicKey pubKey = null;
    try {
      pubKey = stepManager.getShare().getEcdsaPublic();
      promise.resolve(byteArrayToWritableArray(pubKey.getEncoded()));
    } catch (MPCException e) {
      promise.resolve("Failure " + e.getMessage());
      e.printStackTrace();
    } catch (NoSuchAlgorithmException e) {
      promise.resolve("No Such Algorithm supported " + e.getMessage());
      e.printStackTrace();
    } catch (InvalidKeySpecException e) {
      promise.resolve("Invalid Key Spec " + e.getMessage());
      e.printStackTrace();
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void step(ReadableArray messageIn, Promise promise) {
    byte[] messageInchars = readableArrayToByteArray(messageIn);

    try {
      Context.MessageAndFlags msgAndFlags = stepManager.step(messageInchars);

      protocolfinished = msgAndFlags.protocolFinished;

      promise.resolve((byteArrayToWritableArray(msgAndFlags.message.toBuf())));
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject(e.getMessage(), "Error while stepping");
    }
  }


  private static byte[] readableArrayToByteArray(ReadableArray in) {
    if (in == null) {
      return null;
    }

    int size = in.size();
    byte[] out = new byte[size];

    for (int i = 0; i < size; i++) {
      out[i] = (byte)in.getInt(i);
    }

    return out;
  }

  private static WritableArray byteArrayToWritableArray(byte[] in) {
    WritableArray out = new WritableNativeArray();

    int size = in.length;

    for (int i = 0; i < size; i++) {
      out.pushInt((char)in[i]);
    }

    return out;
  }
}
