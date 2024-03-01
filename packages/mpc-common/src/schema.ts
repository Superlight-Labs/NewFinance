import { Static, Type } from '@sinclair/typebox';

enum EncondingEnum {
  HEX = 'hex',
  BASE64 = 'base64',
}

export const deriveFromSchema = Type.Object({
  peerShareId: Type.String(),
  parentPath: Type.Optional(Type.String()),
  index: Type.String(),
  hardened: Type.Boolean(),
});

export type DeriveRequest = Static<typeof deriveFromSchema>;

export type DeriveFrom = DeriveRequest & { share: string };

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

export enum OnSuccess {
  SaveKeyShare = 'saveKeyShare',
  ExtractAndSaveNewShare = 'extractAndSaveNewShare',
}

export const stepSchema = Type.Object({
  message: Type.Array(Type.Number()),
  onSuccess: Type.Enum(OnSuccess),
});

export type StepRequest = Static<typeof stepSchema>;
