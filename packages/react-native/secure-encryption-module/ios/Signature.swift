//
//  Signature.swift
//  SecureEncryptionModule
//
//  Created by Laurenz Honauer on 23.05.22.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

class Signature {
    
    static var algorithm: SecKeyAlgorithm = .ecdsaSignatureMessageX962SHA256

    static func sign(message: String, privateKey: SecKey) throws -> String {
        
        let messageData = (message).data(using: .utf8)! as CFData

        guard SecKeyIsAlgorithmSupported(privateKey, .sign, algorithm) else {
            throw SecureEncryptionError.message("Algorithm not supported on this Device")
        }
        
        var error: Unmanaged<CFError>?
        
        let signedMessage = SecKeyCreateSignature(privateKey, Signature.algorithm, messageData, &error)
        
        guard signedMessage != nil else {
            print(error!)
            throw SecureEncryptionError.message("Could not sign message")
        }
        
        return (signedMessage! as Data).base64EncodedString()
    }
    
    static func verify(signature: String, signedString: String, publicKey: SecKey) throws -> Bool {
        let signatureData = Data.init(base64Encoded: signature)! as CFData
        let signedMessageData = (signedString).data(using: .utf8)! as CFData
        
        guard SecKeyIsAlgorithmSupported(publicKey, .verify, algorithm) else {
            throw SecureEncryptionError.message("Algorithm not supported on this Device")
        }

        var error: Unmanaged<CFError>?
        
        let ok = SecKeyVerifySignature(publicKey, Signature.algorithm, signedMessageData, signatureData, &error)
        
        guard error == nil else {
            print(error!)
            throw SecureEncryptionError.message("Could not verify message")
        }
        
        return ok
    }
}
