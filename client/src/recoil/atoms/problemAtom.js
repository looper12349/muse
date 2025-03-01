// recoil/atoms/problemAtom.js
import { atom } from 'recoil';

export const problemState = atom({
  key: 'problemState',
  default: {
    problems: [],
    currentProblem: null,
    isLoading: false,
    error: null,
    filters: {
      difficulty: null,
      tag: null,
      search: '',
    },
    pagination: {
      page: 1,
      limit: 25,
      total: 0,
    },
  },
});