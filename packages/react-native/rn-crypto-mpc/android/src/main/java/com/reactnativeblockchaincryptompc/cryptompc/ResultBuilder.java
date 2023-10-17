package com.reactnativeblockchaincryptompc.cryptompc;


import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;



public class ResultBuilder {
    private WritableMap wm;

    public ResultBuilder() {
        this.wm = new WritableNativeMap();

    }

    public ResultBuilder withType(Type type) {
        this.wm.putString("type", type.toString());
        return this;
    }

    public ResultBuilder withMessage(String message){
        this.wm.putString("message", message);

        return this;
    }

    public ResultBuilder withContext(String context){
        this.wm.putString("context", context);

        return this;
    }

    public ResultBuilder withKeyShare(String share){
        this.wm.putString("keyShare", share);
        return this;
    }

    public ResultBuilder withSignature(String signature){
        this.wm.putString("signature", signature);

        return this;
    }

    public ResultBuilder withPublicKey(String publicKey){
        this.wm.putString("publicKey", publicKey);

        return this;
    }

    public ResultBuilder withXPubKey(String xPubKey){
        this.wm.putString("xPubKey", xPubKey);

        return this;
    }

    public WritableMap build() {

        WritableMap result = this.wm;

        this.wm = new WritableNativeMap();


        return result;
    }

    public void reset() {
        this.wm = new WritableNativeMap();
    }
}