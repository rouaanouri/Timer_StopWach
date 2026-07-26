import { useCallback, useEffect, useRef, useState } from "react";

export function useStopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);

  const tick = useCallback(() => {
    setElapsedMs(accumulatedRef.current + (Date.now() - startTimeRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    accumulatedRef.current = accumulatedRef.current + (Date.now() - startTimeRef.current);
    setElapsedMs(accumulatedRef.current);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    accumulatedRef.current = 0;
    setElapsedMs(0);
  }, []);

  return { elapsedMs, isRunning, start, pause, reset };
}
