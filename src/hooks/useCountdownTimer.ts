import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownTimerOptions {
  onFinish?: () => void;
}

export function useCountdownTimer(initialSeconds: number, options?: UseCountdownTimerOptions) {
  const [durationMs, setDurationMs] = useState(initialSeconds * 1000);
  const [remainingMs, setRemainingMs] = useState(initialSeconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const endTimeRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);
  const onFinishRef = useRef(options?.onFinish);
  onFinishRef.current = options?.onFinish;

  const tick = useCallback(() => {
    const remaining = Math.max(0, endTimeRef.current - Date.now());
    setRemainingMs(remaining);
    if (remaining <= 0) {
      setIsRunning(false);
      setIsFinished(true);
      onFinishRef.current?.();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (isRunning) {
      endTimeRef.current = Date.now() + remainingMs;
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const start = useCallback((newDurationSeconds?: number) => {
    if (typeof newDurationSeconds === "number") {
      const ms = Math.max(0, newDurationSeconds) * 1000;
      if (ms <= 0) return;
      setDurationMs(ms);
      setRemainingMs(ms);
      setIsFinished(false);
      setIsRunning(true);
      return;
    }
    setIsRunning(true);
    setIsFinished(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    setRemainingMs((prev) => Math.max(0, endTimeRef.current - Date.now()) || prev);
  }, []);

  const reset = useCallback(
    (newDurationSeconds?: number) => {
      setIsRunning(false);
      setIsFinished(false);
      const newDuration = Math.max(0, newDurationSeconds ?? durationMs / 1000) * 1000;
      setDurationMs(newDuration);
      setRemainingMs(newDuration);
    },
    [durationMs],
  );

  const setDuration = reset;

  const progress = durationMs > 0 ? Math.min(1, Math.max(0, (durationMs - remainingMs) / durationMs)) : 0;

  return {
    durationMs,
    remainingMs,
    isRunning,
    isFinished,
    progress,
    start,
    pause,
    reset,
    setDuration,
  };
}