import { differenceInMinutes } from "date-fns";

export const shortAddress = (address?: string) => {
  if (!address) return "";
  return `${address.toLowerCase().slice(0, 6)}...${address
    .toLowerCase()
    .slice(-4)}`;
};

export const getTime = (date?: Date | string) => {
  if (!date) return "";
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const minutes = differenceInMinutes(new Date(), targetDate);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  return `${years}y`;
};
