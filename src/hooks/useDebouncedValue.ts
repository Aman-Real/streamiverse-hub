import { useEffect, useState } from "react";

/**
 * `value`, updated only once it has stopped changing for `delayMs`.
 * Lets search-as-you-type send one request per pause instead of one per keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
