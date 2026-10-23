import { useEffect } from "react";

export function usePolling(
  fn,
  { intervalMs = 3000, maxAttempts = 40, shouldStop },
) {
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const result = await fn();
      if (shouldStop(result) || attempts >= maxAttempts)
        clearInterval(interval);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [fn, intervalMs, maxAttempts, shouldStop]);
}
