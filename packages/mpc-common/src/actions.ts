import { DeriveRequest } from './schema';

export const buildPath = (deriveConfig: DeriveRequest) => {
  const { parentPath, index, hardened } = deriveConfig;

  if (!parentPath && index === 'm') return 'm';

  return `${parentPath}/${index}${hardened ? "'" : ''}`;
};

export const indexToNumber = (index: string) => {
  const num = Number(index);

  if (Number.isNaN(num)) return 0;

  return num;
};
