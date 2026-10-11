import Link from "next/link";

export default function DrumKitPage() {
  return (
    <div className="game-page-wrap" id="drum-kit">
      <Link href="/games" className="game-back-btn">
        ← Back
      </Link>
      <div className="game-hdr">
        <h2>🥁 Drum Kit</h2>
        <p>
          Web Audio drum pads (Kick, Snare, Hi-Hat, etc.) are in the original
          HTML. Port the AudioContext logic into a client component.
        </p>
      </div>
    </div>
  );
}
