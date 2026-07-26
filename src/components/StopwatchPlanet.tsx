import { useState } from "react";
import { useStopwatch } from "../hooks/useStopwatch";
import { formatStopwatch } from "../utils/time";
import { PlayIcon, PauseIcon, ResetIcon, FlagIcon } from "./Icons";

const MOONS_PER_ORBIT = 3;
const MAX_VISIBLE_ORBITS = 4; 
const PLANET_COUNT = 5;

interface FloatingPlanet {
  id: number;
  size: number;
  top: number;
  left: number;
  delay: number;
  floatDuration: number;
  spinDuration: number;
  opacity: number;
  hasCraters: boolean;
}

interface LapEntry {
  lapNumber: number;
  total: number; 
  split: number; 
}

function generateOrganizedPlanets(count: number): FloatingPlanet[] {
  const cols = 3;
  const rows = Math.ceil(count / cols);
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = (Math.random() - 0.5) * 4;
    const jitterY = (Math.random() - 0.5) * 4;
    const size = 26 + Math.random() * 46;
    return {
      id: i,
      size,
      top: (row + 0.5) * (100 / rows) + jitterY,
      left: (col + 0.5) * (100 / cols) + jitterX,
      delay: Math.random() * 3,
      floatDuration: 6 + Math.random() * 4,
      spinDuration: 18 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.12,
      hasCraters: size > 50,
    };
  });
}

function PlanetSurface({
  size,
  spinDuration,
  hasCraters,
  isRunning,
}: {
  size: number;
  spinDuration: number;
  hasCraters: boolean;
  isRunning: boolean;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-full"
      style={{
        animation: `spin-slow ${isRunning ? spinDuration / 3 : spinDuration}s linear infinite`,
        background:
          "radial-gradient(circle at 32% 28%, #cbb8f5 0%, #a586ec 12%, #7c4fd8 32%, #5233ab 55%, #26185c 78%, #120c33 100%)",
      }}
    >
      {hasCraters && (
        <>
          <div
            className="absolute rounded-full bg-blueberry-950/30 blur-[2px]"
            style={{ left: "18%", top: "22%", width: size * 0.26, height: size * 0.26 }}
          />
          <div
            className="absolute rounded-full bg-blueberry-950/25 blur-[1px]"
            style={{ left: "58%", top: "14%", width: size * 0.15, height: size * 0.15 }}
          />
          <div
            className="absolute rounded-full bg-blueberry-950/20 blur-[3px]"
            style={{ left: "62%", top: "55%", width: size * 0.3, height: size * 0.3 }}
          />
          <div
            className="absolute rounded-full bg-blueberry-950/25 blur-[2px]"
            style={{ left: "28%", top: "66%", width: size * 0.18, height: size * 0.18 }}
          />
          <div
            className="absolute rounded-full bg-blueberry-200/20 blur-[1px]"
            style={{ left: "10%", top: "50%", width: size * 0.12, height: size * 0.12 }}
          />
        </>
      )}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-white/10" />
    </div>
  );
}

export default function StopwatchPlanet() {
  const { elapsedMs, isRunning, start, pause, reset } = useStopwatch();
  const [laps, setLaps] = useState<number[]>([]); 
  const [planets] = useState<FloatingPlanet[]>(() => generateOrganizedPlanets(PLANET_COUNT));

  const time = formatStopwatch(elapsedMs);
  const isPaused = !isRunning && elapsedMs > 0;

  const handleToggle = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const handleReset = () => {
    reset();
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;
    setLaps((prev) => [elapsedMs, ...prev]);
  };

  const lapEntries: LapEntry[] = laps.map((total, i) => {
    const previousTotal = i + 1 < laps.length ? laps[i + 1] : 0;
    return {
      lapNumber: laps.length - i,
      total,
      split: total - previousTotal,
    };
  });

  const orderedEntries = [...lapEntries].reverse();

  const maxVisibleMoons = MAX_VISIBLE_ORBITS * MOONS_PER_ORBIT;
  const visibleEntries = orderedEntries.slice(-maxVisibleMoons);
  const orbitsCount = Math.ceil(visibleEntries.length / MOONS_PER_ORBIT);

  return (
    <div className="relative w-full overflow-hidden py-6">
      <div className="pointer-events-none absolute inset-0">
        {planets.map((p) => (
          <div
            key={p.id}
            className="float-y absolute"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              opacity: p.opacity,
              animationDuration: `${p.floatDuration}s`,
              animationDelay: `${p.delay}s`,
              animationPlayState: isRunning ? "running" : "paused",
            }}
          >
            <PlanetSurface
              size={p.size}
              spinDuration={p.spinDuration}
              hasCraters={p.hasCraters}
              isRunning={isRunning}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-14 lg:flex-row lg:items-start lg:justify-center lg:gap-36">
        <div className="flex shrink-0 flex-col items-center gap-10 lg:order-2 lg:pt-8">
          <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80 md:h-96 md:w-96">
            {Array.from({ length: orbitsCount }, (_, orbitIndex) => {
              const moons = visibleEntries.slice(
                orbitIndex * MOONS_PER_ORBIT,
                orbitIndex * MOONS_PER_ORBIT + MOONS_PER_ORBIT,
              );
              const spread = 16 + orbitIndex * 18;
              const tilt = -18 + orbitIndex * 24;
              const orbitSpeed = 10 + orbitIndex * 3;

              return (
                <div
                  key={orbitIndex}
                  className="pointer-events-none absolute"
                  style={{
                    inset: `-${spread}px`,
                    transform: `rotate(${tilt}deg) scaleX(1.12)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full border border-blueberry-300/25" />

                  <div
                    className="absolute inset-0"
                    style={{
                      animation: `spin-slow ${orbitSpeed}s linear infinite`,
                      animationPlayState: isRunning ? "running" : "paused",
                    }}
                  >
                    {moons.map((entry, moonIndex) => {
                      const angle = moonIndex * (360 / MOONS_PER_ORBIT) + orbitIndex * 12;
                      const totalFmt = formatStopwatch(entry.total);
                      const splitFmt = formatStopwatch(entry.split);
                      return (
                        <div
                          key={entry.lapNumber}
                          className="absolute inset-0"
                          style={{ transform: `rotate(${angle}deg)` }}
                        >
                          <span
                            title={`Lap ${entry.lapNumber} — total ${totalFmt.minutes}:${totalFmt.seconds}.${totalFmt.millis} · split +${splitFmt.minutes}:${splitFmt.seconds}.${splitFmt.millis}`}
                            className="pointer-events-auto absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-help rounded-full bg-blueberry-200 shadow-[0_0_12px_3px_rgba(203,184,245,0.85)] transition hover:scale-150 sm:h-3.5 sm:w-3.5"
                            style={{ transform: "translate(-50%, -50%) scaleX(0.89)" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div
              className={`absolute inset-0 overflow-hidden rounded-full shadow-[0_0_55px_-6px_rgba(124,79,216,0.8)] ${
                isRunning ? "glow-pulse" : ""
              }`}
            >
              <PlanetSurface size={384} spinDuration={isRunning ? 18 : 45} hasCraters isRunning={isRunning} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
              <span className="text-[11px] font-semibold tracking-widest text-blueberry-100/90 drop-shadow-[0_0_6px_rgba(6,4,15,0.9)] sm:text-xs">
                STOPWATCH
              </span>

              <div className="tabular font-display flex items-baseline gap-0.5 text-white drop-shadow-[0_2px_10px_rgba(6,4,15,0.95)]">
                <span className="text-4xl font-bold sm:text-5xl md:text-6xl">{time.minutes}</span>
                <span className="text-3xl font-bold text-blueberry-100 sm:text-4xl">:</span>
                <span className="text-4xl font-bold sm:text-5xl md:text-6xl">{time.seconds}</span>
                <span className="ms-1 text-lg font-semibold text-blueberry-100/90 sm:text-xl">
                  .{time.millis}
                </span>
              </div>

              <span className="text-xs text-blueberry-100/80 drop-shadow-[0_0_6px_rgba(6,4,15,0.9)] sm:text-sm">
                {isRunning ? "Counting up..." : isPaused ? "Paused" : "Ready when you are"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-blueberry-400/40 bg-blueberry-800/60 text-blueberry-200 backdrop-blur transition hover:bg-blueberry-700/70 active:scale-95"
              aria-label="Reset"
            >
              <ResetIcon className="h-5 w-5" />
            </button>

            <button
              onClick={handleToggle}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blueberry-400 to-blueberry-600 text-white shadow-[0_0_25px_-4px_rgba(124,79,216,0.9)] transition hover:brightness-110 active:scale-95"
              aria-label={isRunning ? "Pause" : "Start"}
            >
              {isRunning ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7 translate-x-0.5" />}
            </button>

            <button
              onClick={handleLap}
              disabled={!isRunning}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-blueberry-400/40 bg-blueberry-800/60 text-blueberry-200 backdrop-blur transition hover:bg-blueberry-700/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Lap"
            >
              <FlagIcon className="h-5 w-5" />
            </button>
          </div>

         
        </div>

        <div className="flex w-full max-w-sm flex-col items-center gap-4 lg:order-1 lg:pt-4">
          <h2 className="text-base font-bold tracking-wide text-blueberry-200/90 sm:text-lg">
            🏁 LAPS
          </h2>

          <div className="flex max-h-[28rem] w-full flex-col gap-3 overflow-y-auto pr-1">
            {lapEntries.length === 0 && (
              <p className="rounded-2xl border border-blueberry-500/20 bg-blueberry-900/40 px-5 py-8 text-center text-sm text-blueberry-300/60">
               . No laps yet
              </p>
            )}

            {lapEntries.map((entry) => {
              const totalFmt = formatStopwatch(entry.total);
              const splitFmt = formatStopwatch(entry.split);

              return (
                <div
                  key={entry.lapNumber}
                  className="flex items-center justify-between rounded-2xl border border-blueberry-500/30 bg-blueberry-900/60 px-6 py-4 backdrop-blur"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-blueberry-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-blueberry-200 shadow-[0_0_8px_2px_rgba(203,184,245,0.7)]" />
                    Lap {entry.lapNumber}
                  </span>

                  <div className="flex flex-col items-end leading-tight">
                    <span className="tabular text-lg font-bold text-white">
                      {totalFmt.minutes}:{totalFmt.seconds}
                    </span>
                    <span className="tabular text-xs font-semibold text-sky-400">
                      +{splitFmt.minutes}:{splitFmt.seconds}.{splitFmt.millis}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}