import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-about">
          <div className="brand footer-brand">
            Abhishek<span>.</span>
          </div>
          <p>
            Chartered Accountancy student with expertise in audit, accounting,
            taxation, and finance.
          </p>
          <div className="socials">
            <a
              className="social-a"
              href="https://x.com/Chandra43104852"
              target="_blank"
              rel="noopener noreferrer"
            >
              𝕏
            </a>
            <a
              className="social-a"
              href="https://www.linkedin.com/in/abhishek8848/"
              target="_blank"
              rel="noopener noreferrer"
            >
              in
            </a>
            <a
              className="social-a"
              href="https://www.facebook.com/chandramani.gautam.545"
              target="_blank"
              rel="noopener noreferrer"
            >
              f
            </a>
            <a
              className="social-a"
              href="https://www.instagram.com/imabhiiii_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              📷
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/introduction">Introduction</Link>
            </li>
            <li>
              <Link href="/my-journey">My Journey</Link>
            </li>
            <li>
              <Link href="/games">Game Arcade</Link>
            </li>
            <li>
              <Link href="/blogs">Blogs</Link>
            </li>
            <li>
              <Link href="/join-journey">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Info</h4>
          <p>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            abhishekgau1am@gmail.com
          </p>
          <p>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Buddhanagar-10, Kathmandu, Nepal
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Abhishek Gautam. All rights reserved.</p>
      </div>
    </footer>
  );
}
