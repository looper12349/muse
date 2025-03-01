// recoil/atoms/threadAtom.js
import { atom } from 'recoil';

export const threadState = atom({
  key: 'threadState',
  default: {
    threads: [],
    currentThread: null,
    messages: [],
    isLoading: false,
    error: null,
    llmProviders: [],
    currentLlmProvider: 'openai',
  },
});
