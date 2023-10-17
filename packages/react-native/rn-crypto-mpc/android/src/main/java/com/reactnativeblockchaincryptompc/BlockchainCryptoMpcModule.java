package com.reactnativeblockchaincryptompc;

import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativeblockchaincryptompc.cryptompc.Context;
import com.reactnativeblockchaincryptompc.cryptompc.MPCException;
import com.reactnativeblockchaincryptompc.cryptompc.Message;
import com.reactnativeblockchaincryptompc.cryptompc.ResultBuilder;
import com.reactnativeblockchaincryptompc.cryptompc.Share;
import com.reactnativeblockchaincryptompc.cryptompc.StepManager;
import com.reactnativeblockchaincryptompc.cryptompc.Type;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Signature;
import java.security.SignatureException;
import java.security.interfaces.ECPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

@ReactModule(name = BlockchainCryptoMpcModule.NAME)
public class BlockchainCryptoMpcModule extends ReactContextBaseJavaModule {
  private ResultBuilder rb = new ResultBuilder();
  public static final String NAME = "BlockchainCryptoMpc";

  StepManager stepManager = new StepManager(new Context(), new Share());
  boolean protocolFinished;
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
  public void initGenerateGenericSecret(Promise promise) {
    try {
      stepManager = new StepManager(Context.initGenerateGenericSecret(1, 256), null);
      promise.resolve( rb.withType(Type.success).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error", e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void initDeriveBIP32(int index, int hardened, Promise promise) {
    try {
      Share share = stepManager.getShare();

      Context context = share.initDeriveBIP32(1,hardened == 1, index);

      stepManager.setContext(context);

      promise.resolve( rb.withType(Type.success).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error", e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void initGenerateEcdsaKey(Promise promise) {
    try {
      stepManager = new StepManager(Context.initGenerateEcdsaKey(1), null);
      promise.resolve( rb.withType(Type.success).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error", e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void useShare(String in, Promise promise) {
    stepManager.reset();


    byte[] shareBytes = stringToByteArray(in);

    try {
      stepManager.setShare(Share.fromBuf(shareBytes));
      promise.resolve(rb.withType(Type.success).build());
    } catch (MPCException e) {
      promise.reject("MPC Error",e);
      e.printStackTrace();
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void useContext(String contextBuf, Promise promise) {
    Log.i("asdf", "Set context");
    byte[] contextBytes = stringToByteArray(contextBuf);

    try {
      stepManager.setContext(Context.fromBuf(contextBytes));
      promise.resolve(rb.withType(Type.success).build());
    } catch (MPCException e) {
      promise.reject("MPC Error",e);
      e.printStackTrace();
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void initSignEcdsa(ReadableArray message, Promise promise) {
    byte[] messageChars = readableArrayToByteArray(message);

    try {
      stepManager.setContext(stepManager.getShare().initEcdsaSign(1, messageChars, true));
      promise.resolve( rb.withType(Type.success).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error", e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void importGenericSecret(ReadableArray secret, Promise promise) {
    byte[] secretChars = readableArrayToByteArray(secret);

    try {
      stepManager = new StepManager(Context.initImportGenericSecret(1, secretChars), null);
      promise.resolve( rb.withType(Type.success).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error", e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void verifySignature(
          String message,
          String signature,
          Promise promise
  ) {
    byte[] messageChars = stringToByteArray(message);
    byte[] signatureChars = stringToByteArray(signature);

    try {
      ECPublicKey pubKey = stepManager.getShare().getEcdsaPublic();
      sig.initVerify(pubKey);
      sig.update(messageChars);

      if (!sig.verify(signatureChars)) {
        promise.reject("Signature invalid", new Exception());
        return;
      }

      promise.resolve( rb.withType(Type.success).build());
    } catch (SignatureException e) {
      promise.reject(
              "Something is wrong with the signature ", e
      );
      e.printStackTrace();
    } catch (InvalidKeyException e) {
      e.printStackTrace();
      promise.reject("Invalid Key ",e);
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
      promise.reject("No Such Algorithm supported ", e);
    } catch (InvalidKeySpecException e) {
      promise.reject("Invalid Key Spec ", e);
      e.printStackTrace();
    } catch (MPCException e) {
      promise.reject("Failure ", e);

      e.printStackTrace();
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void getDerSignature(Promise promise) {
    if (!protocolFinished) {
      promise.reject("Not finished", new Exception());
      return;
    }

    try {
      promise.resolve(rb.withType(Type.success).withSignature(byteArrayToString(stepManager.getContext().getResultEcdsaSign())).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error while getting Signature",e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void getResultDeriveBIP32(Promise promise) {

    stepManager.getShare().close();


    Log.i("asdf", "Trying to get res " + protocolFinished);
    if (!protocolFinished) {
      promise.reject("Not finished", new Exception());
      return;
    }

    try {
      promise.resolve(rb.withType(Type.success).withKeyShare(byteArrayToString(stepManager.getContext().getResultDeriveBIP32().toBuf())).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error",e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void getShare(Promise promise) {
    try {
      promise.resolve(rb.withType(Type.success).withKeyShare(byteArrayToString(stepManager.getShare().toBuf())).build());
    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject("MPC Error",e);
    }
  }

 

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void getPublicKey(Promise promise) {
    ECPublicKey pubKey = null;
    try {
      pubKey = stepManager.getShare().getEcdsaPublic();
      promise.resolve(rb.withType(Type.success).withPublicKey(byteArrayToString(pubKey.getEncoded())).build());
    } catch (MPCException e) {
      promise.reject("MPC Error",e);
      e.printStackTrace();
    } catch (NoSuchAlgorithmException e) {
      promise.reject("No Such Algorithm supported", e);
      e.printStackTrace();
    } catch (InvalidKeySpecException e) {
      promise.reject("Invalid Key Spec ", e);
      e.printStackTrace();
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void getXPubKey(boolean isMainNet, Promise promise) {
    try {
      String pubKey = stepManager.getShare().serializePubBIP32(isMainNet);
      promise.resolve(rb.withType(Type.success).withXPubKey(pubKey).build());
    } catch (MPCException e) {
      promise.reject("MPC Error",e);
      e.printStackTrace();
    }
  }



  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void step(String messageIn, Promise promise) {
    byte[] messageInChars = stringToByteArray(messageIn);

    try {
      Context.MessageAndFlags msgAndFlags = stepManager.step(messageInChars);
      protocolFinished = msgAndFlags.protocolFinished;

      Message msg = msgAndFlags.message;
      String message = byteArrayToString(msg != null ? msg.toBuf() : new byte[0]);

      if(!protocolFinished) {
        promise.resolve(rb.withMessage(message).withType(Type.inProgress).build());
      }

      String context = byteArrayToString(stepManager.getContext().toBuf());
      String share = byteArrayToString(stepManager.getShare().toBuf());

      promise.resolve(rb.withMessage(message)
                        .withType(Type.success)
                        .withKeyShare(share)
                        .withContext(context)
                        .build());


    } catch (MPCException e) {
      e.printStackTrace();
      promise.reject(e.getMessage(), "Error while stepping");
    }
  }



  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  @ReactMethod
  public void reset(Promise promise) {
    this.protocolFinished = false;
    this.rb.reset();
    this.stepManager.reset();

    promise.resolve(rb.withType(Type.success).build());
  }

  private static String byteArrayToString(byte[] in) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      return Base64.getEncoder().encodeToString(in);
    }

    return "";
  }

  private static byte[] stringToByteArray(String in) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O || in == null) {
      return null;
    }

    return Base64.getDecoder().decode(in);
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

}
