export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  Home: undefined;
  Wallets: undefined;
  Onboarding: undefined;
  Menu: undefined;
  Import: undefined;
  Create: undefined;
  Derive: { path: string; fromShare: string; peerShareId: string };
  ReviewCreate: { walletName: string; withPhrase: boolean; phrase?: string };
};
