export const shortAddress = (address?: string) => {
  if (!address) return "";
  return `${address.toLowerCase().slice(0, 6)}...${address.toLowerCase().slice(-4)}`;
};

export const userName = (user?: any) => {
  return user?.name ? user?.name : shortAddress(user?.wallet);
};

export const userAvatar = (user?: any) => {
  return user?.avatar ? user?.avatar : "";
};
