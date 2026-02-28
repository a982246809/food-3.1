import request from './request';

export const getCanteens = () => {
  return request.get('/canteen');
};

export const getDishes = (windowId?: string) => {
  const url = windowId ? `/dish?windowId=${windowId}` : '/dish';
  return request.get(url);
};

export const getWindows = (canteenId?: string) => {
  const url = canteenId ? `/window?canteenId=${canteenId}` : '/window';
  return request.get(url);
};
