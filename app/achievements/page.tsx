export default function AchievementsPage() {
  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">Recognition</div>
          <h2 className="section-title">Achievements</h2>
          <p className="section-sub">
            Honours that mark milestones on the journey.
          </p>
        </div>
        <div className="ach-grid">
          <div className="ach-card reveal">
            <img
              className="ach-img"
              src="https://iili.io/f4wKNqX.jpg"
              alt="Best Student 2023"
              loading="lazy"
            />
            <div className="ach-body">
              <h3>The Best Student of the Year – 2023</h3>
              <p>Global College of Management</p>
              <span className="badge g" style={{ marginTop: ".65rem" }}>
                🏅 Best Student
              </span>
            </div>
          </div>
          <div className="ach-card reveal" style={{ transitionDelay: ".14s" }}>
            <img
              className="ach-img"
              src="https://iili.io/f4wKhXI.jpg"
              alt="Silver Medal"
              loading="lazy"
            />
            <div className="ach-body">
              <h3>Silver Medal – National Business Case Analysis</h3>
              <p>National Economics Olympiad</p>
              <span className="badge am" style={{ marginTop: ".65rem" }}>
                🥈 Silver Medal
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
