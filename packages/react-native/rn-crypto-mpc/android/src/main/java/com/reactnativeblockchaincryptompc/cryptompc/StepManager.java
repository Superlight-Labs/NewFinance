package com.reactnativeblockchaincryptompc.cryptompc;

import android.os.Build;

import androidx.annotation.RequiresApi;

public class StepManager {

  private Context context;
  private Share share;
  byte[] messageBuf = null;

  public StepManager(Context context, Share share) {
    this.context = context;
    this.share = share;
  }

  public Context getContext() {
    return context;
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  public void setContext(Context context) {
    this.context.close();
    this.context = context;
  }

  public Share getShare() {
    return share;
  }

  @RequiresApi(api = Build.VERSION_CODES.KITKAT)
  public Context.MessageAndFlags step(byte[] messageFromServer) throws MPCException
  {
    Context.MessageAndFlags messageAndFlags = null;
    messageBuf = messageFromServer;

    try {
      Message inMessage = (messageBuf == null) ? null : Message.fromBuf(messageBuf);
      messageAndFlags = context.step(inMessage);
      byte[] contextBuf = context.toBuf();
      context.close();
      context = Context.fromBuf(contextBuf);

      if (messageAndFlags.shareChanged) {
        if (share != null) share.close();
        share = context.getShare();

        byte[] shareBuf = share.toBuf();
        share.close();
        share = Share.fromBuf(shareBuf);
      }

      messageBuf = null;
    }catch(Exception e) {
      e.printStackTrace();
    }
    return messageAndFlags;
  }
}
