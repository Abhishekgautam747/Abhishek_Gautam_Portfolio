"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/** Polyfill roundRect for older browsers */
function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export default function HillClimb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const runningRef = useRef(false);
  const rafRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const parent = canvas.parentElement;
    const maxW = Math.min(780, (parent?.clientWidth || 780) - 16);
    const scale = maxW / 780;
    canvas.width = 780;
    canvas.height = 380;
    canvas.style.width = maxW + "px";
    canvas.style.height = 380 * scale + "px";

    const W = 780;
    const H = 380;
    const STEP = 20;
    const WB = 42;
    const WR = 18;

    const terrain: number[] = [];
    let ty = H * 0.62;
    for (let i = 0; i < 5000; i++) {
      terrain.push(ty);
      const x = i * STEP;
      ty =
        H * 0.62 +
        Math.sin(x * 0.005) * 50 +
        Math.sin(x * 0.015) * 30 +
        Math.sin(x * 0.04) * 16 +
        Math.sin(x * 0.0015) * 70;
      ty = Math.max(H * 0.35, Math.min(H * 0.85, ty));
    }
    for (let i = 0; i < 20; i++) terrain[i] = H * 0.62;

    function groundY(x: number) {
      if (x < 0) return H * 0.62;
      const i = Math.floor(x / STEP);
      if (i >= terrain.length - 1) return terrain[terrain.length - 1];
      const t = (x - i * STEP) / STEP;
      return terrain[i] * (1 - t) + terrain[i + 1] * t;
    }

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 10000,
      y: Math.random() * 160,
      a: Math.random() * 0.6 + 0.15,
      r: Math.random() * 1.4 + 0.4,
    }));

    const coins: { x: number; y: number; got: boolean }[] = [];
    for (let i = 0; i < 250; i++) {
      const cx = 500 + i * 220 + Math.random() * 100;
      coins.push({ x: cx, y: groundY(cx) - 40 - Math.random() * 40, got: false });
    }

    let car = {
      x: 160,
      y: groundY(160) - WR - 20,
      vx: 0,
      vy: 0,
      angle: 0,
      angVel: 0,
    };
    let fuel = 100;
    let dist = 0;
    let coinCount = 0;
    let dead = false;

    function reset() {
      car = {
        x: 160,
        y: groundY(160) - WR - 20,
        vx: 0,
        vy: 0,
        angle: 0,
        angVel: 0,
      };
      fuel = 100;
      dist = 0;
      coinCount = 0;
      dead = false;
      coins.forEach((c) => (c.got = false));
    }

    function update(dt: number) {
      if (dead) return;
      const GRAV = 980;
      const ENG = 620;
      const BRK = 400;
      const FRIC = 0.955;
      const STIFF = 1400;
      const DAMP = 18;
      const FRATE = 8;

      const cos = Math.cos(car.angle);
      const sin = Math.sin(car.angle);

      const fwx = car.x + cos * WB;
      const fwy = car.y + sin * WB;
      const rwx = car.x - cos * WB;
      const rwy = car.y - sin * WB;

      const fTarget = groundY(fwx) - WR;
      const rTarget = groundY(rwx) - WR;

      const fPen = fwy - fTarget;
      const rPen = rwy - rTarget;

      if (fPen > -8) {
        const f = Math.max(0, fPen) * STIFF;
        car.vy -= f * dt;
        car.angVel += f * WB * 0.00035 * dt;
        car.vy -= Math.sign(car.vy) * Math.min(Math.abs(car.vy), DAMP * dt * 20);
      }
      if (rPen > -8) {
        const f = Math.max(0, rPen) * STIFF;
        car.vy -= f * dt;
        car.angVel -= f * WB * 0.00035 * dt;
        car.vy -= Math.sign(car.vy) * Math.min(Math.abs(car.vy), DAMP * dt * 20);
      }

      car.vy += GRAV * dt;

      const keys = keysRef.current;
      const gas = keys["ArrowRight"] || keys["d"] || keys["D"];
      const brk = keys["ArrowLeft"] || keys["a"] || keys["A"];

      if (gas && fuel > 0) {
        car.vx += ENG * cos * dt;
        car.vy += ENG * sin * dt * 0.15;
        car.angVel -= 1.2 * dt;
        fuel = Math.max(0, fuel - FRATE * dt);
      }
      if (brk) {
        car.vx -= BRK * cos * dt;
        car.angVel += 1.0 * dt;
      }

      if (Math.abs(fPen) > 20 && Math.abs(rPen) > 20) {
        if (gas) car.angVel -= 2.5 * dt;
        if (brk) car.angVel += 2.5 * dt;
      }

      car.vx *= Math.pow(FRIC, dt * 60);
      car.angVel *= Math.pow(0.9, dt * 60);
      car.vx = Math.max(-180, Math.min(650, car.vx));
      car.angVel = Math.max(-8, Math.min(8, car.angVel));

      car.x += car.vx * dt;
      car.y += car.vy * dt;
      car.angle += car.angVel * dt;

      const bodyFloor = groundY(car.x) - WR - 18;
      if (car.y > bodyFloor) {
        car.y = bodyFloor;
        if (car.vy > 0) car.vy *= -0.2;
      }

      dist = Math.max(dist, car.x);
      coins.forEach((c) => {
        if (!c.got) {
          const dx = c.x - car.x;
          const dy = c.y - car.y;
          if (dx * dx + dy * dy < 900) {
            c.got = true;
            coinCount++;
          }
        }
      });

      if (Math.abs(car.angle) > Math.PI * 0.85) dead = true;
      if (car.y > H + 60) dead = true;
      if (fuel <= 0 && Math.abs(car.vx) < 3 && Math.abs(car.vy) < 5) dead = true;
    }

    function drawWheel(wx: number, wy: number, spin: number) {
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(spin);
      ctx.fillStyle = "#1a1a1a";
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, WR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (let s = 0; s < 5; s++) {
        const a = (s * Math.PI * 2) / 5;
        ctx.strokeStyle = "#c9990a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 5, Math.sin(a) * 5);
        ctx.lineTo(Math.cos(a) * 14, Math.sin(a) * 14);
        ctx.stroke();
      }
      ctx.fillStyle = "#f0c040";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const camX = car.x - W * 0.28;

      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#06060f");
      sky.addColorStop(0.6, "#0c0a12");
      sky.addColorStop(1, "#12100a");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      stars.forEach((s) => {
        ctx.fillStyle = "rgba(240,192,64," + s.a + ")";
        ctx.beginPath();
        ctx.arc((((s.x - camX * 0.1) % W) + W) % W, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.translate(-camX, 0);

      const startI = Math.max(0, Math.floor(camX / STEP) - 2);
      const endI = Math.min(terrain.length - 1, Math.floor((camX + W) / STEP) + 3);
      ctx.beginPath();
      ctx.moveTo(startI * STEP, H + 20);
      for (let i = startI; i <= endI; i++) {
        ctx.lineTo(i * STEP, terrain[i]);
      }
      ctx.lineTo(endI * STEP, H + 20);
      ctx.closePath();
      const tg = ctx.createLinearGradient(0, H * 0.3, 0, H);
      tg.addColorStop(0, "#2a4a1c");
      tg.addColorStop(0.5, "#1a3010");
      tg.addColorStop(1, "#0a1408");
      ctx.fillStyle = tg;
      ctx.fill();
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = startI; i <= endI; i++) {
        if (i === startI) ctx.moveTo(i * STEP, terrain[i]);
        else ctx.lineTo(i * STEP, terrain[i]);
      }
      ctx.stroke();

      coins.forEach((c) => {
        if (c.got || c.x < camX - 40 || c.x > camX + W + 40) return;
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f0c040";
        ctx.fillStyle = "#f0c040";
        ctx.beginPath();
        ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#1a1500";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("$", c.x, c.y + 1);
        ctx.restore();
      });

      const cos = Math.cos(car.angle);
      const sin = Math.sin(car.angle);
      const fwx = car.x + cos * WB;
      const fwy = Math.min(car.y + sin * WB, groundY(fwx) - WR + 2);
      const rwx = car.x - cos * WB;
      const rwy = Math.min(car.y - sin * WB, groundY(rwx) - WR + 2);
      const spin = -car.x * 0.04;
      drawWheel(fwx, fwy, spin);
      drawWheel(rwx, rwy, spin);

      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(201,153,10,.45)";
      ctx.fillStyle = "#c9990a";
      ctx.strokeStyle = "#f0c040";
      ctx.lineWidth = 2;
      rr(ctx, -52, -18, 104, 28, 7);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#0d0b06";
      ctx.strokeStyle = "rgba(240,192,64,.45)";
      rr(ctx, -18, -36, 50, 20, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(61,186,111,.3)";
      rr(ctx, -14, -33, 42, 14, 3);
      ctx.fill();
      ctx.fillStyle = "#fef3c7";
      rr(ctx, 44, -8, 8, 8, 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();

      ctx.fillStyle = "rgba(0,0,0,.6)";
      rr(ctx, 12, 12, 150, 52, 10);
      ctx.fill();
      ctx.fillStyle = "#f0e8cc";
      ctx.font = "bold 14px system-ui,sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(Math.floor(dist / 80) + " m", 24, 34);
      ctx.fillStyle = "#f0c040";
      ctx.fillText("$ " + coinCount, 24, 52);

      const fw = 150,
        fh = 10,
        fx = W - fw - 14,
        fy = 16;
      ctx.fillStyle = "rgba(0,0,0,.6)";
      rr(ctx, fx - 36, fy - 4, fw + 48, fh + 12, 6);
      ctx.fill();
      ctx.fillStyle = "#333";
      rr(ctx, fx, fy, fw, fh, 4);
      ctx.fill();
      const fc = fuel > 50 ? "#3dba6f" : fuel > 20 ? "#f0c040" : "#ef4444";
      ctx.fillStyle = fc;
      rr(ctx, fx, fy, Math.max(2, fw * (fuel / 100)), fh, 4);
      ctx.fill();
      ctx.fillStyle = "rgba(240,232,204,.55)";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText("FUEL", fx - 6, fy + 9);

      ctx.fillStyle = "rgba(240,232,204,.28)";
      ctx.font = "11px system-ui,sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("→ / D  Gas     ← / A  Brake     SPACE  Restart", W / 2, H - 10);

      if (dead) {
        ctx.fillStyle = "rgba(0,0,0,.75)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#f0c040";
        ctx.font = "bold 36px Georgia,serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", W / 2, H / 2 - 28);
        ctx.fillStyle = "#f0e8cc";
        ctx.font = "17px system-ui,sans-serif";
        ctx.fillText(
          "Distance: " + Math.floor(dist / 80) + " m    Coins: " + coinCount,
          W / 2,
          H / 2 + 8
        );
        ctx.fillStyle = "#3dba6f";
        ctx.font = "14px system-ui,sans-serif";
        ctx.fillText("Press SPACE or Restart to play again", W / 2, H / 2 + 42);
      }
      if (fuel <= 0 && !dead) {
        ctx.fillStyle = "rgba(239,68,68,.85)";
        ctx.font = "bold 14px system-ui,sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("OUT OF FUEL", W / 2, 36);
      }
    }

    let last = 0;
    function loop(now: number) {
      if (!runningRef.current) return;
      const dt = Math.min((now - (last || now)) / 1000, 0.04);
      last = now;
      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    runningRef.current = true;
    setReady(true);
    rafRef.current = requestAnimationFrame(loop);

    const onDown = (e: KeyboardEvent) => {
      const k = e.key;
      if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D", " "].includes(k)) {
        e.preventDefault();
        keysRef.current[k] = true;
        if (k === " " && dead) reset();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    document.addEventListener("keydown", onDown, { passive: false });
    document.addEventListener("keyup", onUp);

    (canvas as any)._hcReset = reset;

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
    };
  }, []);

  const setKey = (k: string, v: boolean) => {
    keysRef.current[k] = v;
  };

  const restart = () => {
    const c = canvasRef.current as any;
    if (c && c._hcReset) c._hcReset();
  };

  return (
    <div className="game-page-wrap" id="hill-climb">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>🚗 Hill Climb Racing</h2>
        <p>→ / D = Gas · ← / A = Brake · Space = Restart</p>
      </div>
      <canvas
        ref={canvasRef}
        id="hillCanvas"
        width={780}
        height={380}
        style={{
          display: "block",
          margin: "0 auto",
          maxWidth: "100%",
          border: "1px solid var(--border)",
          borderRadius: 12,
          background: "#06060f",
        }}
      />
      {!ready && (
        <p style={{ textAlign: "center", opacity: 0.5, marginTop: 8 }}>
          Loading…
        </p>
      )}
      <div className="hc-controls">
        <button
          type="button"
          className="hc-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            setKey("ArrowLeft", true);
          }}
          onPointerUp={() => setKey("ArrowLeft", false)}
          onPointerLeave={() => setKey("ArrowLeft", false)}
          onPointerCancel={() => setKey("ArrowLeft", false)}
        >
          ◀ Brake
        </button>
        <button type="button" className="hc-btn" onClick={restart}>
          ↺ Restart
        </button>
        <button
          type="button"
          className="hc-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            setKey("ArrowRight", true);
          }}
          onPointerUp={() => setKey("ArrowRight", false)}
          onPointerLeave={() => setKey("ArrowRight", false)}
          onPointerCancel={() => setKey("ArrowRight", false)}
        >
          Gas ▶
        </button>
      </div>
    </div>
  );
}
