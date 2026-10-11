import Link from "next/link";

const games = [
  {
    href: "/games/game-theory",
    icon: "♟",
    title: "Game Theory",
    desc: "Strategic decision-making from everyday dilemmas to geopolitical standoffs.",
    tag: "Strategy",
    color: "green",
    glow: "rgba(61,186,111,.05)",
    border: "rgba(61,186,111,.3)",
  },
  {
    href: "/games/hill-climb",
    icon: "🚗",
    title: "Hill Climb Racing",
    desc: "Drive your car over procedurally generated hills. Collect coins, manage fuel, don't flip!",
    tag: "Physics",
    color: "amber",
    glow: "rgba(249,115,22,.05)",
    border: "rgba(249,115,22,.3)",
  },
  {
    href: "/games/chess",
    icon: "♛",
    title: "Chess",
    desc: "Classic chess against an AI. Full rules including castling, en passant & promotion.",
    tag: "Board Game",
    color: "gold",
    glow: "rgba(240,192,64,.05)",
    border: "rgba(240,192,64,.3)",
  },
  {
    href: "/games/pacman",
    icon: "👻",
    title: "Pac-Man",
    desc: "The classic arcade legend. Eat dots, dodge ghosts, grab power pellets for revenge!",
    tag: "Arcade",
    color: "red",
    glow: "rgba(239,68,68,.05)",
    border: "rgba(239,68,68,.3)",
  },
  {
    href: "/games/drum-kit",
    icon: "🥁",
    title: "Drum Kit",
    desc: "Play a full drum kit with your keyboard. 9 pads, synthesized sounds, feel the beat!",
    tag: "Music",
    color: "purple",
    glow: "rgba(139,92,246,.05)",
    border: "rgba(139,92,246,.3)",
  },
];

export default function GamesHubPage() {
  return (
    <section style={{ padding: "5rem 0 6rem" }}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow gr">Play</div>
          <h2 className="section-title">Game Arcade</h2>
          <p className="section-sub">
            A collection of games to keep your mind sharp — from strategy to
            rhythm.
          </p>
        </div>
        <div className="games-grid">
          {games.map((g, i) => (
            <div
              key={g.href}
              className="game-card reveal"
              style={
                {
                  "--glow": g.glow,
                  "--glow-border": g.border,
                  transitionDelay: `${i * 0.08}s`,
                } as React.CSSProperties
              }
            >
              <span
                className="game-icon"
                style={
                  {
                    "--icon-shadow": g.border,
                  } as React.CSSProperties
                }
              >
                {g.icon}
              </span>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
              <span
                className="game-tag"
                style={{
                  background:
                    g.color === "green"
                      ? "rgba(61,186,111,.12)"
                      : g.color === "amber"
                      ? "rgba(249,115,22,.12)"
                      : g.color === "red"
                      ? "rgba(239,68,68,.12)"
                      : g.color === "purple"
                      ? "rgba(139,92,246,.12)"
                      : "rgba(240,192,64,.12)",
                  color:
                    g.color === "green"
                      ? "var(--green)"
                      : g.color === "amber"
                      ? "var(--amber)"
                      : g.color === "red"
                      ? "#f87171"
                      : g.color === "purple"
                      ? "#a78bfa"
                      : "var(--gold)",
                  border: `1px solid ${g.border}`,
                }}
              >
                {g.tag}
              </span>
              <br />
              <Link
                href={g.href}
                className={`game-play-btn ${
                  g.color === "green"
                    ? "green-btn"
                    : g.color === "amber"
                    ? "amber-btn"
                    : g.color === "red"
                    ? "red-btn"
                    : g.color === "purple"
                    ? "purple-btn"
                    : ""
                }`}
              >
                ▶ Play Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
