import { Context } from "@crypto-mpc";

export const step = (message: string, context: Context): string | boolean => {
  const inBuff = Buffer.from(message, "base64");

  const outBuff = context.step(inBuff);

  if (context.isFinished()) {
    return true;
  }

  if (!outBuff) {
    return false;
  }

  return outBuff.toString("base64");
};
