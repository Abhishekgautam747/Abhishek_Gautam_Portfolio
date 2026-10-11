"use client";

import Link from "next/link";
import { useState } from "react";
import { showToast } from "./Providers";

export function Header() {
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const current =
      document.body.getAttribute("data-theme") !== "light" ? "light" : "dark";
    document.body.setAttribute("data-theme", current);
    document.documentElement.setAttribute("data-theme", current);
    localStorage.setItem("theme", current);
    showToast(current === "dark" ? "🌙 Dark mode" : "☀️ Light mode");
  };

  const close = () => setOpen(false);

  return (
    <header>
      <div className="container">
        <nav className="nav-flex">
          <Link href="/" className="brand" onClick={close}>
            Abhishek<span>.</span>
          </Link>

          <ul className={`nav-links ${open ? "open" : ""}`} id="navLinks">
            <li>
              <Link href="/" onClick={close}>
                Home
              </Link>
            </li>
            <li>
              <a href="#">About Me ▾</a>
              <div className="dropdown">
                <Link href="/introduction" onClick={close}>
                  Introduction
                </Link>
                <Link href="/my-journey" onClick={close}>
                  My Journey
                </Link>
                <Link href="/achievements" onClick={close}>
                  Achievements
                </Link>
              </div>
            </li>
            <li>
              <a href="#">Games ▾</a>
              <div className="dropdown">
                <Link href="/games" onClick={close}>
                  🎮 All Games
                </Link>
                <Link href="/games/game-theory" onClick={close}>
                  ♟ Game Theory
                </Link>
                <Link href="/games/hill-climb" onClick={close}>
                  🚗 Hill Climb Racing
                </Link>
                <Link href="/games/chess" onClick={close}>
                  ♛ Chess
                </Link>
                <Link href="/games/pacman" onClick={close}>
                  👻 Pac-Man
                </Link>
                <Link href="/games/drum-kit" onClick={close}>
                  🥁 Drum Kit
                </Link>
              </div>
            </li>
            <li>
              <Link href="/blogs" onClick={close}>
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/stopwatch" onClick={close}>
                Stopwatch
              </Link>
            </li>
            <li>
              <button className="theme-btn" onClick={toggleTheme}>
                ☀️
              </button>
            </li>
            <li>
              <Link
                href="/join-journey"
                className="btn-pulse"
                onClick={close}
              >
                Join the Journey →
              </Link>
            </li>
          </ul>

          <button
            className="hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </div>
    </header>
  );
}
