import { Static, Type } from '@sinclair/typebox';

enum EncondingEnum {
  HEX = 'hex',
  BASE64 = 'base64',
}

export const deriveFromSchema = Type.Object({
  share: Type.String(),
  peerShareId: Type.String(),
  parentPath: Type.String().optional(),
  index: Type.String(),
  hardened: Type.Boolean(),
});
export type DeriveFrom = Static<typeof deriveFromSchema>;

export const signWithShareSchema = Type.Object({
  share: Type.String(),
  peerShareId: Type.String(),
  messageToSign: Type.String(),
  encoding: Type.Enum(EncondingEnum),
});
export type SignWithShare = Static<typeof signWithShareSchema>;

export const importHexSchema = Type.Object({
  hexSeed: Type.String({ maxLength: 128 }),
});
export type ImportHexSchema = Static<typeof importHexSchema>;
