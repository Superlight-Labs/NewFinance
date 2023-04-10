export type DeriveConfig = {
  serverShareId: string;
  index: string;
  hardened: boolean;
  parentPath: string;
};

export const buildPath = (deriveConfig: DeriveConfig) => {
  const { parentPath, index, hardened } = deriveConfig;

  if (!parentPath && index === 'm') return 'm';

  return `${parentPath}/${index}${hardened ? "'" : ''}`;
};
