// recoil/selectors/authSelectors.js
import { selector } from 'recoil';
import { authState } from '../atoms/authAtom';

export const isLoggedInSelector = selector({
  key: 'isLoggedInSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.isAuthenticated;
  },
});

export const userSelector = selector({
  key: 'userSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user;
  },
});

export const authLoadingSelector = selector({
  key: 'authLoadingSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.isLoading;
  },
});