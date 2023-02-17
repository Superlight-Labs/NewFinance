import logger from '@lib/logger';
import { Buffer } from 'buffer';
import ref from 'ref-napi';
import native from './native';

function verifyEcdsaBackupKey(backupPublicKey, publicKey, backup) {
  return (
    native.MPCCrypto_verifyEcdsaBackupKey(
      backupPublicKey,
      backupPublicKey.length,
      publicKey,
      publicKey.length,
      backup,
      backup.length
    ) === 0
  );
}

function restoreEcdsaKey(backupPrivateKey, publicKey, backup) {
  const sizePtr = ref.alloc(native.IntPtr);
  native.checkAndThrowError(
    native.MPCCrypto_restoreEcdsaKey(
      backupPrivateKey,
      backupPrivateKey.length,
      publicKey,
      publicKey.length,
      backup,
      backup.length,
      null,
      sizePtr
    )
  );
  const privateKey = Buffer.alloc(sizePtr.readInt32LE());
  native.checkAndThrowError(
    native.MPCCrypto_restoreEcdsaKey(
      backupPrivateKey,
      backupPrivateKey.length,
      publicKey,
      publicKey.length,
      backup,
      backup.length,
      privateKey,
      sizePtr
    )
  );
  return privateKey;
}

function verifyEddsaBackupKey(backupPublicKey, publicKey, backup) {
  return (
    native.MPCCrypto_verifyEddsaBackupKey(
      backupPublicKey,
      backupPublicKey.length,
      publicKey,
      backup,
      backup.length
    ) === 0
  );
}

function restoreEddsaKey(backupPrivateKey, publicKey, backup) {
  const privateKey = Buffer.alloc(32);
  native.checkAndThrowError(
    native.MPCCrypto_restoreEddsaKey(
      backupPrivateKey,
      backupPrivateKey.length,
      publicKey,
      backup,
      backup.length,
      privateKey
    )
  );
  return privateKey;
}

function run(c1, c2) {
  let m;
  let count = 0;
  while (!c1.isFinished() || !c2.isFinished()) {
    count++;
    if (!c1.isFinished()) {
      logger.info('Step ' + count + ' client input ' + m?.length);

      m = c1.step(m);
      logger.info('Step ' + count + ' Client output ' + m?.length);
    }
    if (!m) {
      break;
    }
    if (!c2.isFinished()) {
      m = c2.step(m);
    }
  }
}

export default {
  run,
  verifyEcdsaBackupKey,
  restoreEcdsaKey,
  verifyEddsaBackupKey,
  restoreEddsaKey,
};
