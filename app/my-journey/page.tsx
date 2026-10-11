export default function MyJourneyPage() {
  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">My Story</div>
          <h2 className="section-title">My Journey</h2>
        </div>

        <div className="about-prose reveal">
          <h3
            style={{
              color: "var(--muted)",
              fontSize: "1.22rem",
              marginBottom: "1rem",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            A Bit About Me
          </h3>
          <p>
            I&apos;m currently diving into the practical side of things as an{" "}
            <strong>Article Trainee at SAR Associates</strong>, a firm of
            Chartered Accountants, since February 2025. Before that, I had a fun
            run as <strong>President of the GCM Social Club</strong> from 2022
            to 2023. We organized engaging events like chats on youth economy
            with MP Gagan Thapa and Economist Dr. YubaRaj Khatiwada, plus a
            session on socio-economic issues with Ex-Governor Dr. Chiranjibi
            Nepal. We also ran blood donations with the Nepal Red Cross Society
            and pitched in for the Bagmati Cleanliness Program.
          </p>
        </div>

        <div
          className="section-header reveal"
          style={{ marginTop: "4rem", marginBottom: "2.5rem" }}
        >
          <div className="section-eyebrow gr">Academic Path</div>
          <h2 className="section-title" style={{ color: "var(--gold)" }}>
            Education Journey
          </h2>
        </div>

        <div className="timeline">
          <div className="tl-line" />

          <div className="tl-item right reveal">
            <div className="tl-empty" />
            <div className="tl-dot" />
            <div className="tl-card">
              <h3>CAP II</h3>
              <p>
                <strong>Institute of Chartered Accountants of Nepal (ICAN)</strong>
              </p>
              <p>Passed, December 2024</p>
              <span className="badge g">🏆 All Nepal Rank 1</span>
            </div>
          </div>

          <div className="tl-item left reveal">
            <div className="tl-card">
              <h3>CAP I</h3>
              <p>
                <strong>Institute of Chartered Accountants of Nepal (ICAN)</strong>
              </p>
              <p>Passed with Distinction, December 2023</p>
              <span className="badge gr">✨ Distinction</span>
            </div>
            <div className="tl-dot" />
            <div className="tl-empty" />
          </div>

          <div className="tl-item right reveal">
            <div className="tl-empty" />
            <div className="tl-dot" />
            <div className="tl-card">
              <h3>BBS</h3>
              <p>
                <strong>Shanker Dev Campus, Tribhuvan University</strong>
              </p>
              <p>Currently pursuing (2024 onwards)</p>
              <span className="badge am">📚 Ongoing</span>
            </div>
          </div>

          <div className="tl-item left reveal">
            <div className="tl-card">
              <h3>XII (Higher Secondary)</h3>
              <p>
                <strong>Global College of Management</strong>
              </p>
              <p>GPA 3.84 · 2023</p>
            </div>
            <div className="tl-dot" />
            <div className="tl-empty" />
          </div>

          <div className="tl-item right reveal">
            <div className="tl-empty" />
            <div className="tl-dot" />
            <div className="tl-card">
              <h3>SEE</h3>
              <p>
                <strong>Awareness International Academy</strong>
              </p>
              <p>GPA 4.00 · 2022</p>
              <span className="badge g">⭐ Perfect GPA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
