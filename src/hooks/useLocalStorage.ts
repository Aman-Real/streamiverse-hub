import { useCallback, useState } from "react";

type Updater<T> = T | ((previous: T) => T);

/**
 * useState that mirrors its value into localStorage.
 * Reads are lazy (once, on mount) and every failure path falls back to memory,
 * so private-browsing or a full quota can never crash a render.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (updater: Updater<T>) => {
      setValue(previous => {
        const next =
          typeof updater === "function" ? (updater as (p: T) => T)(previous) : updater;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage full or disabled - keep the in-memory value.
        }
        return next;
      });
    },
    [key],
  );

  return [value, setStoredValue] as const;
}
