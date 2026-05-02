import { Link } from "react-router-dom";
import Aurora from "../Aurora";

const TEAM = [
  { name: "Sahina",    role: "Co-founder", emoji: "👩‍💻" },
  { name: "Madhumita", role: "Co-founder",    emoji: "👩‍🔬" },
];

const SOURCES = [
  { name: "MHA Cybercrime Portal", url: "https://cybercrime.gov.in",        desc: "National cyber fraud reporting database" },
  { name: "CERT-In",               url: "https://cert-in.org.in",            desc: "Government of India cybersecurity alerts" },
  { name: "PIB Fact Check",        url: "https://factcheck.pib.gov.in",      desc: "Official fake scheme URL database" },
  { name: "RBI Alerts",            url: "https://rbi.org.in",                desc: "Fake banking site & loan app warnings" },
  { name: "OpenPhish",             url: "https://openphish.com",             desc: "Community phishing URL feed (12hr refresh)" },
  { name: "Sanchar Saathi (TRAI)", url: "https://sancharsaathi.gov.in",      desc: "Official telecom fraud number database" },
  { name: "Google Safe Browsing",  url: "https://safebrowsing.google.com",   desc: "Known malware & phishing domain list" },
  { name: "RDAP Protocol",         url: "https://rdap.org",                   desc: "Free domain age & registrar lookup" },
];

export default function About({ theme }) {
  const primary = theme?.primary || "#4361ee";
  const aurora  = theme?.aurora  || ["#4361ee", "#3a86ff", "#7209b7"];

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .source-card:hover { border-color: ${primary}55 !important; background: ${primary}09 !important; }
        .source-card { transition: all 0.25s ease !important; }
      `}</style>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.auroraWrap}>
          <Aurora colorStops={aurora} amplitude={0.7} blend={0.5} speed={0.3} />
        </div>
        <div style={{ ...s.heroInner, animation: "fadeUp 0.6s ease" }}>
          <div style={{ ...s.pill, background: `${primary}18`, border: `1px solid ${primary}44`, color: primary }}>Our Mission</div>
          <h1 style={s.heroTitle}>
            Built to Protect<br />
            <em style={{ color: primary, fontStyle: "italic" }}>Every Indian Online.</em>
          </h1>
          <p style={s.heroDesc}>
            We are two students from Kolkata who got tired of watching our parents, relatives, and neighbours
            fall for online scams. So we built the tool we wished existed - free, fast, and in your language.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section style={s.section}>
        <div style={s.inner}>
          <div style={{ ...s.sectionPill, color: primary, border: `1px solid ${primary}33`, background: `${primary}11` }}>The Problem</div>
          <h2 style={s.sectionTitle}>India's Cybercrime Crisis</h2>
          <div style={s.problemGrid}>
            {[
              { num: "₹11,000Cr+", desc: "Lost to cyber fraud in India in 2023 alone" },
              { num: "7 Lakh+",    desc: "Complaints filed on cybercrime.gov.in" },
              { num: "1 in 3",     desc: "Indians have been targeted by an online scam" },
              { num: "68%",        desc: "Victims never got their money back" },
            ].map((p, i) => (
              <div key={i} style={{ ...s.problemCard, borderColor: `${primary}22` }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: primary, fontFamily: "'Cormorant Garamond', serif" }}>{p.num}</div>
                <div style={{ fontSize: 12, color: "#7777aa", marginTop: 6, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section style={{ ...s.section, background: "rgba(255,255,255,0.01)" }}>
        <div style={s.inner}>
          <div style={{ ...s.sectionPill, color: primary, border: `1px solid ${primary}33`, background: `${primary}11` }}>Technology</div>
          <h2 style={s.sectionTitle}>How We Detect Scams</h2>
          <p style={{ color: "#7777aa", fontSize: 14, lineHeight: 1.8, maxWidth: 640, marginBottom: 32 }}>
            We combine multiple detection methods simultaneously. No single method is enough -
            scammers are sophisticated. We run 5 checks in parallel for every submission:
          </p>
          {[
            { icon: "🧠", title: "Groq + Llama 3.1 AI",        desc: "The fastest free AI inference on the planet analyzes your text for 15+ specific Indian scam patterns. Runs on Groq's cloud — no cost, 1 second response time." },
            { icon: "🌐", title: "RDAP Domain Intelligence",    desc: "For any URL, we instantly check domain age, registrar, TLD, and whether it impersonates a known Indian brand like SBI, HDFC, Paytm, or IRCTC." },
            { icon: "🏛️", title: "Official Indian Databases",  desc: "We cross-reference submissions against MHA Cybercrime, CERT-In, PIB Fact Check, and RBI alert databases — all maintained by the Government of India." },
            { icon: "📞", title: "Sanchar Saathi Phone Check",  desc: "Phone numbers and UPI IDs are checked against TRAI's official telecom fraud database to catch known scammer numbers." },
            { icon: "🔒", title: "Google Safe Browsing",        desc: "Every URL is checked against Google's database of known malware and phishing sites — 10,000 free checks per day." },
          ].map((item, i) => (
            <div key={i} style={{ ...s.techRow, borderLeft: `3px solid ${primary}44` }}>
              <div style={{ ...s.techIcon, background: `${primary}18`, color: primary }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#ddddf0", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#7777aa", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section style={s.section}>
        <div style={s.inner}>
          <div style={{ ...s.sectionPill, color: primary, border: `1px solid ${primary}33`, background: `${primary}11` }}>Data Sources</div>
          <h2 style={s.sectionTitle}>Trusted Data Sources</h2>
          <div style={s.sourceGrid}>
            {SOURCES.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noreferrer" className="source-card" style={s.sourceCard}>
                <div style={{ fontSize: 13, fontWeight: 700, color: primary, marginBottom: 4 }}>{src.name} ↗</div>
                <div style={{ fontSize: 11, color: "#7777aa" }}>{src.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ ...s.section, background: "rgba(255,255,255,0.01)", textAlign: "center" }}>
        <div style={s.inner}>
          <div style={{ ...s.sectionPill, color: primary, border: `1px solid ${primary}33`, background: `${primary}11`, margin: "0 auto 14px" }}>The Team</div>
          <h2 style={{ ...s.sectionTitle, textAlign: "center" }}>Made in Kolkata 🇮🇳</h2>
          <div style={s.teamRow}>
            {TEAM.map((t, i) => (
              <div key={i} style={{ ...s.teamCard, borderColor: `${primary}22` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{t.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Cormorant Garamond', serif", marginBottom: 6 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: primary }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...s.section, textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#fff", fontWeight: 700, marginBottom: 12 }}>
          Think something's a scam?
        </h2>
        <p style={{ color: "#6666aa", fontSize: 14, marginBottom: 24 }}>Scan it in seconds. It's completely free.</p>
        <Link to="/scan" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "14px 32px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${primary}, ${theme?.accent || "#3a86ff"})`,
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: `0 6px 28px ${primary}44`,
          }}>
            🔍 Go to Scanner
          </button>
        </Link>
      </section>
    </div>
  );
}

const s = {
  page: { background: "#050510", minHeight: "calc(100vh - 60px)", color: "#e0e0f0", fontFamily: "'Space Grotesk', sans-serif" },
  hero: { position: "relative", padding: "80px 24px 60px", overflow: "hidden", textAlign: "center" },
  auroraWrap: { position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" },
  heroInner: { maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 },
  pill: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 20, marginBottom: 18, letterSpacing: "0.5px" },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, margin: "0 0 18px" },
  heroDesc: { fontSize: 15, color: "#8888bb", lineHeight: 1.75, margin: 0 },

  section: { padding: "68px 24px" },
  inner: { maxWidth: 900, margin: "0 auto" },
  sectionPill: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 14, letterSpacing: "0.5px" },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#fff", margin: "0 0 32px", lineHeight: 1.2 },

  problemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 },
  problemCard: { background: "rgba(255,255,255,0.02)", border: "1px solid", borderRadius: 14, padding: "20px" },

  techRow: { display: "flex", gap: 16, padding: "16px 20px", marginBottom: 10, background: "rgba(255,255,255,0.02)", borderRadius: "0 12px 12px 0", alignItems: "flex-start" },
  techIcon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },

  sourceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 },
  sourceCard: { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px", textDecoration: "none", display: "block" },

  teamRow: { display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginTop: 8 },
  teamCard: { background: "rgba(255,255,255,0.02)", border: "1px solid", borderRadius: 16, padding: "32px 40px" },
};