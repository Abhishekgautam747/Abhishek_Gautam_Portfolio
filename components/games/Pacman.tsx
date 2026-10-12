"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MAZE = [
  "############################",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#o####.#####.##.#####.####o#",
  "#.####.#####.##.#####.####.#",
  "#..........................#",
  "#.####.##.########.##.####.#",
  "#.####.##.########.##.####.#",
  "#......##....##....##......#",
  "######.#####.##.#####.######",
  "     #.#####.##.#####.#     ",
  "     #.##          ##.#     ",
  "     #.## ###--### ##.#     ",
  "######.## #      # ##.######",
  "      .   #      #   .      ",
  "######.## #      # ##.######",
  "     #.## ######## ##.#     ",
  "     #.##          ##.#     ",
  "     #.## ######## ##.#     ",
  "######.## ######## ##.######",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#.####.#####.##.#####.####.#",
  "#o..##................##..o#",
  "###.##.##.########.##.##.###",
  "###.##.##.########.##.##.###",
  "#......##....##....##......#",
  "#.##########.##.##########.#",
  "#.##########.##.##########.#",
  "#..........................#",
  "############################",
];

export default function Pacman() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const stateRef = useRef<any>(null);
  const runningRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLS = 28,
      ROWS = 31;
    const TW = canvas.width / COLS,
      TH = canvas.height / ROWS;

    function parseMaze() {
      const g: any[][] = [];
      for (let r = 0; r < ROWS; r++) {
        g[r] = [];
        for (let c = 0; c < COLS; c++) {
          const ch = (MAZE[r] || "")[c] || "#";
          g[r][c] = {
            wall: ch === "#",
            dot: ch === ".",
            power: ch === "o",
            door: ch === "-",
          };
        }
      }
      return g;
    }

    let maze = parseMaze();
    let paused = false,
      gameOver = false,
      won = false;
    let frightTimer = 0,
      flashTimer = 0,
      modeTimer = 0,
      scatterPhase = true;
    let scoreLocal = 0,
      livesLocal = 3,
      levelLocal = 1;

    const pacman = {
      r: 23,
      c: 14,
      dr: 0,
      dc: 0,
      nextDr: 0,
      nextDc: 0,
      t: 0,
      mouthAngle: 0.25,
      mouthDir: 1,
    };

    const ghosts = [
      { r: 14, c: 14, dr: -1, dc: 0, color: "#ef4444", scatter: { r: 0, c: COLS - 1 }, mode: "scatter", t: 0, frightened: false, eaten: false },
      { r: 14, c: 13, dr: 1, dc: 0, color: "#f9a8d4", scatter: { r: 0, c: 0 }, mode: "scatter", t: 0, frightened: false, eaten: false },
      { r: 14, c: 14, dr: 0, dc: 1, color: "#3dba6f", scatter: { r: ROWS - 1, c: COLS - 1 }, mode: "scatter", t: 0, frightened: false, eaten: false },
      { r: 14, c: 15, dr: 0, dc: -1, color: "#f0c040", scatter: { r: ROWS - 1, c: 0 }, mode: "scatter", t: 0, frightened: false, eaten: false },
    ];

    function canMove(r: number, c: number) {
      return r >= 0 && r < ROWS && c >= 0 && c < COLS && !maze[r]?.[c]?.wall && !maze[r]?.[c]?.door;
    }
    function canGhostMove(r: number, c: number) {
      return r >= 0 && r < ROWS && c >= 0 && c < COLS && !maze[r]?.[c]?.wall;
    }
    function dist(r1: number, c1: number, r2: number, c2: number) {
      return Math.abs(r1 - r2) + Math.abs(c1 - c2);
    }

    function ghostAI(g: any, i: number) {
      const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
      const rev = [-g.dr, -g.dc];
      const target = g.frightened
        ? { r: Math.floor(Math.random() * ROWS), c: Math.floor(Math.random() * COLS) }
        : g.mode === "scatter"
        ? g.scatter
        : { r: pacman.r + (i === 1 ? -4 * pacman.dr : 0), c: pacman.c + (i === 1 ? -4 * pacman.dc : 0) };
      if (i === 0 && g.mode === "chase") Object.assign(target, { r: pacman.r, c: pacman.c });
      let bestDir: number[] | null = null,
        bestDist = Infinity;
      for (const [dr, dc] of dirs) {
        if (dr === rev[0] && dc === rev[1]) continue;
        const nr = g.r + dr,
          nc = g.c + dc;
        if (!canGhostMove(nr, nc)) continue;
        const d = g.frightened ? Math.random() * 100 : dist(nr, nc, target.r, target.c);
        if (d < bestDist) {
          bestDist = d;
          bestDir = [dr, dc];
        }
      }
      return bestDir || [g.dr, g.dc];
    }

    function updateHUD() {
      setScore(scoreLocal);
      setLives(livesLocal);
      setLevel(levelLocal);
    }

    function update(dt: number) {
      if (paused || gameOver || won) return;
      modeTimer += dt;
      if (modeTimer > 7) {
        modeTimer = 0;
        scatterPhase = !scatterPhase;
        ghosts.forEach((g) => {
          if (!g.frightened) g.mode = scatterPhase ? "scatter" : "chase";
        });
      }
      if (frightTimer > 0) {
        frightTimer -= dt;
        if (frightTimer <= 0) {
          ghosts.forEach((g) => {
            g.frightened = false;
            g.eaten = false;
            if (!scatterPhase) g.mode = "chase";
          });
        }
      }
      flashTimer += dt;

      const pnr = pacman.r + pacman.nextDr,
        pnc = pacman.c + pacman.nextDc;
      if (canMove(pnr, pnc) && (pacman.nextDr !== 0 || pacman.nextDc !== 0)) {
        pacman.dr = pacman.nextDr;
        pacman.dc = pacman.nextDc;
      }
      const nr = pacman.r + pacman.dr,
        nc = pacman.c + pacman.dc;
      pacman.t += dt * 8;
      if (canMove(nr, nc)) {
        if (pacman.t >= 1) {
          pacman.t -= 1;
          pacman.r = (nr + ROWS) % ROWS;
          pacman.c = (nc + COLS) % COLS;
          const cell = maze[pacman.r][pacman.c];
          if (cell.dot) {
            cell.dot = false;
            scoreLocal += 10;
            updateHUD();
          }
          if (cell.power) {
            cell.power = false;
            scoreLocal += 50;
            updateHUD();
            frightTimer = 8;
            ghosts.forEach((g) => {
              g.frightened = true;
              g.mode = "scatter";
            });
          }
        }
      } else pacman.t = Math.max(pacman.t, 0.9);

      pacman.mouthAngle += pacman.mouthDir * dt * 3;
      if (pacman.mouthAngle > 0.35) pacman.mouthDir = -1;
      if (pacman.mouthAngle < 0.02) pacman.mouthDir = 1;

      ghosts.forEach((g, i) => {
        if (g.eaten) {
          g.r = 14;
          g.c = 14;
          g.eaten = false;
          g.frightened = false;
          return;
        }
        g.t += dt * (g.frightened ? 5 : 7);
        if (g.t >= 1) {
          g.t -= 1;
          const [dr, dc] = ghostAI(g, i);
          g.dr = dr;
          g.dc = dc;
          const gnr = (g.r + dr + ROWS) % ROWS,
            gnc = (g.c + dc + COLS) % COLS;
          if (canGhostMove(gnr, gnc)) {
            g.r = gnr;
            g.c = gnc;
          }
        }
        if (g.r === pacman.r && g.c === pacman.c) {
          if (g.frightened) {
            g.eaten = true;
            scoreLocal += 200;
            updateHUD();
          } else {
            livesLocal--;
            updateHUD();
            if (livesLocal <= 0) gameOver = true;
            else {
              pacman.r = 23;
              pacman.c = 14;
              pacman.dr = 0;
              pacman.dc = 0;
            }
          }
        }
      });

      let dotsLeft = 0;
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (maze[r][c].dot || maze[r][c].power) dotsLeft++;
      if (dotsLeft === 0) {
        won = true;
        scoreLocal += 1000;
        updateHUD();
      }
    }

    function draw() {
      ctx!.fillStyle = "#000";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = maze[r][c];
          const x = c * TW,
            y = r * TH;
          if (cell.wall) {
            ctx!.fillStyle = "#1a4a9a";
            ctx!.fillRect(x, y, TW, TH);
            ctx!.strokeStyle = "#2563eb";
            ctx!.lineWidth = 0.5;
            ctx!.strokeRect(x + 0.5, y + 0.5, TW - 1, TH - 1);
          } else if (cell.dot) {
            ctx!.fillStyle = "#f0e8cc";
            ctx!.beginPath();
            ctx!.arc(x + TW / 2, y + TH / 2, 1.5, 0, Math.PI * 2);
            ctx!.fill();
          } else if (cell.power) {
            const pulse = 0.7 + 0.3 * Math.sin(flashTimer * 6);
            ctx!.fillStyle = `rgba(240,192,64,${pulse})`;
            ctx!.beginPath();
            ctx!.arc(x + TW / 2, y + TH / 2, 4, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      }

      const pa = pacman.mouthAngle * Math.PI;
      let angle = 0;
      if (pacman.dc === 1) angle = 0;
      else if (pacman.dc === -1) angle = Math.PI;
      else if (pacman.dr === -1) angle = -Math.PI / 2;
      else angle = Math.PI / 2;
      const px = pacman.c * TW + TW / 2,
        py = pacman.r * TH + TH / 2;
      ctx!.fillStyle = "#f0c040";
      ctx!.shadowBlur = 10;
      ctx!.shadowColor = "#f0c040";
      ctx!.beginPath();
      ctx!.moveTo(px, py);
      ctx!.arc(px, py, TW / 2 - 1, angle + pa, angle + Math.PI * 2 - pa);
      ctx!.closePath();
      ctx!.fill();
      ctx!.shadowBlur = 0;

      ghosts.forEach((g) => {
        const gx = g.c * TW + TW / 2,
          gy = g.r * TH + TH / 2,
          gr = TW / 2 - 1;
        const fl = g.frightened && frightTimer < 3 && Math.sin(flashTimer * 10) > 0;
        const gc = g.frightened ? (fl ? "#fff" : "#1a4a9a") : g.color;
        ctx!.fillStyle = gc;
        ctx!.beginPath();
        ctx!.arc(gx, gy - gr * 0.1, gr, Math.PI, 0);
        ctx!.lineTo(gx + gr, gy + gr);
        for (let w = 0; w < 3; w++) {
          const wx = gx + gr - (w * 2) / 3 * gr * 2;
          ctx!.quadraticCurveTo(wx - gr / 3, gy + gr * 0.6, wx - (gr * 2) / 3, gy + gr);
        }
        ctx!.lineTo(gx - gr, gy + gr);
        ctx!.closePath();
        ctx!.fill();
        if (!g.frightened) {
          ctx!.fillStyle = "#fff";
          ctx!.beginPath();
          ctx!.ellipse(gx - gr * 0.3, gy - gr * 0.1, gr * 0.25, gr * 0.32, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.beginPath();
          ctx!.ellipse(gx + gr * 0.3, gy - gr * 0.1, gr * 0.25, gr * 0.32, 0, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = "#1a4a9a";
          ctx!.beginPath();
          ctx!.arc(gx - gr * 0.25, gy - gr * 0.1, gr * 0.13, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(gx + gr * 0.35, gy - gr * 0.1, gr * 0.13, 0, Math.PI * 2);
          ctx!.fill();
        }
      });

      if (paused) {
        ctx!.fillStyle = "rgba(0,0,0,.6)";
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        ctx!.fillStyle = "#f0c040";
        ctx!.font = "bold 32px Playfair Display,serif";
        ctx!.textAlign = "center";
        ctx!.fillText("PAUSED", canvas!.width / 2, canvas!.height / 2);
      }
      if (gameOver) {
        ctx!.fillStyle = "rgba(0,0,0,.7)";
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        ctx!.fillStyle = "#ef4444";
        ctx!.font = "bold 36px Playfair Display,serif";
        ctx!.textAlign = "center";
        ctx!.fillText("GAME OVER", canvas!.width / 2, canvas!.height / 2 - 20);
        ctx!.fillStyle = "#f0e8cc";
        ctx!.font = "16px DM Sans";
        ctx!.fillText("Press R to restart", canvas!.width / 2, canvas!.height / 2 + 20);
      }
      if (won) {
        ctx!.fillStyle = "rgba(0,0,0,.7)";
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        ctx!.fillStyle = "#f0c040";
        ctx!.font = "bold 36px Playfair Display,serif";
        ctx!.textAlign = "center";
        ctx!.fillText("YOU WIN! 🎉", canvas!.width / 2, canvas!.height / 2 - 20);
        ctx!.fillStyle = "#f0e8cc";
        ctx!.font = "16px DM Sans";
        ctx!.fillText("Score: " + scoreLocal, canvas!.width / 2, canvas!.height / 2 + 20);
      }
    }

    let lastT = 0;
    function loop(t: number) {
      if (!runningRef.current) return;
      const dt = Math.min((t - (lastT || t)) / 1000, 0.05);
      lastT = t;
      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowUp" || k === "w") {
        pacman.nextDr = -1;
        pacman.nextDc = 0;
      } else if (k === "ArrowDown" || k === "s") {
        pacman.nextDr = 1;
        pacman.nextDc = 0;
      } else if (k === "ArrowLeft" || k === "a") {
        pacman.nextDr = 0;
        pacman.nextDc = -1;
      } else if (k === "ArrowRight" || k === "d") {
        pacman.nextDr = 0;
        pacman.nextDc = 1;
      } else if (k === "p" || k === "P") paused = !paused;
      else if ((k === "r" || k === "R") && (gameOver || won)) {
        maze = parseMaze();
        scoreLocal = 0;
        livesLocal = 3;
        levelLocal = 1;
        gameOver = false;
        won = false;
        pacman.r = 23;
        pacman.c = 14;
        pacman.dr = 0;
        pacman.dc = 0;
        updateHUD();
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(k)) e.preventDefault();
    };

    document.addEventListener("keydown", onKey);
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(loop);
    stateRef.current = { pacman };

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="game-page-wrap" id="pacman-game" style={{ background: "#000" }}>
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="pm-hud">
        <span>
          SCORE: <strong>{score}</strong>
        </span>
        <span>
          LIVES: <strong>{"❤️".repeat(Math.max(0, lives))}</strong>
        </span>
        <span>
          LEVEL: <strong>{level}</strong>
        </span>
      </div>
      <canvas ref={canvasRef} id="pacmanCanvas" width={476} height={548} />
      <p
        style={{
          color: "#888",
          fontSize: ".8rem",
          marginTop: ".7rem",
          fontFamily: "'Space Mono',monospace",
        }}
      >
        Arrow Keys / WASD to move · P to pause · R to restart
      </p>
    </div>
  );
}
