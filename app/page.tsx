"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // build stars
    const c = document.getElementById("heroStars");
    if (!c || c.children.length > 0) return;
    for (let i = 0; i < 90; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const sz = Math.random() * 2.3 + 0.4;
      const col =
        Math.random() > 0.65
          ? `rgba(240,192,64,${0.4 + Math.random() * 0.6})`
          : `rgba(250,243,224,${0.3 + Math.random() * 0.7})`;
      s.style.cssText = `width:${sz}px;height:${sz}px;background:${col};top:${Math.random() * 82}%;left:${Math.random() * 100}%;--d:${3 + Math.random() * 6}s;--del:${Math.random() * 5}s;--lo:${0.05 + Math.random() * 0.12};--hi:${0.5 + Math.random() * 0.5}`;
      c.appendChild(s);
    }
  }, []);

  return (
    <div id="home" style={{ position: "relative", overflow: "hidden" }}>
      <div className="hero-bg" />
      <div className="hero-orb" />
      <div className="hero-orb2" />
      <div className="hero-stars" id="heroStars" />
      <div className="hero-mountains">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mg1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgba(240,192,64,0.1)" }} />
              <stop
                offset="100%"
                style={{ stopColor: "rgba(9,8,10,0.65)" }}
              />
            </linearGradient>
            <linearGradient id="mg2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgba(61,186,111,0.08)" }} />
              <stop
                offset="100%"
                style={{ stopColor: "rgba(9,8,10,0.85)" }}
              />
            </linearGradient>
          </defs>
          <polygon
            points="0,320 160,100 280,165 400,70 540,145 680,35 820,125 960,55 1100,135 1240,75 1380,115 1440,90 1440,320"
            fill="url(#mg1)"
          />
          <polygon
            points="0,320 100,210 240,160 360,190 480,115 610,170 740,95 870,158 1000,105 1130,175 1260,125 1380,165 1440,140 1440,320"
            fill="url(#mg2)"
          />
          <polygon
            points="400,70 435,95 450,78 468,91 500,72 540,145 400,70"
            fill="rgba(250,243,224,0.18)"
          />
          <polygon
            points="680,35 718,58 736,42 756,55 790,38 820,125 680,35"
            fill="rgba(250,243,224,0.22)"
          />
        </svg>
      </div>

      <div className="hero-inner container">
        <div className="hero-eyebrow">
          <span className="dot" />
          All Nepal Rank 1 · CAP II · December 2024
        </div>
        <h1 className="hero-h1">
          Financial Innovation
          <br />
          inspired by mountain stillness.
        </h1>
        <p className="hero-tagline">
          I explore the intersection of rigorous financial strategy and
          community stewardship from Kathmandu.
        </p>
        <blockquote className="hero-quote">
          &ldquo;I believe mastery is not a destination, but a tool used to give
          back to the valley that raised me…&rdquo;
        </blockquote>
        <div className="hero-ctas">
          <Link href="/my-journey" className="btn-shimmer">
            Continue reading my journey
          </Link>
          <Link href="/join-journey" className="btn-glow">
            Join the Journey →
          </Link>
          <Link href="/games" className="btn-neon">
            🎮 Play Games
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num g">#1</div>
            <div className="stat-lbl">
              All Nepal Rank
              <br />
              CAP II
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-num gr">3+</div>
            <div className="stat-lbl">
              Years Community
              <br />
              Service
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-num am">2</div>
            <div className="stat-lbl">
              National
              <br />
              Honours
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-num g">4.0</div>
            <div className="stat-lbl">
              SEE GPA
              <br />
              Excellence
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-cue">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </div>
  );
}
