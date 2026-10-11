"use client";

import { useState } from "react";

export default function JoinJourneyPage() {
  const [toast, setToast] = useState<{ type: string; msg: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const name = (document.getElementById("f-name") as HTMLInputElement)
      ?.value.trim();
    const email = (document.getElementById("f-email") as HTMLInputElement)
      ?.value.trim();
    const message = (document.getElementById("f-msg") as HTMLTextAreaElement)
      ?.value.trim();

    if (!name || !email || !message) {
      setToast({ type: "error", msg: "⚠️ Please fill all fields." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({ type: "error", msg: "⚠️ Invalid email address." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/abhishekgau1am@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `[Portfolio] Message from ${name}`,
            _captcha: "false",
          }),
        }
      );
      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setToast({
          type: "success",
          msg: `✅ Thanks, ${name}! Message sent.`,
        });
        (document.getElementById("f-name") as HTMLInputElement).value = "";
        (document.getElementById("f-email") as HTMLInputElement).value = "";
        (document.getElementById("f-msg") as HTMLTextAreaElement).value = "";
      } else throw new Error();
    } catch {
      setToast({
        type: "error",
        msg: "❌ Failed. Email directly: abhishekgau1am@gmail.com",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: "5rem 0 6rem" }}>
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">Stay Connected</div>
          <h2 className="section-title">Join the Journey</h2>
          <p className="section-sub">
            Leave your name, email, and a message — I&apos;d love to hear from
            you.
          </p>
        </div>
        <div className="form-wrapper reveal">
          <h2 className="fw-title">Let&apos;s connect</h2>
          <p className="form-sub">
            Whether it&apos;s finance, events, or just life in Kathmandu — I&apos;m
            all ears. Your message will reach me at{" "}
            <strong style={{ color: "var(--gold)" }}>
              abhishekgau1am@gmail.com
            </strong>
            .
          </p>
          <div className="form-group">
            <label htmlFor="f-name">Your Name</label>
            <input
              type="text"
              id="f-name"
              placeholder="e.g. Priya Shrestha"
            />
          </div>
          <div className="form-group">
            <label htmlFor="f-email">Email Address</label>
            <input type="email" id="f-email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="f-msg">Message</label>
            <textarea
              id="f-msg"
              placeholder="Hi Abhishek, I wanted to say…"
            />
          </div>
          <button
            className="submit-btn"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "Sending…" : "Send Message ✉️"}
          </button>
          {toast && (
            <div className={`form-toast ${toast.type}`}>{toast.msg}</div>
          )}
        </div>
      </div>
    </section>
  );
}
