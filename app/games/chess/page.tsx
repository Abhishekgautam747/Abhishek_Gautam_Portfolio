import Link from "next/link";

export default function ChessPage() {
  return (
    <div className="game-page-wrap" id="chess-game">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>♛ Chess</h2>
        <p>
          Full chess engine (minimax AI, castling, en passant, promotion) is in
          the original HTML. Port it into a client component when ready.
        </p>
      </div>
    </div>
  );
}
