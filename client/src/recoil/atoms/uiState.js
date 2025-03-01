// recoil/atoms/uiState.js
import { atom } from 'recoil';

export const uiState = atom({
  key: 'uiState',
  default: {
    sidebarOpen: true,
    theme: 'dark',
    isMobileView: false,
  },
});