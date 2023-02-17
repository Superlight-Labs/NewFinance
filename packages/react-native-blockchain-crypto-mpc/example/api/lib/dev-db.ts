interface DevDB {
  secretBuf: Buffer | undefined;
  shareBuf: Buffer | undefined;
  signature: Buffer | undefined;
}

export const db: DevDB = {
  secretBuf: undefined,
  shareBuf: undefined,
  signature: undefined,
};
