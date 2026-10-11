"use client";

import { useState } from "react";
import { ARTICLES } from "@/lib/articles";

export default function BlogsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const article = openId ? ARTICLES[openId] : null;

  return (
    <>
      <section style={{ padding: "5rem 0 6rem" }}>
        <div className="container">
          <div className="section-header reveal">
            <div className="section-eyebrow">Perspectives</div>
            <h2 className="section-title">Financial & Economic Insights</h2>
            <p className="section-sub">
              Deep dives into economics, geopolitics, and forces reshaping
              global finance.
            </p>
          </div>

          <div className="blog-grid">
            {Object.entries(ARTICLES).map(([id, art], i) => (
              <div
                key={id}
                className="blog-card reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={() => setOpenId(id)}
              >
                <div
                  className="blog-cover"
                  style={{
                    background:
                      art.category === "economics"
                        ? "linear-gradient(135deg,#1a3a2a,#0d1f15)"
                        : art.category === "geopolitics"
                        ? "linear-gradient(135deg,#3a1a1a,#1f0d0d)"
                        : art.category === "finance"
                        ? "linear-gradient(135deg,#1a2a3a,#0d1520)"
                        : art.category === "crisis"
                        ? "linear-gradient(135deg,#2a1a0a,#150d05)"
                        : art.category === "bonds"
                        ? "linear-gradient(135deg,#0a1a2a,#051015)"
                        : "linear-gradient(135deg,#1a0a2a,#0d0515)",
                  }}
                >
                  <div style={{ fontSize: "3.5rem" }}>{art.cover}</div>
                  <div className="blog-cover-overlay" />
                  <span className={`blog-cat ${art.category}`}>
                    {art.category}
                  </span>
                </div>
                <div className="blog-body">
                  <h3>{art.title}</h3>
                  <p>{art.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-read-time">{art.readTime}</span>
                    <div className="blog-arrow">→</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {article && (
        <div
          className="modal-overlay open"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenId(null);
          }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <span className="modal-cat">{article.cat}</span>
              <h2 className="modal-title">{article.title}</h2>
              <div className="modal-meta">
                {article.meta.map((m) => (
                  <span key={m} className="modal-meta-chip">
                    {m}
                  </span>
                ))}
              </div>
              <button className="modal-close" onClick={() => setOpenId(null)}>
                ✕
              </button>
            </div>
            <div
              className="modal-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      )}
    </>
  );
}
