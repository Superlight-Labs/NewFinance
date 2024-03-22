import { Static, Type } from '@sinclair/typebox';

export enum EncondingEnum {
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

export type DeriveFrom = DeriveRequest;

export const signWithShareSchema = Type.Object({
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
  Sign = 'sign',
}

export const stepSchema = Type.Object({
  message: Type.Array(Type.Number()),
  onSuccess: Type.Enum(OnSuccess),
  path: Type.Optional(Type.String()),
});

export type StepRequest = Static<typeof stepSchema>;

export type ShareResult = {
  share: string;
  peerShareId: string;
};
