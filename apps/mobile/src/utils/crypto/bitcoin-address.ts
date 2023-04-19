import { Network } from '@superlight-labs/blockchain-api-client';
import { AppError, bitcoinJsError } from '@superlight-labs/mpc-common';
import BIP32Factory from 'bip32';
import * as bitcoin from 'der-bitcoinjs-lib';
import { Result, err, ok } from 'neverthrow';
import * as ecc from 'tiny-secp256k1';
import { getBitcoinJsNetwork } from './bitcoin-network';
const bip32 = BIP32Factory(ecc);

/**
 * Transforms bitcoin public key to bitcoin p2wpkh address (segwit)
 * @param publicKey public key from mpc creation
 * @returns string bitcoin p2wpkh address
 */

export const publicKeyToBitcoinAddressP2WPKH = (
  xPub: string,
  network: Network
): Result<AddressResult, AppError> => {
  const pubkeyECPair = bip32.fromBase58(xPub);

  const { address } = bitcoin.payments.p2wpkh({
    pubkey: pubkeyECPair.publicKey,
    network: getBitcoinJsNetwork(network),
  });

  if (!address) {
    return err(bitcoinJsError("Can't transform xPub key to bitcoin address"));
  }

  return ok({ address, xPub });
};

type AddressResult = {
  address: string;
  xPub: string;
};
