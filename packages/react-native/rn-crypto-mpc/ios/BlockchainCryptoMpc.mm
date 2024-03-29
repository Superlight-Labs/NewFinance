#import "BlockchainCryptoMpc.h"

#pragma mark - BlockchainCryptoMpc

@implementation BlockchainCryptoMpc

RCT_EXPORT_MODULE()

MPCCryptoContext *context;
MPCCryptoShare *share;

unsigned flags = 0;

bool finished = false;

RCT_EXPORT_METHOD(initGenerateGenericSecret:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    if ((rv = MPCCrypto_initGenerateGenericSecret(1, 256, &context))){
        reject(@(rv).stringValue, @("MPC Error"), nil);
    }
    
    if(rv == 0)
        resolve(@{@"type": @("sucess")});
        
    else
        reject(@(rv).stringValue, @("MPC Error"), nil);

}




RCT_EXPORT_METHOD(initDeriveBIP32:(nonnull NSNumber*)index withHardened:(nonnull NSNumber*) hardened withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int hardenedInt = [hardened intValue];
    int indexInt = [index intValue];
    int rv = 0;
    
    if ((rv = MPCCrypto_initDeriveBIP32(1, share, hardenedInt, indexInt, &context))){
        reject(@(rv).stringValue, @("MPC Error"), nil);
        return;
    }
    
    resolve(@{@"type": @("sucess")});
}


RCT_EXPORT_METHOD(initGenerateEcdsaKey:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    if((rv = MPCCrypto_initGenerateEcdsaKey(1, &context))) {
        reject(@(rv).stringValue, @("MPC Error"), nil);
        return;
    }
    
    if(rv == 0)
        resolve(@{@"type": @("sucess")});
    else
        reject(@(rv).stringValue, @("MPC Error"), nil);

}

RCT_EXPORT_METHOD(initSignEcdsa:(NSArray*)message withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;

    unsigned long size = [message count];
    char messageChars[size];
    react_array_to_char_array(message, size, messageChars);
    
    if((rv = MPCCrypto_initEcdsaSign(1, share, (const uint8_t *)messageChars, (int)size, 1, &context))) {
        reject(@(rv).stringValue, @("MPC Error"), nil);
        return;
    }
        
    resolve(@{@"type": @("sucess")});
}

RCT_EXPORT_METHOD(importGenericSecret:(NSArray*)secret
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    
    unsigned long size = [secret count];
    char secretChars[size];
    react_array_to_char_array(secret, size, secretChars);
    int rv = 0;

    if ((rv =MPCCrypto_initImportGenericSecret(1, (const uint8_t *)secretChars, (int)size, &context))){
        reject(@(rv).stringValue, @("MPC Error"), nil);
        return;
    }
    
    
    resolve(@{@"type": @("sucess")});
}


RCT_EXPORT_METHOD(verifySignature:(nonnull NSArray*)message withSignature:(nonnull NSArray*) signature withResolver: (RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    unsigned long size = [message count];
    char messageChars[size];
    
    unsigned long sig_size = [signature count];
    char signatureChars[sig_size];
    
    react_array_to_char_array(message, size, messageChars);
    react_array_to_char_array(signature,sig_size, signatureChars);
    
    int pub_key_size = 0;
    if ((rv = MPCCrypto_getEcdsaPublic(share, nullptr, &pub_key_size)))
        reject(@(rv).stringValue, @("MPC Error"), nil);

    
    std::vector<uint8_t> pub_ec_key(pub_key_size);
    if ((rv = MPCCrypto_getEcdsaPublic(share, pub_ec_key.data(), &pub_key_size)))
        reject(@(rv).stringValue, @("MPC Error"), nil);

    
    if ((rv = MPCCrypto_verifyEcdsa(pub_ec_key.data(), (int)pub_ec_key.size(), (const uint8_t *)messageChars, (int)size, (const uint8_t *)signatureChars, (int)sig_size))){
        reject(@(rv).stringValue, @("MPC Error"), nil);
        return;
    }
    
    pub_ec_key.clear();
    
    resolve(@{@"type": @("sucess")});
}

RCT_EXPORT_METHOD(step:(NSString*)messageIn
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    
    std::vector<uint8_t> message_buf;
    int rv = 0;
    
    if(messageIn != nil)
        react_string_to_char_vector(messageIn, message_buf);
        
    if((rv = nativeStep(message_buf, finished))){
        reject(@(rv).stringValue, @("MPC Error"), nil);
        return;
    }
    
    
    NSString * outString;
    char_vector_to_react_string(message_buf, &outString);
    
    if(finished) {
        NSString * shareString;
        std::vector<uint8_t> share_buf;
        
        
        NSString * contextString;
        std::vector<uint8_t> context_buf;
        
        context_to_buf(context, context_buf);
        char_vector_to_react_string(context_buf, &contextString);
        
        share_to_buf(share, share_buf);
        char_vector_to_react_string(share_buf, &shareString);
        
         resolve(@{
            @"type": @("success"),
            @"message": outString,
            @"keyShare": shareString,
            @"context": contextString,
        });
        
        reset();
        
        message_buf.clear();
        share_buf.clear();
        context_buf.clear();
        
        return;
    }
    
    message_buf.clear();
    
    resolve(@{
        @"type": @("inProgress"),
        @"message": outString
    });
}


RCT_EXPORT_METHOD(getDerSignature:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    

    int sig_size = 0;
    if ((rv = MPCCrypto_getResultEcdsaSign(context, nullptr, &sig_size)))
                reject(@(rv).stringValue, @("MPC Error"), nil);

    std::vector<uint8_t> sig(sig_size);
    if ((rv = MPCCrypto_getResultEcdsaSign(context, sig.data(), &sig_size)))
                reject(@(rv).stringValue, @("MPC Error"), nil);

    
    
    NSString *signatureString;
    
    char_vector_to_react_string(sig, &signatureString);
    
    resolve(@{
            @"type": @("sucess"),
            @"signature": signatureString,
        });
    
    sig.clear();
}


RCT_EXPORT_METHOD(getResultDeriveBIP32:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    MPCCrypto_freeShare(share);
    share = nullptr;

    int rv = 0;
    
    if (MPCCrypto_getResultDeriveBIP32(context, &share)){
        reject(@(rv).stringValue, @("MPC Error"), nil);
        return;
    }
    
    std::vector<uint8_t> share_buf;
    if ((rv = share_to_buf(share, share_buf)))
        reject(@(rv).stringValue, @("MPC Error"), nil);

    
    NSString * shareBufString;
    
    char_vector_to_react_string(share_buf, &shareBufString);
    
    resolve(@{
        @"type": @("sucess"),
        @"keyShare": shareBufString,
    });
    
    share_buf.clear();
}



RCT_EXPORT_METHOD(getShare:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    std::vector<uint8_t> share_buf;
    if ((rv = share_to_buf(share, share_buf)))
        reject(@(rv).stringValue, @("MPC Error"), nil);

    
    NSString * shareBufString;
    
    char_vector_to_react_string(share_buf, &shareBufString);
    
    resolve(@{
        @"type": @("sucess"),
        @"keyShare": shareBufString,
    });    

    share_buf.clear();
}

RCT_EXPORT_METHOD(getPublicKey:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;
    
    int pub_key_size = 0;
    
    if ((rv = MPCCrypto_getEcdsaPublic(share, nullptr, &pub_key_size)))
        reject(@(rv).stringValue, @("MPC Error"), nil);

    std::vector<uint8_t> pub_ec_key(pub_key_size);
    
    if ((rv = MPCCrypto_getEcdsaPublic(share, pub_ec_key.data(), &pub_key_size)))
        reject(@(rv).stringValue, @("MPC Error"), nil);

    
    NSString * pubKey;
    
    char_vector_to_react_string(pub_ec_key, &pubKey);
    
    resolve(@{
        @"type": @("sucess"),
        @"publicKey": pubKey,
    });
    
    pub_ec_key.clear();
}

RCT_EXPORT_METHOD(getXPubKey:(nonnull NSNumber*)mainNet
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    int rv = 0;

    int ser_size = 0;
    
    bool isMainNet = (bool) [mainNet intValue];

    if ((rv = MPCCrypto_serializePubBIP32(share, nullptr, &ser_size, isMainNet)))
        reject(@(rv).stringValue, @("MPC Error"), nil);

    char *s = new char[ser_size + 1];
    if ((rv = MPCCrypto_serializePubBIP32(share, s, &ser_size, isMainNet)))
        reject(@(rv).stringValue, @("MPC Error"), nil);


    NSString * xPub;

    char_array_to_react_string(s, &xPub);
 
    delete[] s;
    
    resolve(@{
        @"type": @("sucess"),
        @"xPubKey": xPub,
    });
}

RCT_EXPORT_METHOD(useShare:(nonnull NSString*)shareBuf
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    MPCCrypto_freeShare(share);
    share = nullptr;

    std::vector<uint8_t> share_buf;
    
    react_string_to_char_vector(shareBuf, share_buf);
    share_from_buf(share_buf, share);
    
    resolve(@{
        @"type": @("sucess"),
    });
    
    share_buf.clear();
}

RCT_EXPORT_METHOD(useContext:(nonnull NSString*)contextBuf
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    MPCCrypto_freeShare(share);
    share = nullptr;

    std::vector<uint8_t> context_buf;
    
    react_string_to_char_vector(contextBuf, context_buf);
    context_from_buf(context_buf, context);
            
    resolve(@{
        @"type": @("sucess"),
    });
    
    context_buf.clear();
}



RCT_EXPORT_METHOD(reset:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
{
    reset();
    
    resolve(@{
        @"type": @("sucess"),
    });
}

static void char_vector_to_react_string(std::vector<uint8_t> vector, NSString ** reactString){
    unsigned long cMessageLen = vector.size();
    
    NSMutableArray * reactArray = [[NSMutableArray alloc] initWithCapacity: cMessageLen];
    
    for(int i = 0; i< cMessageLen; i++) {
        reactArray[i] = [NSNumber numberWithInt:vector[i]];
    }
    
    NSData *outData = [NSData dataWithBytes:vector.data() length:vector.size()];
    
    *reactString = [outData base64EncodedStringWithOptions:0];
    
    reactArray = nil;
}

static void char_array_to_react_string(char charArray[], NSString ** reactString){

    *reactString = [NSString stringWithCString:charArray encoding:NSUTF8StringEncoding];
    
}

static void react_string_to_char_vector(NSString * reactString, std::vector<uint8_t> &vector){
    NSData *nsdataFromBase64String = [[NSData alloc]
                                      initWithBase64EncodedString:reactString options:0];
    
    unsigned long size = nsdataFromBase64String.length;
    
    char* buffer = (char* )malloc(size);
    
    [nsdataFromBase64String getBytes:buffer range:NSMakeRange(0, size)];
    
    
    for(int i = 0; i < size; i++) {
        vector.push_back(buffer[i]);
    }

    free(buffer);
}

static void react_string_to_char_array(NSString * reactString, char ** charArray){
    NSData *nsdataFromBase64String = [[NSData alloc]
                                      initWithBase64EncodedString:reactString options:0];
    
    unsigned long size = nsdataFromBase64String.length;
    
    
    *charArray = (char* )malloc(size);
    
    [nsdataFromBase64String getBytes:*charArray range:NSMakeRange(0, size)];
}

static void react_array_to_char_array(NSArray * reactArray, unsigned long size, char* messageChars) {        
    for(int i = 0; i < size; i++) {
        uint8_t value = (uint8_t)[reactArray[i] unsignedIntValue];
        messageChars[i] = value;
    }
}

static int nativeStep(std::vector<uint8_t> &message_buf, bool &finished)
{
    int rv = 0;
    
    MPCCryptoMessage *in = nullptr;
    MPCCryptoMessage *out = nullptr;
    
    if (!message_buf.empty())
    {
        if ((rv = message_from_buf(message_buf, in)))
            return rv;
    }
    
    unsigned flags = 0;
    if ((rv = MPCCrypto_step(context, in, &out, &flags)))
        return rv;
    
    if (in)
        MPCCrypto_freeMessage(in);
    
    std::vector<uint8_t> context_buf;
    if ((rv = context_to_buf(context, context_buf)))
        return rv;
    
    MPCCrypto_freeContext(context);
    context = nullptr;
    if ((rv = context_from_buf(context_buf, context)))
        return rv;
    
    finished = (flags & mpc_protocol_finished) != 0;
    
    if (flags & mpc_share_changed)
    {
        MPCCrypto_freeShare(share);
        share = nullptr;
        if ((rv = MPCCrypto_getShare(context, &share)))
            return rv;
        std::vector<uint8_t> share_buf;
        if ((rv = share_to_buf(share, share_buf)))
            return rv;
        MPCCrypto_freeShare(share);
        share = nullptr;
        if ((rv = share_from_buf(share_buf, share)))
            return rv;
    }
    
    if (out)
    {
        if ((rv = message_to_buf(out, message_buf)))
            return rv;
        MPCCrypto_freeMessage(out);
    }
    else
        message_buf.clear();
    
    return rv;
}


static int share_to_buf(MPCCryptoShare *share, std::vector<uint8_t> &buf)
{
    int rv = 0;
    int size = 0;
    if ((rv = MPCCrypto_shareToBuf(share, nullptr, &size)))
        return rv;
    buf.resize(size);
    if ((rv = MPCCrypto_shareToBuf(share, buf.data(), &size)))
        return rv;
    return 0;
}

static int share_from_buf(const std::vector<uint8_t> &mem, MPCCryptoShare *&share)
{
    return MPCCrypto_shareFromBuf(mem.data(), (int)mem.size(), &share);
}

static int message_to_buf(MPCCryptoMessage *message, std::vector<uint8_t> &buf)
{
    int rv = 0;
    int size = 0;
    if ((rv = MPCCrypto_messageToBuf(message, nullptr, &size)))
        return rv;
    buf.resize(size);
    if ((rv = MPCCrypto_messageToBuf(message, buf.data(), &size)))
        return rv;
    return 0;
}

static int message_from_buf(const std::vector<uint8_t> &mem, MPCCryptoMessage *&message)
{
    return MPCCrypto_messageFromBuf(mem.data(), (int)mem.size(), &message);
}

static int context_to_buf(MPCCryptoContext *context, std::vector<uint8_t> &buf)
{
    int rv = 0;
    int size = 0;
    if ((rv = MPCCrypto_contextToBuf(context, nullptr, &size)))
        return rv;
    buf.resize(size);
    if ((rv = MPCCrypto_contextToBuf(context, buf.data(), &size)))
        return rv;
    return 0;
}

static int context_from_buf(const std::vector<uint8_t> &mem, MPCCryptoContext *&context)
{
   return MPCCrypto_contextFromBuf(mem.data(), (int)mem.size(), &context);
}

static void reset() {
    
    finished = false;
    
    MPCCrypto_freeContext(context);
    MPCCrypto_freeShare(share);
    
    context = nullptr;
    share = nullptr;
    flags = 0;
}

@end
