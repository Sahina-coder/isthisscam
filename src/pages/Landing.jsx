import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Aurora from "../Aurora";

const STATS = [
  { num: "₹11,000Cr+", label: "Lost to cyber fraud in India (2023)" },
  { num: "7 Lakh+",     label: "Cybercrime complaints filed" },
  { num: "1 in 3",      label: "Indians targeted by online scams" },
];

const FEATURES = [
  { icon: "🔗", title: "URL Phishing Detection",    desc: "Checks domain age, SSL, TLD, brand impersonation, and Google Safe Browsing in real time." },
  { icon: "🧠", title: "AI Text Analysis",           desc: "Groq + Llama 3.1 scans for urgency, advance fees, impersonation, and pressure tactics." },
  { icon: "💳", title: "UPI & Phone Fraud Check",   desc: "Detects fake UPI handles and cross-references fraud numbers via TRAI Sanchar Saathi." },
  { icon: "📸", title: "Screenshot OCR",             desc: "Upload a suspicious screenshot — we extract and analyze the text automatically." },
  { icon: "🌐", title: "3-Language Explanation",    desc: "Results explained in English, Hindi, and Bengali so everyone can understand." },
  { icon: "🏛️", title: "Official DB Cross-Check",  desc: "Cross-references MHA Cybercrime, CERT-In, PIB Fact Check, and RBI alert databases." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Paste anything",      desc: "URL, UPI ID, phone number, job offer, WhatsApp message — any suspicious content." },
  { step: "02", title: "AI + DB analysis",    desc: "We run 5 parallel checks: scam DB, domain RDAP, AI NLP, phone check, GSB." },
  { step: "03", title: "Get your score",      desc: "Scam probability 0-100% with signals, explanation in your language, and next steps." },
];

export default function Landing({ theme }) {
  const primary = theme?.primary || "#4361ee";
  const aurora  = theme?.aurora  || ["#4361ee", "#3a86ff", "#7209b7"];

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        .feat-card:hover { border-color: ${primary}55 !important; background: ${primary}09 !important; transform: translateY(-3px); }
        .feat-card { transition: all 0.3s ease !important; }
        .stat-item { animation: fadeUp 0.6s ease both; }
      `}</style>

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.auroraWrap}>
          <Aurora colorStops={aurora} amplitude={1.0} blend={0.55} speed={0.35} />
        </div>
        <div style={{ ...s.heroInner, animation: "fadeUp 0.7s ease" }}>
          <div style={{ ...s.pill, background: `${primary}18`, border: `1px solid ${primary}44`, color: primary }}>
            🇮🇳 India's #1 Scam Detector · Free · No Login
          </div>
          <h1 style={s.heroTitle}>
            Don't Get Fooled.<br />
            <em style={{ color: primary, fontStyle: "italic" }}>Verify Before You Trust.</em>
          </h1>
          <p style={s.heroDesc}>
            Indians lose <strong style={{ color: primary }}>₹11,000 crore</strong> every year to online scams.
            Paste any URL, UPI, message, or screenshot — get a scam probability score in seconds.
          </p>
          <div style={s.heroBtns}>
            <Link to="/scan" style={{ textDecoration: "none" }}>
              <button style={{ ...s.primaryBtn, background: `linear-gradient(135deg, ${primary}, ${theme?.accent || "#3a86ff"})`, boxShadow: `0 8px 32px ${primary}44` }}>
                🔍 Scan Something Now →
              </button>
            </Link>
            <Link to="/about" style={{ textDecoration: "none" }}>
              <button style={s.ghostBtn}>Learn How It Works</button>
            </Link>
          </div>

          {/* Stats */}
          <div style={s.statsRow}>
            {STATS.map((st, i) => (
              <div key={i} className="stat-item" style={{ ...s.statItem, animationDelay: `${i * 0.15}s` }}>
                <div style={{ ...s.statNum, color: primary }}>{st.num}</div>
                <div style={s.statLbl}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <div style={{ ...s.sectionPill, color: primary, border: `1px solid ${primary}33`, background: `${primary}11` }}>How It Works</div>
          <h2 style={s.sectionTitle}>Three Steps to Safety</h2>
          <div style={s.stepsRow}>
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} style={s.stepCard}>
                <div style={{ ...s.stepNum, color: primary, borderColor: `${primary}33` }}>{h.step}</div>
                <h3 style={s.stepTitle}>{h.title}</h3>
                <p style={s.stepDesc}>{h.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && <div style={{ ...s.stepArrow, color: primary }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ ...s.section, background: "rgba(255,255,255,0.01)" }}>
        <div style={s.sectionInner}>
          <div style={{ ...s.sectionPill, color: primary, border: `1px solid ${primary}33`, background: `${primary}11` }}>Features</div>
          <h2 style={s.sectionTitle}>Everything We Check</h2>
          <div style={s.featGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card" style={s.featCard}>
                <div style={{ ...s.featIcon, background: `${primary}18`, border: `1px solid ${primary}33` }}>{f.icon}</div>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCAM CATEGORIES ── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <div style={{ ...s.sectionPill, color: primary, border: `1px solid ${primary}33`, background: `${primary}11` }}>Coverage</div>
          <h2 style={s.sectionTitle}>Scams We Detect</h2>
          <div style={s.scamGrid}>
            {["KBC / Lottery Scams","Fake Banking Sites","Job & WFH Scams","UPI Collect Fraud","OLX / Meesho Scams","Fake Loan Apps","Aadhaar / PAN Scams","Investment Scams","Fake Govt Schemes","Romance / Pig Butchering" , "Many more"].map((sc, i) => (
              <div key={i} style={{ ...s.scamTag, borderColor: `${primary}33`, color: "#aaaacc" }}>
                <span style={{ color: primary }}>✓</span> {sc}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ ...s.section, textAlign: "center", padding: "80px 20px" }}>
        <div style={s.ctaWrap}>
          <div style={s.ctaAurora}>
            <Aurora colorStops={aurora} amplitude={0.6} blend={0.5} speed={0.3} />
          </div>
          <h2 style={{ ...s.ctaTitle, position: "relative", zIndex: 2 }}>
            Protect Yourself.<br />
            <em style={{ color: primary }}>Protect Your Family.</em>
          </h2>
          <p style={{ color: "#6666aa", fontSize: 14, margin: "12px 0 28px", position: "relative", zIndex: 2 }}>
            Free forever. No account needed. Works in English, Hindi, and Bengali.
          </p>
          <Link to="/scan" style={{ textDecoration: "none", position: "relative", zIndex: 2 }}>
            <button style={{ ...s.primaryBtn, fontSize: 16, padding: "16px 36px", background: `linear-gradient(135deg, ${primary}, ${theme?.accent || "#3a86ff"})`, boxShadow: `0 8px 40px ${primary}55` }}>
              🛡️ Start Scanning for Free
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerBrand}>
            🛡️ <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: primary }}>Is This Scam?</span>
          </div>
          <div style={s.footerLinks}>
            <Link to="/"      style={s.footerLink}>Home</Link>
            <Link to="/scan"  style={s.footerLink}>Scanner</Link>
            <Link to="/about" style={s.footerLink}>About</Link>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" style={s.footerLink}>Report Cybercrime</a>
          </div>
          <p style={s.footerCopy}>
            Powered by Groq + Llama 3.1 · CERT-In · MHA Cybercrime · Sanchar Saathi<br/>
            Made with ❤️ for Bharat by Sahina &amp; Madhumita
          </p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page: { background: "#050510", minHeight: "100vh", color: "#e0e0f0", fontFamily: "'Space Grotesk', sans-serif" },

  // Hero
  hero: { position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" },
  auroraWrap: { position: "absolute", inset: 0, opacity: 0.45, pointerEvents: "none" },
  heroInner: { maxWidth: 780, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center", position: "relative", zIndex: 2 },
  pill: { display: "inline-block", fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 20, marginBottom: 20, letterSpacing: "0.3px" },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 700,
    color: "#fff", lineHeight: 1.1, margin: "0 0 20px",
  },
  heroDesc: { fontSize: 16, color: "#8888bb", lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 560 },
  heroBtns: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 },
  primaryBtn: {
    padding: "14px 28px", borderRadius: 12, border: "none",
    color: "#fff", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  ghostBtn: {
    padding: "14px 24px", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent", color: "#8888aa",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  // Stats
  statsRow: { display: "flex", gap: 0, justifyContent: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, flexWrap: "wrap" },
  statItem: { padding: "0 28px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.06)" },
  statNum:  { fontSize: 22, fontWeight: 800, fontFamily: "'Cormorant Garamond', serif" },
  statLbl:  { fontSize: 11, color: "#5555aa", marginTop: 4 },

  // Sections
  section: { padding: "80px 24px" },
  sectionInner: { maxWidth: 1000, margin: "0 auto" },
  sectionPill: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 14, letterSpacing: "0.5px" },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fff", margin: "0 0 40px", lineHeight: 1.2 },

  // Steps
  stepsRow: { display: "flex", gap: 0, flexWrap: "wrap", position: "relative" },
  stepCard: { flex: 1, minWidth: 220, padding: "0 28px 0 0", position: "relative" },
  stepNum:  { fontSize: 36, fontWeight: 900, fontFamily: "'Cormorant Garamond', serif", border: "1px solid", display: "inline-block", width: 56, height: 56, borderRadius: "50%", lineHeight: "54px", textAlign: "center", marginBottom: 16, fontSize: 20 },
  stepTitle: { fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px" },
  stepDesc:  { fontSize: 13, color: "#7777aa", lineHeight: 1.6 },
  stepArrow: { position: "absolute", right: 0, top: 14, fontSize: 20, opacity: 0.4 },

  // Features
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  featCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "22px",
    cursor: "default",
  },
  featIcon:  { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 },
  featTitle: { fontSize: 14, fontWeight: 700, color: "#ddddf0", margin: "0 0 8px" },
  featDesc:  { fontSize: 12, color: "#7777aa", lineHeight: 1.6 },

  // Scam tags
  scamGrid: { display: "flex", flexWrap: "wrap", gap: 10 },
  scamTag: { padding: "8px 16px", borderRadius: 20, border: "1px solid", fontSize: 13, display: "flex", gap: 8, alignItems: "center" },

  // CTA
  ctaWrap: { maxWidth: 640, margin: "0 auto", position: "relative", padding: "60px 24px", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" },
  ctaAurora: { position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" },
  ctaTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 },

  // Footer
  footer: { borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 24px" },
  footerInner: { maxWidth: 1000, margin: "0 auto", textAlign: "center" },
  footerBrand: { fontSize: 16, marginBottom: 20 },
  footerLinks: { display: "flex", gap: 24, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" },
  footerLink: { color: "#6666aa", textDecoration: "none", fontSize: 13, fontWeight: 600 },
  footerCopy: { color: "#333355", fontSize: 11, lineHeight: 1.8 },
};