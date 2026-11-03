import { useSyncExternalStore } from 'react';

const subscribeNoop = () => () => {};

// true on the client after hydration, false during SSR.
export function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}
