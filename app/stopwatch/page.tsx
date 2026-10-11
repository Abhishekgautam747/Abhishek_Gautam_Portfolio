"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function StopwatchPage() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<{ lap: number; lt: number; total: number }[]>(
    []
  );
  const startRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fmt = (ms: number) => {
    const t = Math.floor(ms / 1000);
    return `${Math.floor(t / 60)
      .toString()
      .padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}.${Math.floor(
      (ms % 1000) / 10
    )
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startRef.current);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const addLap = () => {
    if (!running) return;
    const prev = laps.length ? laps[laps.length - 1].total : 0;
    setLaps([...laps, { lap: laps.length + 1, lt: elapsed - prev, total: elapsed }]);
  };

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  return (
    <div id="stopwatch">
      <video id="bg-video" autoPlay muted loop playsInline>
        <source
          src="https://cdn.pixabay.com/video/2022/08/13/127713-739309133_large.mp4"
          type="video/mp4"
        />
      </video>
      <div className="overlay" />
      <div id="water-layer" />
      <div className="app-container">
        <Link href="/" className="game-back-btn" style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          ← Home
        </Link>
        <h1 className="visually-hidden">Stopwatch</h1>
        <div className="time-display">{fmt(elapsed)}</div>
        <div className="controls">
          <button className="btn" onClick={() => setRunning(!running)}>
            {running ? "Pause" : "Start"}
          </button>
          <button className="btn" onClick={addLap} disabled={!running}>
            Lap
          </button>
          <button className="btn" onClick={reset}>
            Reset
          </button>
        </div>
        <div className="laps-container">
          <div className="laps-header">
            <span>Lap</span>
            <span>Lap Time</span>
            <span>Total Time</span>
          </div>
          <ul className="laps-list">
            {laps.map((l) => (
              <li key={l.lap}>
                <span>{l.lap}</span>
                <span>{fmt(l.lt)}</span>
                <span>{fmt(l.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
