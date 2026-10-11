import Link from "next/link";

export default function GameTheoryPage() {
  return (
    <div className="gt-hero">
      <div className="gt-bg" />
      <div className="gt-grid" />
      <div className="gt-inner">
        <Link href="/games" className="game-back-btn">
          ← Back to Arcade
        </Link>
        <div
          className="section-eyebrow gr"
          style={{ display: "inline-block", marginBottom: "1rem" }}
        >
          Interactive Experience
        </div>
        <h1>STRATAGEM — Game Theory</h1>
        <p>
          Launch an interactive game-theory trainer taking you from everyday
          dilemmas to high-stakes geopolitical strategy.
        </p>
        <a
          href="https://your-game-theory-url.com"
          target="_blank"
          rel="noopener noreferrer"
          className="launch-btn"
        >
          ▶ Launch Game Theory
        </a>
        <p style={{ marginTop: "1rem", fontSize: ".87rem", color: "var(--muted)" }}>
          Opens in a new tab. (Replace the href with your actual game-theory.html
          if you host it separately.)
        </p>
      </div>
    </div>
  );
}
