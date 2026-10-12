"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function setupReveal() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  if (!els.length) return;

  // Fallback: if IntersectionObserver isn't reliable, show after short delay
  const fallback = window.setTimeout(() => {
    els.forEach((el) => el.classList.add("visible"));
  }, 400);

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => obs.observe(el));

  return () => {
    window.clearTimeout(fallback);
    obs.disconnect();
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", saved);
    document.documentElement.setAttribute("data-theme", saved);

    const onScroll = () => {
      const el = document.getElementById("scroll-progress");
      if (!el) return;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      el.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Re-run reveal every time the route changes
  useEffect(() => {
    // small delay so new page DOM is painted
    const t = window.setTimeout(() => {
      setupReveal();
    }, 50);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return <>{children}</>;
}

export function showToast(msg: string) {
  const t = document.getElementById("toast-notif");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout((t as any)._tm);
  (t as any)._tm = setTimeout(() => t.classList.remove("show"), 2600);
}
