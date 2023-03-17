//
//  Encryption.swift
//  SecureEncryptionModule
//
//  Created by Laurenz Honauer on 23.05.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import Security

@available(iOS 11.0, *)
class Encryption {
    
    static var algorithm: SecKeyAlgorithm = .eciesEncryptionCofactorVariableIVX963SHA256AESGCM
    
    static func decrypt(encryptedText: String, privateKey: SecKey) throws -> String  {
        guard SecKeyIsAlgorithmSupported(privateKey, .decrypt, algorithm) else {
            throw SecureEncryptionError.message("Algorithm not supported on this Device")
        }
        
        var error: Unmanaged<CFError>?
        let encryptedData = Data.init(base64Encoded: encryptedText)
                
        let clearTextData = SecKeyCreateDecryptedData(privateKey,
                                                      algorithm,
                                                      encryptedData! as CFData,
                                                      &error)! as NSData as Data
        
        return String(decoding: clearTextData, as: UTF8.self)
    }
    
    static func encrypt(clearText: String,publicKey: SecKey) throws -> String {
        print("Encrypting Message")
        
        guard SecKeyIsAlgorithmSupported(publicKey, .encrypt, algorithm) else {
            throw SecureEncryptionError.message("Algorithm not supported on this Device")
        }
        
        var error: Unmanaged<CFError>?
        let clearTextData = (clearText).data(using: .utf8)!
        
        let cipherTextData = SecKeyCreateEncryptedData(publicKey, algorithm,
                                                       clearTextData as CFData,
                                                       &error)
        guard cipherTextData != nil else {
            print(error!)
            throw SecureEncryptionError.message("Could not encrypt message")
        }

        return (cipherTextData! as Data).base64EncodedString()
    }
}
