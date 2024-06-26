export const truncate = (text: string, length = 5): string => {
  if (text.length <= length) return text;

  return text.substring(0, length) + '...';
};

export const shortenAddress = (address: string): string => {
  if (address.length <= 8) return address;

  return address.substring(0, 4) + '...' + address.substring(address.length - 4, address.length);
};

export const getSizeFromLength = (length: number) => {
  if (length > 5) {
    return 'text-[36px] leading-[1]';
  }

  return 'text-[40px] leading-[1]';
};
