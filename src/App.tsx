import { useState } from "react";
import CircularWaterTimer from "./components/CircularWaterTimer";
import StopwatchPlanet from "./components/StopwatchPlanet";
import { TimerIcon, StopwatchIcon } from "./components/Icons";
export default function App() {
  const [activeTab, setActiveTab] = useState<"timer" | "stopwatch">("timer");

  const isTimer = activeTab === "timer";
  const isStopwatch = activeTab === "stopwatch";
// no big issues your code is good so far it's good for real life project but next time even if it's not 100% good try to write it without any help of the ai
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-blueberry-950">
      <div className="starfield" />
      <div className="nebula" />

      <div className="pointer-events-none fixed inset-0 z-0">
        <span className="twinkle absolute left-[12%] top-[15%] h-1 w-1 rounded-full bg-white" />
        <span className="twinkle absolute left-[30%] top-[85%] h-1.5 w-1.5 rounded-full bg-blueberry-200" style={{ animationDelay: "0.3s" }} />
        <span className="twinkle absolute left-[92%] top-[60%] h-1 w-1 rounded-full bg-white" style={{ animationDelay: "0.9s" }} />
        <span className="twinkle absolute left-[80%] top-[22%] h-1.5 w-1.5 rounded-full bg-blueberry-200" style={{ animationDelay: "0.6s" }} />
        <span className="twinkle absolute left-[65%] top-[70%] h-1 w-1 rounded-full bg-white" style={{ animationDelay: "1.2s" }} />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 py-10">

       <div className="flex p-1.5 rounded-2xl border border-blueberry-500/30 bg-blueberry-900/60 backdrop-blur">
  <button
    onClick={() => setActiveTab("timer")}
    className={
      "flex items-center gap-2 px-6 py-3 rounded-xl text-base sm:text-lg font-bold transition-all duration-300 " +
      (isTimer
        ? "bg-blueberry-600 text-white shadow-[0_0_12px_rgba(124,79,216,0.6)]"
        : "text-blueberry-300/70 hover:text-blueberry-200")
    }
  >
    <TimerIcon className="h-5 w-5" />
    Timer
  </button>
  <button
    onClick={() => setActiveTab("stopwatch")}
    className={
      "flex items-center gap-2 px-6 py-3 rounded-xl text-base sm:text-lg font-bold transition-all duration-300 " +
      (isStopwatch
        ? "bg-blueberry-600 text-white shadow-[0_0_12px_rgba(124,79,216,0.6)]"
        : "text-blueberry-300/70 hover:text-blueberry-200")
    }
  >
    <StopwatchIcon className="h-5 w-5" />
    Stopwatch
      </button>
    </div>

       

        <section className="relative w-full">
          <div
            className={
              isTimer
                ? "opacity-100 relative pointer-events-auto"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }
          >
            <CircularWaterTimer />
          </div>

          <div
            className={
              isStopwatch
                ? "opacity-100 relative pointer-events-auto"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }
          >
            <StopwatchPlanet />
          </div>
        </section>

        <footer className="text-center text-xs text-blueberry-300/50">
         Developed  By Rouaa Nouri -2026
        </footer>
      </main>
    </div>
  );
}