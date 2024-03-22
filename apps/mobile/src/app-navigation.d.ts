export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  HomeTab: undefined;
  Onboarding: { withPhrase: boolean };
  OnboardingEmail: { username: string; withPhrase: boolean };
  OnboardingPhrase: undefined;
  SetupWallet: { username: string; email: string; withPhrase: boolean };
  PhraseLimitations: undefined;
  Import: undefined;
  Create: undefined;
  ReviewCreate: { withPhrase: boolean; phrase?: string };
  AlphaNotice: undefined;
  ComingSoon: { text: string };
};
