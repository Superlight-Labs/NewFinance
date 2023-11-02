export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  Home: undefined;
  Wallet: { account: string };
  Onboarding: { withPhrase: boolean };
  OnboardingEmail: { username: string; withPhrase: boolean };
  OnboardingPhrase: undefined;
  SetupWallet: undefined;
  Menu: undefined;
  Import: undefined;
  Create: undefined;
  ReviewCreate: { withPhrase: boolean; phrase?: string };
  AlphaNotice: undefined;
  Bitcoin: undefined;
};
