package com.reactnativesecureencryptionmodule.service;

import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyInfo;
import android.security.keystore.KeyProperties;
import android.util.Log;
import androidx.annotation.RequiresApi;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class EncryptionService {

  private static final String TAG = "EncryptionService";

  @RequiresApi(api = Build.VERSION_CODES.N)
  private static <T> T loadKey(String alias) throws Exception {
    try {
      KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
      keyStore.load(null);

      return (T) keyStore.getEntry(alias, null);
    } catch (Exception e) {
      throw new Exception("Key not found");
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public String generateKeyPair(String alias) throws Exception {
    KeyPairGenerator kpg = null;
    try {
      kpg =
        KeyPairGenerator.getInstance(
          KeyProperties.KEY_ALGORITHM_EC,
          "AndroidKeyStore"
        );

      kpg.initialize(
        new KeyGenParameterSpec.Builder(
          alias,
          KeyProperties.PURPOSE_SIGN | KeyProperties.PURPOSE_VERIFY
        )
          .setDigests(KeyProperties.DIGEST_SHA256)
          .build()
      );
    } catch (Exception e) {
      throw new Exception("Error while creating Keypair");
    }

    KeyPair kp = kpg.generateKeyPair();
    return Base64.getEncoder().encodeToString(kp.getPublic().getEncoded());
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public boolean deleteKeyPair(String alias) throws Exception {
    try {
      KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
      keyStore.load(null);
      keyStore.deleteEntry(alias);

      return true;
    } catch (Exception e) {
      throw new Exception("Key not found");
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public String getKey(String keyName) throws Exception {
    KeyStore.PrivateKeyEntry key = loadKey(keyName);

    if (key == null) {
      throw new Exception("Key not found");
    }

    X509EncodedKeySpec spec = new X509EncodedKeySpec(
      key.getCertificate().getPublicKey().getEncoded()
    );

    return Base64.getEncoder().encodeToString(spec.getEncoded());
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public String sign(String keyName, String message) throws Exception {
    KeyStore.PrivateKeyEntry key = loadKey(keyName);
    byte[] msg = message.getBytes(StandardCharsets.UTF_8);

    try {
      Signature s = Signature.getInstance("SHA256withECDSA");

      s.initSign(key.getPrivateKey());
      s.update(msg);
      byte[] signature = s.sign();

      return Base64.getEncoder().encodeToString(signature);
    } catch (Exception e) {
      throw new Exception("Failed to sign Message", e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public boolean verify(String keyName, String signature, String message)
    throws Exception {
    KeyStore.PrivateKeyEntry entry = loadKey(keyName);
    try {
      byte[] sig = Base64.getDecoder().decode(signature.getBytes());
      byte[] msg = message.getBytes(StandardCharsets.UTF_8);
      Signature s = Signature.getInstance("SHA256withECDSA");
      s.initVerify(entry.getCertificate());
      s.update(msg);

      Log.i(TAG, "Actually Comparing");
      return s.verify(sig);
    } catch (Exception e) {
      throw new Exception("Failed to verify Message", e);
    }
  }

  @RequiresApi(api = Build.VERSION_CODES.O)
  public boolean isKeySecuredOnHardware(String keyName) throws Exception {
    KeyStore.PrivateKeyEntry entry = loadKey(keyName);

    try {
      KeyFactory factory = KeyFactory.getInstance(
        entry.getPrivateKey().getAlgorithm(),
        "AndroidKeyStore"
      );
      KeyInfo keyInfo = factory.getKeySpec(
        entry.getPrivateKey(),
        KeyInfo.class
      );

      return keyInfo.isInsideSecureHardware();
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Failed to evaluate security of KeyPair", e);
    }
  }

  public String encrypt(String keyName, String message) throws Exception {
    throw new Exception("Encryption not supported on Android");
  }

  public String decrypt(String keyName, String cipherText) throws Exception {
    throw new Exception("Decryption not supported on Android");
  }
}
