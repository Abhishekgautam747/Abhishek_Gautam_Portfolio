import Link from "next/link";

export default function PacmanPage() {
  return (
    <div className="game-page-wrap" id="pacman-game">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>👻 Pac-Man</h2>
        <p>
          Classic Pac-Man with ghosts and power pellets lives in the original
          HTML scripts. Move the canvas logic into a client component here.
        </p>
      </div>
    </div>
  );
}
