import { Constants } from '@repo/shared';

export const storeToken = (token: string) => {
  localStorage.setItem(Constants.ACCESS_TOKEN, token);
};

export const clearToken = () => {
  localStorage.removeItem(Constants.ACCESS_TOKEN);
};

export const getToken = () => localStorage.getItem(Constants.ACCESS_TOKEN);
