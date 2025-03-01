// recoil/atoms/authAtom.js
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'dsa-assistant-auth',
  storage: localStorage,
});

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null
  },
  effects_UNSTABLE: [persistAtom],
});