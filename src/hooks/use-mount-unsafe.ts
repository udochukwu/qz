import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

export function useOnMountUnsafe(effect: EffectCallback, deps: DependencyList) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      effect();
    }
  }, deps);
}
