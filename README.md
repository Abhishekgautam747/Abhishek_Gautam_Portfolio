# Abhishek Gautam — Portfolio (Next.js)

This is the **Next.js conversion** of your original single-file HTML portfolio.

It uses:
- **Next.js 14** (App Router)
- **Static Export** (`output: 'export'`) so it works on **GitHub Pages**
- Client components for interactive parts (theme, blogs modal, contact form, etc.)
- Same design, fonts, and content as your original HTML

---

## Project Structure

```
abhishek-portfolio/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Home / Hero
│   ├── globals.css         # All styles (from original)
│   ├── introduction/
│   ├── my-journey/
│   ├── achievements/
│   ├── blogs/
│   ├── games/
│   │   ├── page.tsx        # Arcade hub
│   │   └── game-theory/
│   ├── join-journey/
│   └── ...
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Providers.tsx
├── lib/
│   └── articles.ts         # Blog articles data
├── next.config.js          # Static export enabled
├── package.json
└── README.md
```

