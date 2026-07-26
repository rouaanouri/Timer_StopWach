import { useState } from "react";
import { useCountdownTimer } from "../hooks/useCountdownTimer";
import { formatTime, secondsToHMS, hmsToSeconds } from "../utils/time";
import { PlayIcon, PauseIcon, ResetIcon } from "./Icons";

const PRESETS = [
  { label: "10 min", seconds: 600 },
  { label: "5 min", seconds: 300 },
  { label: "3 min", seconds: 180 },
  { label: "1 min", seconds: 60 },
];

function playBeep() {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);

    [0, 0.28, 0.56].forEach((delay) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 740;
      osc.connect(gain);
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.start(t);
      osc.stop(t + 0.26);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
  }
}

export default function CircularWaterTimer() {
  const [hoursInput, setHoursInput] = useState(0);
  const [minutesInput, setMinutesInput] = useState(0);
  const [secondsInput, setSecondsInput] = useState(0);

  const {
    remainingMs,
    durationMs,
    isRunning,
    isFinished,
    progress,
    start,
    pause,
    reset,
    setDuration,
  } = useCountdownTimer(hmsToSeconds(hoursInput, minutesInput, secondsInput), {
    onFinish: () => playBeep(),
  });

  const fillPercent = progress * 100;

  const isReadyForFreshStart = isFinished || remainingMs === durationMs;

  const handleStart = () => {
    if (isReadyForFreshStart) {
      const total = Math.max(1, hmsToSeconds(hoursInput, minutesInput, secondsInput));
      start(total);
    } else {
      start();
    }
  };

  const applyPreset = (seconds: number) => {
    const { hours, minutes, seconds: secs } = secondsToHMS(seconds);
    setHoursInput(hours);
    setMinutesInput(minutes);
    setSecondsInput(secs);
    setDuration(seconds);
  };

  const disabled = isRunning || (!isFinished && remainingMs !== durationMs);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-20">
      <div className="flex w-full max-w-md flex-col items-center gap-6 lg:order-1">
        <div className="flex w-full flex-col items-center gap-3">
          <h2 className="text-sm font-bold tracking-wide text-blueberry-200/90 sm:text-base">
            ⏱️ SET DURATION
          </h2>
          <div className="flex items-center gap-3 rounded-3xl border border-blueberry-500/30 bg-blueberry-900/60 px-6 py-5 backdrop-blur">
             <label className="flex flex-col items-center gap-1.5">
              <span className="text-sm text-blueberry-300/70">Seconds</span>
              <input
                type="number"
                min={0}
                max={59}
                disabled={disabled}
                value={secondsInput}
                onChange={(e) => setSecondsInput(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                className="tabular w-20 rounded-xl border border-blueberry-500/40 bg-blueberry-950/70 px-2 py-2.5 text-center text-2xl font-bold text-white outline-none focus:border-blueberry-300 disabled:opacity-50"
              />
            </label>
            <span className="mt-6 text-2xl font-bold text-blueberry-300">:</span>
            <label className="flex flex-col items-center gap-1.5">
              <span className="text-sm text-blueberry-300/70">Minutes</span>
              <input
                type="number"
                min={0}
                max={59}
                disabled={disabled}
                value={minutesInput}
                onChange={(e) => setMinutesInput(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                className="tabular w-20 rounded-xl border border-blueberry-500/40 bg-blueberry-950/70 px-2 py-2.5 text-center text-2xl font-bold text-white outline-none focus:border-blueberry-300 disabled:opacity-50"
              />
            </label>
            <span className="mt-6 text-2xl font-bold text-blueberry-300">:</span>
            <label className="flex flex-col items-center gap-1.5">
              <span className="text-sm text-blueberry-300/70">Hours</span>
              <input
                type="number"
                min={0}
                max={23}
                disabled={disabled}
                value={hoursInput}
                onChange={(e) => setHoursInput(Math.max(0, Math.min(23, Number(e.target.value) || 0)))}
                className="tabular w-20 rounded-xl border border-blueberry-500/40 bg-blueberry-950/70 px-2 py-2.5 text-center text-2xl font-bold text-white outline-none focus:border-blueberry-300 disabled:opacity-50"
              />
            </label>
         
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <h2 className="text-sm font-bold tracking-wide text-blueberry-200/90 sm:text-base">
            ⚡ QUICK PRESETS
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.seconds}
                onClick={() => applyPreset(preset.seconds)}
                disabled={disabled}
                className="rounded-full border border-blueberry-400/30 bg-blueberry-800/50 px-5 py-2.5 text-sm font-medium text-blueberry-200 transition hover:border-blueberry-300 hover:bg-blueberry-700/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-8 lg:order-2">
        <div className="relative">
          <div
            className={`relative flex h-64 w-64 items-center justify-center rounded-full border-4 border-blueberry-400/40 bg-blueberry-900 shadow-[0_0_40px_-8px_rgba(124,79,216,0.6)] sm:h-80 sm:w-80 md:h-96 md:w-96 ${
              isFinished ? "glow-pulse" : ""
            }`}
          >
            <div className="absolute inset-3 rounded-full border border-blueberry-300/10" />
            <div className="absolute inset-6 rounded-full border border-blueberry-300/10" />

            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div
                className="water-rise absolute inset-x-0 bottom-0"
                style={{ height: `${fillPercent}%` }}
              >
                <div className="absolute inset-x-0 -top-3 h-6 overflow-hidden">
                  <svg
                    className="wave-svg h-full w-[200%]"
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10 T 125 10 T 150 10 T 175 10 T 200 10 V20 H0 Z"
                      fill="var(--color-water-light)"
                      opacity="0.55"
                    />
                  </svg>
                </div>
                <div className="absolute inset-x-0 -top-1.5 h-5 overflow-hidden">
                  <svg
                    className="wave-svg-slow h-full w-[200%]"
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 10 Q 12.5 18, 25 10 T 50 10 T 75 10 T 100 10 T 125 10 T 150 10 T 175 10 T 200 10 V20 H0 Z"
                      fill="var(--color-water-foam)"
                      opacity="0.4"
                    />
                  </svg>
                </div>
                <div className="h-full w-full bg-linear-to-t from-water-deep via-water-mid to-water-light/80" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
              <span className="tabular font-display text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(124,79,216,0.8)] sm:text-5xl md:text-6xl">
                {formatTime(remainingMs)}
              </span>
              <span className="text-xs text-blueberry-200/80 sm:text-sm">
                {isFinished ? "🌟 Goal reached! Well done" : isRunning ? "Deep Focus. Seamless Flow" : "Start & dive right in!"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => reset()}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-blueberry-400/40 bg-blueberry-800/60 text-blueberry-200 transition hover:bg-blueberry-700/70 active:scale-95"
            aria-label="Reset"
          >
            <ResetIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => (isRunning ? pause() : handleStart())}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blueberry-400 to-blueberry-600 text-white shadow-[0_0_25px_-4px_rgba(124,79,216,0.9)] transition hover:brightness-110 active:scale-95"
            aria-label={isRunning ? "Pause" : "Start"}
          >
            {isRunning ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7 translate-x-0.5" />}
          </button>

          <div className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}