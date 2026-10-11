export default function IntroductionPage() {
  return (
    <section style={{ padding: "6rem 0 5rem" }}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">Who I Am</div>
          <h2 className="section-title">Introduction</h2>
        </div>
        <div className="intro-card reveal">
          <h1>Hey there! I&apos;m Abhishek Gautam</h1>
          <p>
            A fresh face in the world of accounting and finance from Kathmandu,
            Nepal. I recently topped the charts with All Nepal Rank-1 in CAP II
            back in December 2024—pretty cool milestone to kick things off.
          </p>
          <p>
            If you&apos;d like to connect, drop me a line or find me on LinkedIn.
            Looking forward to chatting about finance, events, or just life in
            Kathmandu!
          </p>
          <div className="contact-chips">
            <a className="chip" href="mailto:abhishekgau1am@gmail.com">
              ✉️ abhishekgau1am@gmail.com
            </a>
            <a
              className="chip"
              href="https://linkedin.com/in/abhishek8848"
              target="_blank"
              rel="noopener noreferrer"
            >
              in linkedin.com/in/abhishek8848
            </a>
            <span className="chip">📍 Kathmandu, Nepal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
