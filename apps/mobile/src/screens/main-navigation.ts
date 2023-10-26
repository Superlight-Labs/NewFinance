export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  Home: undefined;
  Wallet: { account: string };
  Onboarding: undefined;
  OnboardingEmail: { username: string };
  SetupWallet: undefined;
  Menu: undefined;
  Import: undefined;
  Create: undefined;
  ReviewCreate: { withPhrase: boolean; phrase?: string };
  AlphaNotice: undefined;
};
