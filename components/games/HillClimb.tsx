"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function HillClimb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const runningRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const STEP = 25;
    const WB = 50;
    const WR = 22;

    const terrain: number[] = [];
    let ty = H * 0.58;
    for (let i = 0; i < 4000; i++) {
      terrain.push(ty);
      const x = i * STEP;
      ty =
        H * 0.58 +
        Math.sin(x * 0.006) * 55 +
        Math.sin(x * 0.018) * 28 +
        Math.sin(x * 0.045) * 14 +
        Math.sin(x * 0.002) * 90;
      ty = Math.max(H * 0.32, Math.min(H * 0.88, ty));
    }
    for (let i = 0; i < 12; i++) terrain[i] = H * 0.58;

    function getTY(x: number) {
      if (x < 0) return H * 0.58;
      const i = Math.floor(x / STEP);
      if (i >= terrain.length - 1) return terrain[terrain.length - 1];
      const t = (x % STEP) / STEP;
      return terrain[i] * (1 - t) + terrain[i + 1] * t;
    }

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 8000,
      y: Math.random() * 180,
      a: Math.random() * 0.7 + 0.1,
      r: Math.random() * 1.5 + 0.3,
    }));

    const coins: { x: number; y: number; got: boolean }[] = [];
    for (let i = 0; i < 300; i++) {
      const cx = 400 + i * 250 + Math.random() * 150;
      coins.push({ x: cx, y: getTY(cx) - 35 - Math.random() * 50, got: false });
    }

    let car = {
      x: 180,
      y: getTY(180) - WR - 28,
      vx: 0,
      vy: 0,
      angle: 0,
      angVel: 0,
    };
    let fuel = 100;
    let dist = 0;
    let coinCount = 0;
    let dead = false;
    let frameT = 0;

    function reset() {
      car = {
        x: 180,
        y: getTY(180) - WR - 28,
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
      const GRAV = 900,
        ENG = 700,
        BRK = 350,
        FRIC = 0.94,
        SK = 1200,
        FRATE = 10;
      const cos = Math.cos(car.angle),
        sin = Math.sin(car.angle);

      const fwx = car.x + cos * WB,
        fwy = car.y + sin * WB;
      const rwx = car.x - cos * WB,
        rwy = car.y - sin * WB;
      const fty = getTY(fwx) - WR;
      const rty = getTY(rwx) - WR;
      const fdiff = fwy - fty;
      const rdiff = rwy - rty;

      if (fdiff > -15) {
        const fF = Math.max(0, fdiff) * SK;
        car.vy -= fF * dt;
        car.angVel += fF * WB * 0.0004 * dt;
      }
      if (rdiff > -15) {
        const rF = Math.max(0, rdiff) * SK;
        car.vy -= rF * dt;
        car.angVel -= rF * WB * 0.0004 * dt;
      }

      car.vy += GRAV * dt;
      const keys = keysRef.current;
      const gas = keys["ArrowRight"] || keys["d"] || keys["D"];
      const brk = keys["ArrowLeft"] || keys["a"] || keys["A"];

      if (gas && fuel > 0) {
        car.vx += ENG * cos * dt;
        car.angVel -= 1.8 * dt;
        fuel = Math.max(0, fuel - FRATE * dt);
      }
      if (brk) {
        car.vx -= BRK * dt;
        car.angVel += 1.5 * dt;
      }

      car.vx *= Math.pow(FRIC, dt * 60);
      car.angVel *= Math.pow(0.88, dt * 60);
      car.vx = Math.max(-200, Math.min(700, car.vx));
      car.x += car.vx * dt;
      car.y += car.vy * dt;
      car.angle += car.angVel * dt;

      const gnd = getTY(car.x) - WR - 25;
      if (car.y > gnd) {
        car.y = gnd;
        car.vy *= -0.15;
      }

      dist = Math.max(dist, car.x);
      coins.forEach((c) => {
        if (!c.got) {
          const dx = c.x - car.x,
            dy = c.y - car.y;
          if (dx * dx + dy * dy < 1200) {
            c.got = true;
            coinCount++;
          }
        }
      });

      if (Math.abs(car.angle) > Math.PI * 0.72 || car.y > H + 80) dead = true;
      if (fuel <= 0 && Math.abs(car.vx) < 2) dead = true;
      frameT += dt;
    }

    function drawWheel(wx: number, wy: number) {
      ctx!.save();
      ctx!.translate(wx, wy);
      ctx!.fillStyle = "#1a1a1a";
      ctx!.strokeStyle = "#555";
      ctx!.lineWidth = 3;
      ctx!.beginPath();
      ctx!.arc(0, 0, WR, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.stroke();
      for (let s = 0; s < 5; s++) {
        const a = frameT * 4 + (s * Math.PI * 2) / 5;
        ctx!.strokeStyle = "#c9990a";
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(Math.cos(a) * 4, Math.sin(a) * 4);
        ctx!.lineTo(Math.cos(a) * 17, Math.sin(a) * 17);
        ctx!.stroke();
      }
      ctx!.fillStyle = "#f0c040";
      ctx!.beginPath();
      ctx!.arc(0, 0, 5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const camX = car.x - W * 0.28;

      const sky = ctx!.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#06060f");
      sky.addColorStop(1, "#12100a");
      ctx!.fillStyle = sky;
      ctx!.fillRect(0, 0, W, H);

      stars.forEach((s) => {
        ctx!.fillStyle = `rgba(240,192,64,${s.a})`;
        ctx!.beginPath();
        ctx!.arc((((s.x - camX * 0.08) % W) + W) % W, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
      });

      ctx!.save();
      ctx!.translate(-camX, 0);

      ctx!.beginPath();
      ctx!.moveTo(camX - 20, H + 20);
      for (
        let i = Math.max(0, Math.floor(camX / STEP) - 1);
        i < Math.min(terrain.length, Math.floor((camX + W) / STEP) + 2);
        i++
      ) {
        ctx!.lineTo(i * STEP, terrain[i]);
      }
      ctx!.lineTo(camX + W + 20, H + 20);
      ctx!.closePath();
      const tg = ctx!.createLinearGradient(0, H * 0.3, 0, H);
      tg.addColorStop(0, "#243a18");
      tg.addColorStop(0.4, "#162610");
      tg.addColorStop(1, "#0a1206");
      ctx!.fillStyle = tg;
      ctx!.fill();
      ctx!.strokeStyle = "#3dba6f";
      ctx!.lineWidth = 3;
      ctx!.stroke();

      coins.forEach((c) => {
        if (c.got || c.x < camX - 30 || c.x > camX + W + 30) return;
        ctx!.save();
        ctx!.shadowBlur = 12;
        ctx!.shadowColor = "#f0c040";
        ctx!.fillStyle = "#f0c040";
        ctx!.beginPath();
        ctx!.arc(c.x, c.y, 7, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "#fff";
        ctx!.font = "bold 8px sans-serif";
        ctx!.textAlign = "center";
        ctx!.fillText("$", c.x, c.y + 3);
        ctx!.restore();
      });

      const cos = Math.cos(car.angle),
        sin = Math.sin(car.angle);
      const fwx = car.x + cos * WB;
      const fwy = Math.min(car.y + sin * WB, getTY(car.x + cos * WB) - WR);
      const rwx = car.x - cos * WB;
      const rwy = Math.min(
        car.y - sin * WB + 15,
        getTY(car.x - cos * WB) - WR
      );
      drawWheel(fwx, fwy);
      drawWheel(rwx, rwy);

      ctx!.save();
      ctx!.translate(car.x, car.y);
      ctx!.rotate(car.angle);
      ctx!.shadowBlur = 15;
      ctx!.shadowColor = "rgba(201,153,10,.4)";
      ctx!.fillStyle = "#c9990a";
      ctx!.strokeStyle = "#f0c040";
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      (ctx as any).roundRect(-58, -22, 116, 32, 8);
      ctx!.fill();
      ctx!.stroke();
      ctx!.shadowBlur = 0;
      ctx!.fillStyle = "#0d0b06";
      ctx!.strokeStyle = "rgba(240,192,64,.5)";
      ctx!.beginPath();
      (ctx as any).roundRect(-22, -40, 56, 22, 5);
      ctx!.fill();
      ctx!.stroke();
      ctx!.fillStyle = "rgba(61,186,111,.35)";
      ctx!.beginPath();
      (ctx as any).roundRect(-17, -37, 46, 16, 4);
      ctx!.fill();
      ctx!.fillStyle = "#555";
      ctx!.beginPath();
      (ctx as any).roundRect(-58, -5, 8, 10, 3);
      ctx!.fill();
      ctx!.restore();
      ctx!.restore();

      ctx!.fillStyle = "rgba(0,0,0,.55)";
      ctx!.beginPath();
      (ctx as any).roundRect(12, 12, 160, 54, 10);
      ctx!.fill();
      ctx!.fillStyle = "#f0e8cc";
      ctx!.font = "bold 14px DM Sans,sans-serif";
      ctx!.textAlign = "left";
      ctx!.fillText(`📏 ${Math.floor(dist / 80)}m`, 22, 32);
      ctx!.fillStyle = "#f0c040";
      ctx!.fillText(`💰 ${coinCount}`, 22, 52);

      const fw = 160,
        fh = 10,
        fx = W - fw - 12,
        fy = 12;
      ctx!.fillStyle = "rgba(0,0,0,.55)";
      ctx!.beginPath();
      (ctx as any).roundRect(fx - 32, fy - 2, fw + 44, fh + 4, 6);
      ctx!.fill();
      ctx!.fillStyle = "#333";
      ctx!.beginPath();
      (ctx as any).roundRect(fx, fy, fw, fh, 5);
      ctx!.fill();
      const fc = fuel > 50 ? "#3dba6f" : fuel > 20 ? "#f0c040" : "#ef4444";
      ctx!.fillStyle = fc;
      ctx!.beginPath();
      (ctx as any).roundRect(fx, fy, fw * (fuel / 100), fh, 5);
      ctx!.fill();
      ctx!.fillStyle = "rgba(240,232,204,.6)";
      ctx!.font = "10px Space Mono,monospace";
      ctx!.textAlign = "right";
      ctx!.fillText("FUEL", fx - 6, fy + 9);

      ctx!.fillStyle = "rgba(240,232,204,.3)";
      ctx!.font = "11px DM Sans";
      ctx!.textAlign = "center";
      ctx!.fillText("→ Gas   ← Brake   SPACE Restart", W / 2, H - 8);

      if (dead) {
        ctx!.fillStyle = "rgba(0,0,0,.7)";
        ctx!.fillRect(0, 0, W, H);
        ctx!.fillStyle = "#f0c040";
        ctx!.font = "bold 38px Playfair Display,serif";
        ctx!.textAlign = "center";
        ctx!.fillText("Game Over! 💥", W / 2, H / 2 - 30);
        ctx!.fillStyle = "#f0e8cc";
        ctx!.font = "18px DM Sans";
        ctx!.fillText(
          `Distance: ${Math.floor(dist / 80)}m   Coins: ${coinCount}`,
          W / 2,
          H / 2 + 10
        );
        ctx!.fillStyle = "#3dba6f";
        ctx!.font = "14px DM Sans";
        ctx!.fillText("Press SPACE to restart", W / 2, H / 2 + 46);
      }
      if (fuel <= 0 && !dead) {
        ctx!.fillStyle = "rgba(239,68,68,.8)";
        ctx!.font = "bold 14px DM Sans";
        ctx!.textAlign = "center";
        ctx!.fillText("⛽ OUT OF FUEL!", W / 2, 32);
      }
    }

    let last = 0;
    function loop(now: number) {
      if (!runningRef.current) return;
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    runningRef.current = true;
    rafRef.current = requestAnimationFrame(loop);

    const onDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "d", "A", "D", " "].includes(e.key)) {
        e.preventDefault();
        keysRef.current[e.key] = true;
        if (e.key === " " && dead) reset();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    document.addEventListener("keydown", onDown);
    document.addEventListener("keyup", onUp);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("keyup", onUp);
    };
  }, []);

  const press = (k: string, v: boolean) => {
    keysRef.current[k] = v;
  };

  return (
    <div className="game-page-wrap" id="hill-climb">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>🚗 Hill Climb Racing</h2>
        <p>→ Gas &nbsp;|&nbsp; ← Brake &nbsp;|&nbsp; Space = Restart</p>
      </div>
      <canvas ref={canvasRef} id="hillCanvas" width={780} height={380} />
      <div className="hc-controls">
        <button
          className="hc-btn"
          onTouchStart={() => press("ArrowLeft", true)}
          onTouchEnd={() => press("ArrowLeft", false)}
          onMouseDown={() => press("ArrowLeft", true)}
          onMouseUp={() => press("ArrowLeft", false)}
          onMouseLeave={() => press("ArrowLeft", false)}
        >
          ◀ Brake
        </button>
        <button
          className="hc-btn"
          onTouchStart={() => press("ArrowRight", true)}
          onTouchEnd={() => press("ArrowRight", false)}
          onMouseDown={() => press("ArrowRight", true)}
          onMouseUp={() => press("ArrowRight", false)}
          onMouseLeave={() => press("ArrowRight", false)}
        >
          Gas ▶
        </button>
      </div>
    </div>
  );
}
