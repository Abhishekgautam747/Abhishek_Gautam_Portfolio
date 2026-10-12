"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DRUMS = [
  { key: "A", name: "Kick", sub: "808 Bass", color: "rgba(239,68,68,.18)", glow: "#f87171", fn: "kick" },
  { key: "S", name: "Snare", sub: "Crack", color: "rgba(249,115,22,.18)", glow: "#fb923c", fn: "snare" },
  { key: "D", name: "Hi-Hat", sub: "Closed", color: "rgba(240,192,64,.18)", glow: "#f0c040", fn: "hihatC" },
  { key: "F", name: "Hi-Hat", sub: "Open", color: "rgba(240,192,64,.12)", glow: "#fde68a", fn: "hihatO" },
  { key: "G", name: "Tom Hi", sub: "High Tom", color: "rgba(61,186,111,.18)", glow: "#3dba6f", fn: "tomHi" },
  { key: "H", name: "Tom Lo", sub: "Low Tom", color: "rgba(34,197,94,.12)", glow: "#86efac", fn: "tomLo" },
  { key: "J", name: "Crash", sub: "Cymbal", color: "rgba(139,92,246,.18)", glow: "#a78bfa", fn: "crash" },
  { key: "K", name: "Clap", sub: "808 Clap", color: "rgba(236,72,153,.18)", glow: "#f9a8d4", fn: "clap" },
  { key: "L", name: "Cowbell", sub: "🐄", color: "rgba(20,184,166,.18)", glow: "#5eead4", fn: "cowbell" },
] as const;

type DrumFn = (typeof DRUMS)[number]["fn"];

export default function DrumKit() {
  const [vol, setVol] = useState(0.8);
  const [hitKey, setHitKey] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>(() => DRUMS.map(() => 4));
  const acRef = useRef<AudioContext | null>(null);
  const volRef = useRef(0.8);

  useEffect(() => {
    volRef.current = vol;
  }, [vol]);

  function getAC() {
    if (!acRef.current) {
      acRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (acRef.current.state === "suspended") acRef.current.resume();
    return acRef.current;
  }

  function noise(dur: number) {
    const ac = getAC();
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource();
    s.buffer = buf;
    return s;
  }

  function makeGain(val: number, t1: number) {
    const ac = getAC();
    const g = ac.createGain();
    g.gain.setValueAtTime(val * volRef.current, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t1);
    return g;
  }

  const sounds: Record<DrumFn, () => void> = {
    kick() {
      const ac = getAC();
      const o = ac.createOscillator();
      const g = makeGain(1, 0.55);
      o.frequency.setValueAtTime(160, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.55);
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.55);
    },
    snare() {
      const ac = getAC();
      const n = noise(0.22);
      const g1 = makeGain(0.9, 0.22);
      const o = ac.createOscillator();
      const g2 = makeGain(0.4, 0.12);
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1800;
      n.connect(hp);
      hp.connect(g1);
      g1.connect(ac.destination);
      o.frequency.value = 200;
      o.connect(g2);
      g2.connect(ac.destination);
      n.start();
      n.stop(ac.currentTime + 0.22);
      o.start();
      o.stop(ac.currentTime + 0.12);
    },
    hihatC() {
      const ac = getAC();
      const n = noise(0.08);
      const g = makeGain(0.6, 0.08);
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 7000;
      n.connect(hp);
      hp.connect(g);
      g.connect(ac.destination);
      n.start();
      n.stop(ac.currentTime + 0.08);
    },
    hihatO() {
      const ac = getAC();
      const n = noise(0.45);
      const g = makeGain(0.5, 0.45);
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 5000;
      n.connect(hp);
      hp.connect(g);
      g.connect(ac.destination);
      n.start();
      n.stop(ac.currentTime + 0.45);
    },
    tomHi() {
      const ac = getAC();
      const o = ac.createOscillator();
      const g = makeGain(0.8, 0.3);
      o.frequency.setValueAtTime(280, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(60, ac.currentTime + 0.3);
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.3);
    },
    tomLo() {
      const ac = getAC();
      const o = ac.createOscillator();
      const g = makeGain(0.85, 0.45);
      o.frequency.setValueAtTime(160, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(40, ac.currentTime + 0.45);
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 0.45);
    },
    crash() {
      const ac = getAC();
      const n = noise(1.5);
      const g = makeGain(0.7, 1.5);
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 3000;
      n.connect(hp);
      hp.connect(g);
      g.connect(ac.destination);
      n.start();
      n.stop(ac.currentTime + 1.5);
    },
    clap() {
      const ac = getAC();
      for (let i = 0; i < 3; i++) {
        const n = noise(0.05);
        const g = makeGain(0.7, 0.05);
        const t = ac.currentTime + i * 0.012;
        g.gain.setValueAtTime(0.7 * volRef.current, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        n.connect(g);
        g.connect(ac.destination);
        n.start(t);
        n.stop(t + 0.08);
      }
    },
    cowbell() {
      const ac = getAC();
      const o1 = ac.createOscillator();
      const o2 = ac.createOscillator();
      const g = makeGain(0.6, 0.6);
      o1.frequency.value = 562;
      o2.frequency.value = 845;
      o1.connect(g);
      o2.connect(g);
      g.connect(ac.destination);
      o1.start();
      o2.start();
      o1.stop(ac.currentTime + 0.6);
      o2.stop(ac.currentTime + 0.6);
    },
  };

  function hit(fn: DrumFn, key: string) {
    sounds[fn]?.();
    setHitKey(key);
    setTimeout(() => setHitKey(null), 120);
    const bi = DRUMS.findIndex((d) => d.key === key);
    if (bi >= 0) {
      setBars((prev) => {
        const next = [...prev];
        next[bi] = 100;
        return next;
      });
      setTimeout(() => {
        setBars((prev) => {
          const next = [...prev];
          next[bi] = 4;
          return next;
        });
      }, 150);
    }
  }

  useEffect(() => {
    const keyMap: Record<string, (typeof DRUMS)[number]> = {};
    DRUMS.forEach((d) => {
      keyMap[d.key.toLowerCase()] = d;
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const d = keyMap[e.key.toLowerCase()];
      if (d) hit(d.fn, d.key);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="game-page-wrap" id="drum-kit">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>🥁 Drum Kit</h2>
        <p>Press keyboard keys A–L or tap the pads. Feel the beat!</p>
      </div>
      <div className="drum-stage">
        <div className="drum-grid">
          {DRUMS.map(({ key, name, sub, color, glow, fn }) => (
            <div
              key={key}
              className={`drum-pad${hitKey === key ? " hit" : ""}`}
              style={
                {
                  "--pad-color": color,
                  "--pad-glow": glow,
                } as React.CSSProperties
              }
              onClick={() => hit(fn, key)}
              onTouchStart={(e) => {
                e.preventDefault();
                hit(fn, key);
              }}
            >
              <span className="key-label">{key}</span>
              <span className="drum-name">{name}</span>
              <span className="drum-sub">{sub}</span>
            </div>
          ))}
        </div>
        <div className="drum-viz">
          {bars.map((h, i) => (
            <div
              key={i}
              className="drum-viz-bar"
              style={{
                height: `${h}%`,
                background: h > 10 ? DRUMS[i].glow : "var(--gold)",
              }}
            />
          ))}
        </div>
        <div className="drum-bpm-row">
          <label>VOLUME</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={vol}
            onChange={(e) => setVol(parseFloat(e.target.value))}
          />
          <label>{Math.round(vol * 100)}%</label>
        </div>
      </div>
    </div>
  );
}
