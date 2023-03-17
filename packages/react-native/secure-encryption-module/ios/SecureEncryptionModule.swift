import Security
import Foundation

@objc(SecureEncryptionModule)
class SecureEncryptionModule: NSObject {
    
    @objc(decrypt:keyName:resolver:rejecter:)
    func decrypt(_ encryptedText: NSString,keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("decrypting message")
        
        let secKey = SecureEncryptionModule.loadKey(name: (key as String))!
        
        do {
         try resolve(Encryption.decrypt(encryptedText: encryptedText as String, privateKey: secKey))
        } catch SecureEncryptionError.message(let errorMessage) {
            reject(nil, errorMessage, nil)
        } catch {
            reject(nil, "Unexpected Error", nil)
        }
    }
    
    @objc(encrypt:keyName:resolver:rejecter:)
    func encrypt(_ clearText: NSString,keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Encrypting Message")
        
        let secKey = SecureEncryptionModule.loadKey(name:key as String)!
        
        guard let publicKey = SecKeyCopyPublicKey(secKey) else {
            reject(nil, "Cant get Public Key", nil)
            return
        }
        
        do {
         try resolve(Encryption.encrypt(clearText: clearText as String, publicKey: publicKey))
        } catch SecureEncryptionError.message(let errorMessage) {
            reject(nil, errorMessage, nil)
        } catch {
            reject(nil, "Unexpected Error", nil)
        }
    }
    
    @objc(signMessage:keyName:resolver:rejecter:)
    func signMessage(_ message: NSString, keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Signing Message")
        
        let secKey = SecureEncryptionModule.loadKey(name:key as String)!
        
        do {
         try resolve(Signature.sign(message: message as String, privateKey: secKey))
    } catch SecureEncryptionError.message(let errorMessage) {
        reject(nil, errorMessage, nil)
    } catch {
        reject(nil, "Unexpected Error", nil)
    }
    }
    
    @objc(verifySignature:signedString:keyName:resolver:rejecter:)
    func verifySignature(_ signature: NSString, signedString message: NSString, keyName key: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Signing Message")
        
        let secKey = SecureEncryptionModule.loadKey(name:key as String)
        
        guard secKey != nil else {
            reject(nil, "Cant get Public Key", nil)
            return
        }
        
        guard let publicKey = SecKeyCopyPublicKey(secKey!) else {
            reject(nil, "Cant get Public Key", nil)
            return
        }
        
        do {
         try resolve(Signature.verify(signature: signature as String, signedString: message as String, publicKey: publicKey))
    } catch SecureEncryptionError.message(let errorMessage) {
        reject(nil, errorMessage, nil)
    } catch {
        reject(nil, "Unexpected Error", nil)
    }
    }
    
    @objc(isKeySecuredOnHardware:resolver:rejecter:)
    func isKeySecuredOnHardware(_ keyName: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        
        let secKey = SecureEncryptionModule.loadKey(name:keyName as String)
        
        guard secKey != nil else {
            reject(nil, "Cant get Public Key", nil)
            return
        }
        
        // Resolving to true here, iOs does not provide a simple api for checking hardware security. But as long as the device is not jailbreaked
        // We are safe to assume that the key is only available for the Secure Enclave because we passed the corresponindg parameters in "generateKeyPair"
        resolve(true)
    }
    
    @objc(deleteKeyPair:resolver:rejecter:)
    func deleteKeyPair(_ alias: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        let tag = (alias as String).data(using: .utf8)!
        
        let query: [String: Any] = [
            kSecClass as String                 : kSecClassKey,
            kSecAttrApplicationTag as String    : tag,
            kSecAttrKeyType as String           : kSecAttrKeyTypeEC,
            kSecReturnRef as String             : true
        ]

        
        let status = SecItemDelete(query as CFDictionary)
        
        guard status == errSecSuccess else {
            reject(status.description, "Error while deleting key", nil)
            return;
        }
        
        resolve(true);
    }
    
    @objc(generateKeyPair:resolver:rejecter:)
    func generateKeyPair(_ alias: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        print("Generating Key Pair")
        // let flags: SecAccessControlCreateFlags
        
        // if #available(iOS 11.3, *) {
        //    flags = [.privateKeyUsage, .biometryCurrentSet]
        // } else {
        //    flags = [.privateKeyUsage, .touchIDCurrentSet]
        // }
        
        // let access = SecAccessControlCreateWithFlags(kCFAllocatorDefault, // kSecAttrAccessibleWhenUnlockedThisDeviceOnly, flags, nil)!
        
        let access =
        SecAccessControlCreateWithFlags(kCFAllocatorDefault,kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
                                        [.privateKeyUsage],
                                        nil)!
        
        let tag = (alias as String).data(using: .utf8)!
        let attributes: [String: Any] = [
            kSecAttrKeyType as String : kSecAttrKeyTypeEC,
            kSecAttrKeySizeInBits as String : 256,
            kSecAttrTokenID as String : kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String : [
                kSecAttrIsPermanent as String       : true,
                kSecAttrApplicationTag as String    : tag,
                kSecAttrAccessControl as String     : access
            ]
        ]
        
        var error: Unmanaged<CFError>?
        guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            let err = error!.takeRetainedValue() as Error
            reject(nil, "Error while creating KeyPair", err)
            print(err)
            return
        }
        
        guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
            reject(nil, "Cant get Public Key", nil)
            return
        }
        
        guard let cfdata = SecKeyCopyExternalRepresentation(publicKey, &error) else {
            reject(nil, "Cant export Public Key", nil)
            print(error!)
            return
        }
        
         let publicKeyDER = createSubjectPublicKeyInfo(rawPublicKeyData: cfdata as Data)
        
        
        print("Successfully created keypiar")
        resolve(publicKeyDER.base64EncodedString());
    }
    
    @objc(getKey:resolver:rejecter:)
    func getKey(_ alias: NSString, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        let secKey = SecureEncryptionModule.loadKey(name:alias as String)
        
        guard secKey != nil else {
            reject(nil, "Cant get Public Key", nil)
            return
        }
        
        var error: Unmanaged<CFError>?
        guard let publicKey = SecKeyCopyPublicKey(secKey!) else {
            reject(nil, "Cant get Public Key", nil)
            return
        }
        
        guard let cfdata = SecKeyCopyExternalRepresentation(publicKey, &error) else {
            reject(nil, "Cant export Public Key", nil)
            print(error!)
            return
        }
        
        let publicKeyDER = createSubjectPublicKeyInfo(rawPublicKeyData: cfdata as Data)
        
        
        print("Successfully loaded keypiar")
        resolve(publicKeyDER.base64EncodedString());
    }
    
    static func loadKey(name: String) -> SecKey? {
        let tag = name.data(using: .utf8)!
        
        let query: [String: Any] = [
            kSecClass as String                 : kSecClassKey,
            kSecAttrApplicationTag as String    : tag,
            kSecAttrKeyType as String           : kSecAttrKeyTypeEC,
            kSecReturnRef as String             : true
        ]
        
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess else {
            print("Error: No key found")
            return nil
        }
        
        return (item as! SecKey)
    }
}

func createSubjectPublicKeyInfo(rawPublicKeyData: Data) -> Data {
    let secp256r1Header = Data(_: [
        0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a,
        0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x03, 0x42, 0x00
        ])
    return secp256r1Header + rawPublicKeyData
}
