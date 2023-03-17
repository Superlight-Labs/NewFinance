interface IConstants {
    deviceKeyName: string;
    bip44MasterIndex: string;
    bip44PurposeIndex: string;
  }
  
  export const constants: IConstants = {
    deviceKeyName: "WalletPOCDeviceKey",
    bip44MasterIndex: "m",
    bip44PurposeIndex: "44",
  };