// ── SafetyTips Component ──────────────────────────────────────────────────────
// Drop this into your Scanner.jsx (or import from a separate file)
// Usage: Place <SafetyTips score={score} theme={theme} /> right after </ResultCard>

import { useState } from "react";

const TIPS_BY_CATEGORY = {
  high: [
    { icon: "🚫", title: "Do NOT click any links",        desc: "Never tap URLs in suspicious messages. Go directly to the official website instead." },
    { icon: "🔇", title: "Do NOT call back unknown numbers", desc: "Scammers spoof official numbers. Hang up and call the official helpline independently." },
    { icon: "💳", title: "Block your card immediately",   desc: "If payment details were shared, call your bank now or freeze via net banking." },
    { icon: "📢", title: "Report to Cyber Crime",         desc: "File a complaint at cybercrime.gov.in or call the national helpline 1930." },
    { icon: "🔐", title: "Change your passwords",         desc: "If you clicked a link, change passwords for banking, email, and UPI apps immediately." },
    { icon: "👨‍👩‍👧", title: "Warn your contacts",            desc: "Forward this alert to family members — elderly relatives are frequent targets." },
  ],
  medium: [
    { icon: "🧐", title: "Verify before you act",         desc: "Call the company directly using a number from their official website, not the message." },
    { icon: "🔗", title: "Check the URL carefully",       desc: "Look for misspellings like 'sbi-secure.xyz' vs 'sbi.co.in'. Padlock ≠ safe." },
    { icon: "💬", title: "Never share OTPs",              desc: "No legitimate bank, government, or company will ever ask for your OTP over call or message." },
    { icon: "📲", title: "Enable 2FA on all accounts",    desc: "Two-factor authentication stops most account takeover attempts instantly." },
  ],
  low: [
    { icon: "✅", title: "Stay alert going forward",      desc: "Scam tactics evolve. Always verify unexpected offers, even from known contacts." },
    { icon: "🛡️", title: "Keep apps updated",             desc: "Security patches protect against the latest phishing and malware techniques." },
    { icon: "📚", title: "Learn common scam patterns",    desc: "Fake KYC, prize winnings, job offers, and courier fees are India's top scam types." },
  ],
};

const HELPLINES = [
  { label: "Cyber Crime Helpline", value: "1930",        icon: "🚔" },
  { label: "Report Online",        value: "cybercrime.gov.in", icon: "🌐", link: "https://cybercrime.gov.in" },
  { label: "RBI Ombudsman",        value: "14448",       icon: "🏦" },
  { label: "TRAI DND",             value: "1909",        icon: "📵" },
];

function getTipSet(score) {
  if (score >= 60) return { tips: TIPS_BY_CATEGORY.high,   label: "⚠️ Immediate Actions",  accent: "#ff4d6d" };
  if (score >= 35) return { tips: TIPS_BY_CATEGORY.medium, label: "🛡️ Stay Protected",      accent: "#f59e0b" };
  return              { tips: TIPS_BY_CATEGORY.low,    label: "✅ Good Practices",      accent: "#22c55e" };
}

export function SafetyTips({ score = 0, theme }) {
  const [expanded, setExpanded] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const primary = theme?.primary || "#4361ee";
  const { tips, label, accent } = getTipSet(score);

  const handleCopy = (val, i) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopiedIdx(i);
      setTimeout(() => setCopiedIdx(null), 1800);
    });
  };

  return (
    <div style={st.wrap}>
      <style>{`
        @keyframes tipSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tip-card:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.1) !important;
          transform: translateY(-1px);
        }
        .helpline-chip:hover {
          border-color: ${primary}55 !important;
          color: ${primary} !important;
          background: ${primary}10 !important;
        }
        .tips-toggle:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <button
        className="tips-toggle"
        onClick={() => setExpanded(!expanded)}
        style={{ ...st.header, borderBottom: expanded ? "1px solid rgba(255,255,255,0.05)" : "none" }}
      >
        <div style={st.headerLeft}>
          <span style={{ ...st.headerDot, background: accent }} />
          <span style={st.headerTitle}>Safety Tips</span>
          <span style={{ ...st.headerBadge, background: `${accent}18`, color: accent, border: `1px solid ${accent}33` }}>
            {label}
          </span>
        </div>
        <span style={st.chevron}>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div style={st.body}>

          {/* Tips grid */}
          <div style={st.grid}>
            {tips.map((tip, i) => (
              <div
                key={i}
                className="tip-card"
                style={{
                  ...st.tipCard,
                  animationDelay: `${i * 0.07}s`,
                  borderLeft: `2.5px solid ${accent}44`,
                }}
              >
                <span style={st.tipIcon}>{tip.icon}</span>
                <div>
                  <div style={st.tipTitle}>{tip.title}</div>
                  <div style={st.tipDesc}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Helplines */}
          <div style={st.helplinesWrap}>
            <div style={st.helplineLabel}>📞 Helplines &amp; Resources</div>
            <div style={st.helplineRow}>
              {HELPLINES.map((h, i) => (
                <button
                  key={i}
                  className="helpline-chip"
                  style={st.helplineChip}
                  onClick={() => h.link ? window.open(h.link, "_blank") : handleCopy(h.value, i)}
                  title={h.link ? `Open ${h.value}` : `Copy ${h.value}`}
                >
                  <span>{h.icon}</span>
                  <div style={st.chipBody}>
                    <div style={st.chipLabel}>{h.label}</div>
                    <div style={st.chipValue}>
                      {copiedIdx === i ? "✅ Copied!" : h.value}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div style={st.footer}>
            🇮🇳 India lost over <strong style={{ color: "#ff4d6d" }}>₹1,750 Cr</strong> to cyber fraud in 2023.
            Stay informed at{" "}
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" style={{ color: primary, textDecoration: "none" }}>
              cybercrime.gov.in
            </a>
          </div>

        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const st = {
  wrap: {
    marginTop: 12,
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 18,
    overflow: "hidden",
    background: "rgba(5,5,18,0.97)",
    fontFamily: "'Space Grotesk', sans-serif",
  },

  // Header
  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "opacity 0.2s",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  headerDot:  { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  headerTitle: { fontSize: 12, fontWeight: 800, color: "#9999cc", textTransform: "uppercase", letterSpacing: "1px" },
  headerBadge: { fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.3px" },
  chevron: { fontSize: 9, color: "#444466" },

  // Body
  body: { padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: 16 },

  // Tips grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 8,
  },
  tipCard: {
    display: "flex",
    gap: 11,
    alignItems: "flex-start",
    padding: "11px 13px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "default",
    transition: "all 0.2s ease",
    animation: "tipSlideIn 0.35s ease both",
  },
  tipIcon:  { fontSize: 18, flexShrink: 0, marginTop: 1 },
  tipTitle: { fontSize: 12, fontWeight: 700, color: "#ddddf0", marginBottom: 3 },
  tipDesc:  { fontSize: 11, color: "#7777aa", lineHeight: 1.55 },

  // Helplines
  helplinesWrap: {
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: 14,
  },
  helplineLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#5555aa",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: 10,
  },
  helplineRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  helplineChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Space Grotesk', sans-serif",
    textAlign: "left",
    fontSize: 12,
  },
  chipBody:  { display: "flex", flexDirection: "column", gap: 1 },
  chipLabel: { fontSize: 10, color: "#5555aa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },
  chipValue: { fontSize: 12, color: "#aaaacc", fontWeight: 700 },

  // Footer
  footer: {
    fontSize: 11,
    color: "#3a3a5c",
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.04)",
    paddingTop: 12,
    lineHeight: 1.6,
  },
};