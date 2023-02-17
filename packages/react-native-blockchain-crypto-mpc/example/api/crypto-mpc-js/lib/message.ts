import { Buffer } from 'buffer';
import ref from 'ref-napi';
import native from './native';

class Message {
  messagePtr;
  constructor(messagePtr) {
    this.messagePtr = messagePtr;
  }

  free() {
    if (this.messagePtr) {
      native.MPCCrypto_freeMessage(this.messagePtr);
      this.messagePtr = null;
    }
  }

  toBuffer() {
    const sizePtr = ref.alloc(native.IntPtr);
    native.checkAndThrowError(
      native.MPCCrypto_messageToBuf(this.messagePtr, null, sizePtr)
    );
    const buffer = Buffer.alloc(sizePtr.readInt32LE());
    native.checkAndThrowError(
      native.MPCCrypto_messageToBuf(this.messagePtr, buffer, sizePtr)
    );
    return buffer;
  }

  static fromBuffer(buffer) {
    const messagePtrPtr = ref.alloc(native.VoidPtrPtr);
    native.checkAndThrowError(
      native.MPCCrypto_messageFromBuf(buffer, buffer.length, messagePtrPtr)
    );
    return new Message(messagePtrPtr.deref());
  }
}

export default Message;
