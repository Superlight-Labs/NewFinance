export const truncate = (text: string, length = 5): string => {
  return text.substring(0, length) + '...';
};
