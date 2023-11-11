export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  HomeTab: undefined;
  Onboarding: { withPhrase: boolean };
  OnboardingEmail: { username: string; withPhrase: boolean };
  OnboardingPhrase: undefined;
  SetupWallet: undefined;
  Import: undefined;
  Create: undefined;
  ReviewCreate: { withPhrase: boolean; phrase?: string };
  AlphaNotice: undefined;

  MenuList: undefined;
  BitcoinSettings: undefined;
  CurrencySettings: undefined;
  BackupSettings: undefined;
  EmailSettings: undefined;
  ENSSettings: undefined;
  SeedphraseSettings: undefined;
  TagSettings: undefined;
};
