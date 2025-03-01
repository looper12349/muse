// recoil/selectors/problemSelectors.js
import { selector } from 'recoil';
import { problemState } from '../atoms/problemAtom';

export const allProblemsSelector = selector({
  key: 'allProblemsSelector',
  get: ({ get }) => {
    const problems = get(problemState);
    return problems.problems;
  },
});

export const currentProblemSelector = selector({
  key: 'currentProblemSelector',
  get: ({ get }) => {
    const problems = get(problemState);
    return problems.currentProblem;
  },
});

export const problemFiltersSelector = selector({
  key: 'problemFiltersSelector',
  get: ({ get }) => {
    const problems = get(problemState);
    return problems.filters;
  },
});

export const problemPaginationSelector = selector({
  key: 'problemPaginationSelector',
  get: ({ get }) => {
    const problems = get(problemState);
    return problems.pagination;
  },
});

export const problemLoadingSelector = selector({
  key: 'problemLoadingSelector',
  get: ({ get }) => {
    const problems = get(problemState);
    return problems.isLoading;
  },
});

export const problemErrorSelector = selector({
  key: 'problemErrorSelector',
  get: ({ get }) => {
    const problems = get(problemState);
    return problems.error;
  },
});