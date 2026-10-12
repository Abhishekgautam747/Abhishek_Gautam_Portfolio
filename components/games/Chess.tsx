"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const PIECES: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};
const VALS: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

type Board = (string | null)[][];
type State = {
  board: Board;
  turn: "w" | "b";
  castling: { w: { k: boolean; q: boolean }; b: { k: boolean; q: boolean } };
  enPassant: [number, number] | null;
};

function initBoard(): Board {
  return [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];
}

function isW(p: string | null) {
  return !!p && p === p.toUpperCase();
}
function color(p: string | null): "w" | "b" | null {
  return p ? (isW(p) ? "w" : "b") : null;
}
function opp(c: "w" | "b") {
  return c === "w" ? "b" : "w";
}
function copyBoard(b: Board): Board {
  return b.map((r) => [...r]);
}

function findKing(b: Board, c: "w" | "b"): [number, number] | null {
  const k = c === "w" ? "K" : "k";
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++) if (b[r][f] === k) return [r, f];
  return null;
}

function isAttacked(b: Board, r: number, f: number, byColor: "w" | "b") {
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (const [dr, df] of dirs) {
    let cr = r + dr,
      cf = f + df;
    while (cr >= 0 && cr < 8 && cf >= 0 && cf < 8) {
      const p = b[cr][cf];
      if (p) {
        const isDiag = dr !== 0 && df !== 0;
        const isStraight = dr === 0 || df === 0;
        if (color(p) === byColor) {
          const t = p.toLowerCase();
          if (t === "q") return true;
          if (isDiag && t === "b") return true;
          if (isStraight && t === "r") return true;
          if (Math.abs(cr - r) <= 1 && Math.abs(cf - f) <= 1 && t === "k") return true;
        }
        break;
      }
      cr += dr;
      cf += df;
    }
  }
  for (const [dr, df] of [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]) {
    const cr = r + dr,
      cf = f + df;
    if (cr >= 0 && cr < 8 && cf >= 0 && cf < 8) {
      const p = b[cr][cf];
      if (p && color(p) === byColor && p.toLowerCase() === "n") return true;
    }
  }
  const pd = byColor === "w" ? 1 : -1;
  for (const df of [-1, 1]) {
    const cr = r + pd,
      cf = f + df;
    if (cr >= 0 && cr < 8 && cf >= 0 && cf < 8) {
      const p = b[cr][cf];
      if (p && color(p) === byColor && p.toLowerCase() === "p") return true;
    }
  }
  return false;
}

function isInCheck(b: Board, c: "w" | "b") {
  const k = findKing(b, c);
  if (!k) return true;
  return isAttacked(b, k[0], k[1], opp(c));
}

function getRawMoves(b: Board, r: number, f: number, ep: [number, number] | null, cas: State["castling"]) {
  const p = b[r][f];
  if (!p) return [] as [number, number][];
  const c = color(p)!;
  const t = p.toLowerCase();
  const moves: [number, number][] = [];
  const add = (nr: number, nf: number) => {
    if (nr >= 0 && nr < 8 && nf >= 0 && nf < 8) moves.push([nr, nf]);
  };

  if (t === "p") {
    const dir = c === "w" ? -1 : 1;
    const startR = c === "w" ? 6 : 1;
    if (!b[r + dir]?.[f]) add(r + dir, f);
    if (r === startR && !b[r + dir]?.[f] && !b[r + 2 * dir]?.[f]) add(r + 2 * dir, f);
    for (const df of [-1, 1]) {
      const nr = r + dir,
        nf = f + df;
      if (nr >= 0 && nr < 8 && nf >= 0 && nf < 8) {
        if (b[nr][nf] && color(b[nr][nf]) !== c) add(nr, nf);
        if (ep && ep[0] === nr && ep[1] === nf) add(nr, nf);
      }
    }
  } else if (t === "n") {
    for (const [dr, df] of [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]) {
      const nr = r + dr,
        nf = f + df;
      if (nr >= 0 && nr < 8 && nf >= 0 && nf < 8 && color(b[nr][nf]) !== c) add(nr, nf);
    }
  } else if (t === "b" || t === "r" || t === "q") {
    const dirs =
      t === "b"
        ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        : t === "r"
        ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
        : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const [dr, df] of dirs) {
      let cr = r + dr,
        cf = f + df;
      while (cr >= 0 && cr < 8 && cf >= 0 && cf < 8) {
        if (b[cr][cf]) {
          if (color(b[cr][cf]) !== c) add(cr, cf);
          break;
        }
        add(cr, cf);
        cr += dr;
        cf += df;
      }
    }
  } else if (t === "k") {
    for (const [dr, df] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const nr = r + dr,
        nf = f + df;
      if (nr >= 0 && nr < 8 && nf >= 0 && nf < 8 && color(b[nr][nf]) !== c) add(nr, nf);
    }
    if (cas[c]) {
      const rr = c === "w" ? 7 : 0;
      if (
        cas[c].k &&
        !b[rr][5] &&
        !b[rr][6] &&
        !isAttacked(b, rr, 4, opp(c)) &&
        !isAttacked(b, rr, 5, opp(c)) &&
        !isAttacked(b, rr, 6, opp(c))
      )
        add(rr, 6);
      if (
        cas[c].q &&
        !b[rr][3] &&
        !b[rr][2] &&
        !b[rr][1] &&
        !isAttacked(b, rr, 4, opp(c)) &&
        !isAttacked(b, rr, 3, opp(c)) &&
        !isAttacked(b, rr, 2, opp(c))
      )
        add(rr, 2);
    }
  }
  return moves;
}

function getLegalMoves(state: State, r: number, f: number) {
  const p = state.board[r][f];
  if (!p) return [] as [number, number][];
  const c = color(p)!;
  return getRawMoves(state.board, r, f, state.enPassant, state.castling).filter(([nr, nf]) => {
    const nb = copyBoard(state.board);
    nb[nr][nf] = nb[r][f];
    nb[r][f] = null;
    if (nb[nr][nf]!.toLowerCase() === "p" && state.enPassant && nr === state.enPassant[0] && nf === state.enPassant[1])
      nb[r][nf] = null;
    if (nb[nr][nf]!.toLowerCase() === "k" && Math.abs(nf - f) === 2) {
      const rr = c === "w" ? 7 : 0;
      if (nf === 6) {
        nb[rr][5] = nb[rr][7];
        nb[rr][7] = null;
      } else {
        nb[rr][3] = nb[rr][0];
        nb[rr][0] = null;
      }
    }
    return !isInCheck(nb, c);
  });
}

function applyMove(state: State, fr: number, ff: number, tr: number, tf: number, promo: string | null): State {
  const b = copyBoard(state.board);
  const p = b[fr][ff]!;
  const c = color(p)!;
  const t = p.toLowerCase();
  let ep: [number, number] | null = null;
  if (t === "p" && state.enPassant && tr === state.enPassant[0] && tf === state.enPassant[1]) b[fr][tf] = null;
  if (t === "p" && Math.abs(tr - fr) === 2) ep = [fr + (tr > fr ? 1 : -1), tf];
  const cas = JSON.parse(JSON.stringify(state.castling));
  if (t === "k") {
    cas[c].k = false;
    cas[c].q = false;
    if (Math.abs(tf - ff) === 2) {
      const rr = c === "w" ? 7 : 0;
      if (tf === 6) {
        b[rr][5] = b[rr][7];
        b[rr][7] = null;
      } else {
        b[rr][3] = b[rr][0];
        b[rr][0] = null;
      }
    }
  }
  if (t === "r") {
    if (ff === 7) cas[c].k = false;
    if (ff === 0) cas[c].q = false;
  }
  b[tr][tf] =
    promo ||
    (t === "p" && (tr === 0 || tr === 7) ? (c === "w" ? "Q" : "q") : b[fr][ff]);
  b[fr][ff] = null;
  return { board: b, enPassant: ep, castling: cas, turn: opp(c) };
}

function hasAnyMoves(state: State) {
  const c = state.turn;
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++)
      if (color(state.board[r][f]) === c && getLegalMoves(state, r, f).length > 0) return true;
  return false;
}

function evalBoard(b: Board) {
  let score = 0;
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++) {
      const p = b[r][f];
      if (!p) continue;
      const t = p.toLowerCase();
      const c = color(p)!;
      const val = VALS[t] || 0;
      score += c === "w" ? val : -val;
    }
  return score;
}

function minimax(state: State, depth: number, alpha: number, beta: number, maxing: boolean): number {
  if (depth === 0) return evalBoard(state.board);
  const c = state.turn;
  let bestVal = maxing ? -Infinity : Infinity;
  const moves: [number, number, number, number][] = [];
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++)
      if (color(state.board[r][f]) === c)
        getLegalMoves(state, r, f).forEach(([tr, tf]) => moves.push([r, f, tr, tf]));
  if (!moves.length) {
    if (isInCheck(state.board, c)) return maxing ? -50000 : 50000;
    return 0;
  }
  for (const [fr, ff, tr, tf] of moves) {
    const ns = applyMove(state, fr, ff, tr, tf, null);
    const val = minimax(ns, depth - 1, alpha, beta, !maxing);
    if (maxing) {
      bestVal = Math.max(bestVal, val);
      alpha = Math.max(alpha, val);
    } else {
      bestVal = Math.min(bestVal, val);
      beta = Math.min(beta, val);
    }
    if (beta <= alpha) break;
  }
  return bestVal;
}

function aiMove(state: State) {
  const moves: [number, number, number, number][] = [];
  for (let r = 0; r < 8; r++)
    for (let f = 0; f < 8; f++)
      if (color(state.board[r][f]) === "b")
        getLegalMoves(state, r, f).forEach(([tr, tf]) => moves.push([r, f, tr, tf]));
  if (!moves.length) return null;
  let best: [number, number, number, number] | null = null;
  let bestVal = Infinity;
  for (const m of moves) {
    const ns = applyMove(state, m[0], m[1], m[2], m[3], null);
    const v = minimax(ns, 2, -Infinity, Infinity, true);
    if (v < bestVal) {
      bestVal = v;
      best = m;
    }
  }
  return best;
}

function rankFile(r: number, f: number) {
  return String.fromCharCode(97 + f) + (8 - r);
}

export default function Chess() {
  const [state, setState] = useState<State>(() => ({
    board: initBoard(),
    turn: "w",
    castling: { w: { k: true, q: true }, b: { k: true, q: true } },
    enPassant: null,
  }));
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [lastMove, setLastMove] = useState<[number, number, number, number] | null>(null);
  const [status, setStatus] = useState("playing");
  const [thinking, setThinking] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);
  const [promo, setPromo] = useState<{ fr: number; ff: number; tr: number; tf: number } | null>(null);

  const doMove = useCallback(
    (fr: number, ff: number, tr: number, tf: number, promoPiece: string | null) => {
      const notation = rankFile(fr, ff) + rankFile(tr, tf);
      const ns = applyMove(state, fr, ff, tr, tf, promoPiece);
      setState(ns);
      setSel(null);
      setValidMoves([]);
      setLastMove([fr, ff, tr, tf]);
      setMoves((m) => [...m, (state.turn === "w" ? "W: " : "B: ") + notation]);

      if (!hasAnyMoves(ns)) {
        setStatus(isInCheck(ns.board, ns.turn) ? "checkmate" : "stalemate");
        return;
      }
      setStatus(isInCheck(ns.board, ns.turn) ? "check" : "playing");

      if (ns.turn === "b") {
        setThinking(true);
        setTimeout(() => {
          const m = aiMove(ns);
          if (m) {
            const ns2 = applyMove(ns, m[0], m[1], m[2], m[3], null);
            setState(ns2);
            setLastMove([m[0], m[1], m[2], m[3]]);
            setMoves((mv) => [...mv, "B: " + rankFile(m[0], m[1]) + rankFile(m[2], m[3])]);
            if (!hasAnyMoves(ns2)) setStatus(isInCheck(ns2.board, ns2.turn) ? "checkmate" : "stalemate");
            else setStatus(isInCheck(ns2.board, ns2.turn) ? "check" : "playing");
          }
          setThinking(false);
        }, 200);
      }
    },
    [state]
  );

  function onClick(r: number, f: number) {
    if (state.turn !== "w" || thinking || status === "checkmate" || status === "stalemate" || promo) return;
    if (sel) {
      const isValid = validMoves.some(([vr, vf]) => vr === r && vf === f);
      if (isValid) {
        if (state.board[sel[0]][sel[1]]!.toLowerCase() === "p" && (r === 0 || r === 7)) {
          setPromo({ fr: sel[0], ff: sel[1], tr: r, tf: f });
          return;
        }
        doMove(sel[0], sel[1], r, f, null);
        return;
      }
    }
    const p = state.board[r][f];
    if (p && color(p) === "w") {
      setSel([r, f]);
      setValidMoves(getLegalMoves(state, r, f));
    } else {
      setSel(null);
      setValidMoves([]);
    }
  }

  function newGame() {
    setState({
      board: initBoard(),
      turn: "w",
      castling: { w: { k: true, q: true }, b: { k: true, q: true } },
      enPassant: null,
    });
    setSel(null);
    setValidMoves([]);
    setLastMove(null);
    setStatus("playing");
    setThinking(false);
    setMoves([]);
    setPromo(null);
  }

  const kingPos = findKing(state.board, state.turn);

  return (
    <div className="game-page-wrap" id="chess-game">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>♛ Chess</h2>
        <p>You play White. Click a piece, then its destination.</p>
      </div>
      <div className="chess-wrap">
        <div className="chess-board-wrap" style={{ position: "relative" }}>
          <div id="chessBoard">
            {state.board.map((row, r) =>
              row.map((p, f) => {
                const isLight = (r + f) % 2 === 0;
                const selected = sel && sel[0] === r && sel[1] === f;
                const isValid = validMoves.some(([vr, vf]) => vr === r && vf === f);
                const isCapture = isValid && p && color(p) !== state.turn;
                const isLast =
                  lastMove &&
                  ((lastMove[0] === r && lastMove[1] === f) || (lastMove[2] === r && lastMove[3] === f));
                const inCheck =
                  kingPos && kingPos[0] === r && kingPos[1] === f && isInCheck(state.board, state.turn);
                let cls = `chess-sq ${isLight ? "light" : "dark"}`;
                if (selected) cls += " selected";
                if (isValid && !isCapture) cls += " valid-move";
                if (isCapture) cls += " valid-capture";
                if (isLast) cls += " last-move";
                if (inCheck) cls += " in-check";
                return (
                  <div key={`${r}-${f}`} className={cls} onClick={() => onClick(r, f)}>
                    {p ? PIECES[p] : ""}
                  </div>
                );
              })
            )}
          </div>
          {promo && (
            <div className="promo-modal open">
              <div className="promo-pieces">
                {(["Q", "R", "B", "N"] as const).map((pc) => (
                  <div
                    key={pc}
                    className="promo-piece"
                    onClick={() => {
                      doMove(promo.fr, promo.ff, promo.tr, promo.tf, pc);
                      setPromo(null);
                    }}
                  >
                    {PIECES[pc]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="chess-sidebar">
          <h3>♟ Game Info</h3>
          <div className="chess-status">
            {status === "checkmate" ? (
              <strong style={{ color: "#f0c040" }}>
                Checkmate! {opp(state.turn) === "w" ? "White" : "Black"} wins
              </strong>
            ) : status === "stalemate" ? (
              <strong>Stalemate! Draw</strong>
            ) : status === "check" ? (
              <>
                <strong style={{ color: "#ef4444" }}>Check!</strong>
                <br />
                {state.turn === "w" ? "Your" : "AI's"} turn
              </>
            ) : thinking ? (
              <strong style={{ color: "#3dba6f" }}>AI thinking…</strong>
            ) : (
              <>
                <strong>{state.turn === "w" ? "Your turn" : "AI's turn"}</strong>
                <br />
                {state.turn === "w" ? "White" : "Black"} to move
              </>
            )}
          </div>
          <div className="chess-moves">
            {moves.length === 0 ? (
              <p style={{ opacity: 0.5, fontSize: ".7rem" }}>Moves will appear here…</p>
            ) : (
              moves.map((m, i) => <p key={i}>{m}</p>)
            )}
          </div>
          <button className="chess-new-btn" onClick={newGame}>
            New Game ↺
          </button>
        </div>
      </div>
    </div>
  );
}
