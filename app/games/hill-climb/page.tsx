import Link from "next/link";

export default function HillClimbPage() {
  return (
    <div className="game-page-wrap" id="hill-climb">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>🚗 Hill Climb Racing</h2>
        <p>
          The full canvas physics game from the original HTML can be ported here
          as a client component. For now this is a placeholder.
        </p>
        <p style={{ marginTop: "1.5rem", color: "var(--muted)" }}>
          Copy the original <code>initHillClimb</code> script into a{" "}
          <code>&apos;use client&apos;</code> component that uses a{" "}
          <code>useRef</code> for the canvas.
        </p>
      </div>
    </div>
  );
}
