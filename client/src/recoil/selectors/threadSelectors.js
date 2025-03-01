// recoil/selectors/threadSelectors.js
import { selector } from 'recoil';
import { threadState } from '../atoms/threadAtom';

export const allThreadsSelector = selector({
  key: 'allThreadsSelector',
  get: ({ get }) => {
    const threads = get(threadState);
    return threads.threads;
  },
});

export const currentThreadSelector = selector({
  key: 'currentThreadSelector',
  get: ({ get }) => {
    const threads = get(threadState);
    return threads.currentThread;
  },
});

export const threadMessagesSelector = selector({
  key: 'threadMessagesSelector',
  get: ({ get }) => {
    const threads = get(threadState);
    return threads.messages;
  },
});

export const llmProvidersSelector = selector({
  key: 'llmProvidersSelector',
  get: ({ get }) => {
    const threads = get(threadState);
    return threads.llmProviders;
  },
});

export const currentLlmProviderSelector = selector({
  key: 'currentLlmProviderSelector',
  get: ({ get }) => {
    const threads = get(threadState);
    return threads.currentLlmProvider;
  },
});

export const threadLoadingSelector = selector({
  key: 'threadLoadingSelector',
  get: ({ get }) => {
    const threads = get(threadState);
    return threads.isLoading;
  },
});

export const threadErrorSelector = selector({
  key: 'threadErrorSelector',
  get: ({ get }) => {
    const threads = get(threadState);
    return threads.error;
  },
});