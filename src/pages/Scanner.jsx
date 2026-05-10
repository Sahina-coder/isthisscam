import ImageUpload from "../ImageUpload";
import { SafetyTips } from "../components/SafetyTips";
import { useState } from "react";
import Aurora from "../Aurora";
import BorderGlow from "../BorderGlow";
import AnimatedList from "../AnimatedList";
import { THEMES, getThemeFromScore, getRiskConfig, getSignalColor } from "../theme";

const LANGUAGES = [
  { key: "english", label: "🇺🇸 English" },
  { key: "hindi",   label: "🇮🇳 Hindi"   },
  { key: "bengali", label: "🟢 Bengali"  },
];

const EXAMPLES = [
  { label: "📦 Courier Fee",     text: "Your parcel is held at customs. Pay ₹299 clearance fee now: http://delivery-update-india.xyz", cat: "scam" },
  { label: "💸 Loan Approval",   text: "Congratulations! Your instant loan is approved. Pay ₹2,100 processing fee to receive funds today.", cat: "scam" },
  { label: "📲 OTP Scam",        text: "Your OTP is 839201 for account verification. Share it with our executive to complete process.", cat: "scam" },
  { label: "🎓 Scholarship Scam",text: "You are selected for Govt scholarship ₹75,000. Pay ₹1,500 registration fee to claim.", cat: "scam" },
  { label: "💼 Fake HR",         text: "We saw your profile on Naukri. Job confirmed. Send ₹999 for document verification.", cat: "scam" },
  { label: "🏦 RBI Alert",       text: "RBI notice: Your account will be frozen. Verify immediately: http://rbi-secure-update.xyz", cat: "scam" },
  { label: "🎁 Gift Link",       text: "You received a gift 🎁 Click to claim now: http://freegift-card.xyz", cat: "scam" },
  { label: "🏦 Bank Debit",      text: "₹1,250 debited from A/c XX1234 on 02-May. If not you, contact your bank immediately.", cat: "safe" },
  { label: "📱 OTP Secure",      text: "Your OTP for login is 552918. Do not share this code with anyone.", cat: "safe" },
  { label: "🚕 Ola Ride",        text: "Your Ola ride is confirmed. Driver Rajesh will arrive in 3 mins.", cat: "safe" },
  { label: "📧 Interview Mail",  text: "Dear candidate, your interview is scheduled tomorrow at 10 AM. Please join via Google Meet.", cat: "safe" },
  { label: "💳 Transaction Alert",text: "INR 2,000 spent on your HDFC card ending 8890 at Amazon.", cat: "safe" },
  { label: "📢 Sale Ad",         text: "Mega Sale! 70% OFF on all items today only. Visit our website now!", cat: "grey" },
  { label: "💬 Unknown DM",      text: "Hey, are you looking for part-time income? I have a simple opportunity.", cat: "grey" },
  { label: "🔗 Short Link",      text: "Bro this is crazy 😂 https://tinyurl.com/2p9abcde", cat: "grey" },
  { label: "📈 Investment Tip",  text: "Invest ₹5,000 today and earn guaranteed ₹15,000 in 7 days!", cat: "grey" },
  { label: "📨 Random Offer",    text: "We have an exclusive offer for you. Reply YES to know more.", cat: "grey" },
];

const LOADING_STEPS = [
  "🔍 Checking scam databases (MHA + CERT-In + OpenPhish)…",
  "🌐 Analyzing domain age via RDAP…",
  "🧠 Running AI pattern analysis (Groq + Llama 3.1)…",
  "📞 Cross-referencing UPI / phone via Sanchar Saathi…",
  "📊 Calculating scam probability score…",
];

// ── Scan History Component ────────────────────────────────────────────────────
function ScanHistory({ history, onReload, theme }) {
  const [open, setOpen] = useState(true);
  const primary = theme?.primary || "#4361ee";

  if (history.length === 0) return null;

  return (
    <div style={sh.wrap}>
      <button
        onClick={() => setOpen(!open)}
        style={{ ...sh.header, borderColor: `${primary}22` }}
      >
        <span style={sh.headerTitle}>🕐 Recent Scans</span>
        <span style={{ ...sh.badge, background: `${primary}22`, color: primary }}>{history.length}</span>
        <span style={sh.chevron}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={sh.list}>
          {history.map((item, i) => {
            const risk = getRiskConfig(item.score);
            const preview = item.text.length > 55 ? item.text.slice(0, 55) + "…" : item.text;
            return (
              <button
                key={i}
                onClick={() => onReload(item)}
                style={sh.item}
              >
                <div style={{ ...sh.dot, background: risk.color }} />
                <div style={sh.itemBody}>
                  <div style={sh.itemText}>{preview}</div>
                  <div style={sh.itemMeta}>
                    <span style={{ color: risk.color, fontWeight: 700 }}>{item.score}%</span>
                    <span style={sh.itemMetaSep}>·</span>
                    <span style={sh.itemRisk}>{risk.label}</span>
                    <span style={sh.itemMetaSep}>·</span>
                    <span style={sh.itemTime}>{item.time}</span>
                  </div>
                </div>
                <span style={sh.reload}>↩</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const sh = {
  wrap: {
    marginBottom: 16,
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(255,255,255,0.015)",
    animation: "fadeIn 0.3s ease",
  },
  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  headerTitle: { fontSize: 12, fontWeight: 700, color: "#7777aa", flex: 1, textAlign: "left" },
  badge: { fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 },
  chevron: { fontSize: 9, color: "#444466" },
  list: { display: "flex", flexDirection: "column", gap: 0 },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  itemBody: { flex: 1, minWidth: 0 },
  itemText: { fontSize: 12, color: "#ccccdd", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
  itemMeta: { display: "flex", alignItems: "center", gap: 4, fontSize: 11 },
  itemMetaSep: { color: "#333355" },
  itemRisk: { color: "#555577" },
  itemTime: { color: "#333355" },
  reload: { fontSize: 14, color: "#333355", flexShrink: 0 },
};

// ── Feedback Component ────────────────────────────────────────────────────────
function FeedbackSection({ theme }) {
  const [feedback,    setFeedback]    = useState(null);
  const [showInput,   setShowInput]   = useState(false);
  const [correction,  setCorrection]  = useState("");
  const [submitted,   setSubmitted]   = useState(false);
  const primary = theme?.primary || "#4361ee";

  const handleYes = () => {
    setFeedback("yes");
    setShowInput(false);
    setSubmitted(true);
  };

  const handleNo = () => {
    setFeedback("no");
    setShowInput(true);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!correction.trim()) return;
    const existing = JSON.parse(sessionStorage.getItem("isthisscam_feedback") || "[]");
    existing.push({ feedback: "wrong", correction, timestamp: new Date().toISOString() });
    sessionStorage.setItem("isthisscam_feedback", JSON.stringify(existing));
    setSubmitted(true);
    setShowInput(false);
  };

  if (submitted) {
    return (
      <div style={{ ...s.feedbackWrap, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={s.feedbackThanks}>
          {feedback === "yes" ? "✅" : "🙏"} Thank you for your valuable feedback! It helps us improve.
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...s.feedbackWrap, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={s.feedbackLabel}>Was this result correct?</div>

      <div style={s.feedbackBtns}>
        <button
          style={{
            ...s.feedbackBtn,
            ...(feedback === "yes"
              ? { background: "rgba(34,197,94,0.15)", borderColor: "#22c55e", color: "#22c55e" }
              : {}),
          }}
          onClick={handleYes}
        >
          👍 Yes, Correct
        </button>

        <button
          style={{
            ...s.feedbackBtn,
            ...(feedback === "no"
              ? { background: "rgba(255,77,109,0.15)", borderColor: "#ff4d6d", color: "#ff4d6d" }
              : {}),
          }}
          onClick={handleNo}
        >
          👎 No, Wrong
        </button>
      </div>

      {showInput && (
        <div style={s.correctionWrap}>
          <div style={s.correctionLabel}>What was it actually? (optional)</div>
          <textarea
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            placeholder="e.g. This was a legitimate bank message, not a scam..."
            style={s.correctionInput}
          />
          <button
            style={{
              ...s.submitBtn,
              background: `${primary}22`,
              borderColor: `${primary}55`,
              color: primary,
            }}
            onClick={handleSubmit}
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreCircle({ score, color }) {
  return (
    <div style={{ ...s.circle, borderColor: color, boxShadow: `0 0 28px ${color}44` }}>
      <span style={{ ...s.circleNum, color }}>{score}</span>
      <span style={s.circleLabel}>SCAM %</span>
    </div>
  );
}

function ScoreBar({ score, color }) {
  return (
    <div style={s.barOuter}>
      <div style={{ ...s.barInner, width: `${score}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }} />
    </div>
  );
}

function SignalItem({ signal }) {
  const { bar, bg } = getSignalColor(signal.type);
  return (
    <div style={{ ...s.signal, background: bg, borderLeft: `3px solid ${bar}` }}>
      <span style={s.signalIcon}>{signal.icon}</span>
      <div>
        <div style={s.signalTitle}>{signal.title}</div>
        <div style={s.signalDesc}>{signal.description}</div>
      </div>
    </div>
  );
}

function LangExplanation({ explanation, theme }) {
  const [lang, setLang] = useState("english");
  const primary = theme?.primary || "#4361ee";
  return (
    <div>
      <div style={s.sectionLabel}>📣 Explanation</div>
      <div style={s.langTabs}>
        {LANGUAGES.map((l) => (
          <button
            key={l.key}
            style={lang === l.key
              ? { ...s.langTab, background: primary, borderColor: primary, color: "#fff" }
              : s.langTab
            }
            onClick={() => setLang(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div style={s.langContent} dangerouslySetInnerHTML={{ __html: explanation[lang] || "—" }} />
    </div>
  );
}

function ResultCard({ result, theme }) {
  const score       = result.scam_score ?? result.score ?? 0;
  const risk        = getRiskConfig(score);
  const signals     = result.signals ?? [];
  const explanation = result.explanation ?? { english: result.result || "—", hindi: "—", bengali: "—" };
  const stats       = result.stats ?? {};
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const t = THEMES[getThemeFromScore(score)];

  return (
    <BorderGlow
      colors={t.glowColors}
      glowColor={t.glowColor}
      backgroundColor="rgba(5,5,18,0.98)"
      borderRadius={18}
      glowIntensity={1.4}
      edgeSensitivity={20}
    >
      {/* Score header */}
      <div style={s.scoreHeader}>
        <ScoreCircle score={score} color={risk.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...s.verdictBadge, background: `${risk.color}20`, color: risk.color, border: `1px solid ${risk.color}40` }}>
            {risk.label}
          </div>
          {result.scam_category && <div style={s.categoryText}>{result.scam_category}</div>}
          <ScoreBar score={score} color={risk.color} />
        </div>
      </div>

      {/* Signals */}
      {signals.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionLabel}>🔍 Signals Detected</div>
          <div style={s.signalList}>
            {signals.map((sig, i) => <SignalItem key={i} signal={sig} />)}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div style={s.section}>
        <LangExplanation explanation={explanation} theme={theme} />
      </div>

      {/* Stats */}
      {(stats.reports || stats.loss || stats.victims) && (
        <div style={s.statBar}>
          {[
            { num: stats.reports, label: "Reports"   },
            { num: stats.loss,    label: "Est. Loss"  },
            { num: stats.victims, label: "Victims"    },
          ].map((it, i) => (
            <div key={i} style={{ ...s.statItem, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ ...s.statNum, color: risk.color }}>{it.num || "—"}</div>
              <div style={s.statLabel}>{it.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={s.actions}>
        <button
          style={hoveredBtn === "r"
            ? { ...s.actionBtn, background: "rgba(255,77,109,0.1)", borderColor: "rgba(255,77,109,0.4)", color: "#ff4d6d" }
            : s.actionBtn}
          onMouseEnter={() => setHoveredBtn("r")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => window.open("https://cybercrime.gov.in", "_blank")}
        >🚨 Report This</button>
        <button
          style={hoveredBtn === "s"
            ? { ...s.actionBtn, background: `${theme?.primary}18`, borderColor: `${theme?.primary}44`, color: theme?.primary }
            : s.actionBtn}
          onMouseEnter={() => setHoveredBtn("s")}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => {
            const text = encodeURIComponent(`⚠️ Scam Alert! Risk Score: ${score}%\nStay safe! Check at isthisscam.vercel.app`);
            window.open(`https://wa.me/?text=${text}`, "_blank");
          }}
        >📤 Share Warning</button>
      </div>

      {/* Feedback Section */}
      <FeedbackSection theme={theme} />

    </BorderGlow>
  );
}

// ── Main Scanner Page ─────────────────────────────────────────────────────────
export default function Scanner({ theme, setThemeKey }) {
  const [input,     setInput]     = useState("");
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [scanHover, setScanHover] = useState(false);
  const [exHovered, setExHovered] = useState(null);
  const [history,   setHistory]   = useState([]);  // ← Scan History state

  const primary = theme?.primary || "#4361ee";

  // ── Helper: add to history ──────────────────────────────────────────────────
  const addToHistory = (text, data) => {
    const score = data.scam_score ?? data.score ?? 0;
    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const entry = { text, score, time, result: data };
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.text !== text); // avoid duplicates
      return [entry, ...filtered].slice(0, 5);              // keep last 5
    });
  };

  // ── Helper: reload from history ─────────────────────────────────────────────
  const handleReload = (item) => {
    setInput(item.text);
    setResult(item.result);
    setThemeKey(getThemeFromScore(item.score));
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setThemeKey("default");
    try {
      const res = await fetch("https://isthisscam-backend.onrender.com/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setThemeKey(getThemeFromScore(data.scam_score ?? data.score ?? 0));
      addToHistory(input, data);  // ← Save to history after successful scan
    } catch (err) {
      setError(err.message || "Backend error. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  const canScan = !loading && input.trim();

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        * { box-sizing: border-box; }
        textarea:focus { border-color: ${primary}66 !important; box-shadow: 0 0 0 3px ${primary}14 !important; outline: none; }
        .ex-btn:hover { border-color: ${primary}66 !important; color: ${primary} !important; background: ${primary}10 !important; }
        .feedback-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .history-item:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      <div style={s.main}>

        {/* Hero */}
        <div style={s.heroWrap}>
          <div style={s.auroraWrap}>
            <Aurora colorStops={theme?.aurora || ["#4361ee","#3a86ff","#7209b7"]} amplitude={0.7} blend={0.5} speed={0.35} />
          </div>
          <div style={s.hero}>
            <div style={{ ...s.heroPill, background: `${primary}18`, border: `1px solid ${primary}44`, color: primary }}>
              🇮🇳 India's AI Scam Detector
            </div>
            <h1 style={s.heroTitle}>
              Paste Anything.<br />
              <em style={{ color: primary, fontStyle: "italic" }}>Know Instantly.</em>
            </h1>
            <p style={s.heroSub}>URL · UPI ID · Phone Number · Job Offer · WhatsApp Message</p>
          </div>
        </div>

        {/* ── SCAN HISTORY — shown above the input card if history exists ── */}
        <ScanHistory
          history={history}
          onReload={handleReload}
          theme={theme}
        />

        {/* ── IMAGE UPLOAD (OCR) ── */}
        <ImageUpload
          theme={theme}
          onTextExtracted={(text) => {
            setInput(text);
            setResult(null);
            setThemeKey("default");
            setError(null);
          }}
        />

        {/* Input card */}
        <BorderGlow
          colors={theme?.glowColors || ["#4361ee","#3a86ff","#7b9cff"]}
          glowColor={theme?.glowColor || "225 80 60"}
          backgroundColor="rgba(5,5,18,0.96)"
          borderRadius={18}
          glowIntensity={1.1}
          edgeSensitivity={22}
        >
          <div style={s.inputInner}>
            <div style={{ ...s.inputLabel, color: `${primary}cc` }}>Paste suspicious content below</div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); if (result) { setResult(null); setThemeKey("default"); } }}
              onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleCheck(); }}
              placeholder={"e.g. https://sbi-kyc-update.xyz/verify\nOR  'Aapko ₹50,000 ka prize mila hai! Abhi claim karein...'"}
              style={{ ...s.textarea, borderColor: `${primary}22` }}
            />
            <div style={s.exRow}>
              <span style={s.tryLabel}>Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  className="ex-btn"
                  style={{
                    ...s.exBtn,
                    borderColor: exHovered === ex.label ? `${primary}55` : "rgba(255,255,255,0.08)",
                    color:       exHovered === ex.label ? primary         : "#8888aa",
                    background:  exHovered === ex.label ? `${primary}10`  : "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={() => setExHovered(ex.label)}
                  onMouseLeave={() => setExHovered(null)}
                  onClick={() => { setInput(ex.text); setResult(null); setThemeKey("default"); setError(null); }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </BorderGlow>

        {/* Scan button */}
        <button
          onClick={handleCheck}
          disabled={!canScan}
          style={{
            ...s.scanBtn,
            background:  theme?.scanBtn || "linear-gradient(135deg, #4361ee, #3a86ff)",
            boxShadow:   scanHover && canScan ? `0 8px 36px ${primary}55` : `0 4px 20px ${primary}33`,
            opacity:     canScan ? 1 : 0.5,
            transform:   scanHover && canScan ? "translateY(-2px)" : "translateY(0)",
          }}
          onMouseEnter={() => setScanHover(true)}
          onMouseLeave={() => setScanHover(false)}
        >
          {loading
            ? <><span style={s.scanSpinner} /> Analyzing…</>
            : "🔍 Scan for Scam"
          }
        </button>

        <p style={s.hint}>Tip: Press Ctrl + Enter to scan quickly</p>

        {/* Loading */}
        {loading && (
          <div style={s.loadCard}>
            <div style={s.loadTop}>
              <div style={{ ...s.spinner, borderTopColor: primary }} />
              <p style={s.loadTitle}>Analyzing…</p>
              <p style={s.loadSub}>Running 5 checks in parallel</p>
            </div>
            <AnimatedList items={LOADING_STEPS} showGradients displayScrollbar={false} />
          </div>
        )}

        {/* Error */}
        {error && <div style={s.errorCard}>❌ {error}</div>}

        {/* Result */}
        {result && !loading && (
          <div style={{ animation: "fadeUp 0.45s ease", marginTop: 0 }}>
            <ResultCard result={result} theme={theme} />
            <SafetyTips score={result.scam_score ?? result.score ?? 0} theme={theme} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: { background: "#050510", minHeight: "calc(100vh - 60px)", color: "#e0e0f0", fontFamily: "'Space Grotesk', sans-serif" },
  main: { maxWidth: 820, margin: "0 auto", padding: "32px 20px 60px", position: "relative", zIndex: 1 },

  heroWrap:  { position: "relative", textAlign: "center", marginBottom: 28, padding: "44px 20px 36px", borderRadius: 20, overflow: "hidden" },
  auroraWrap:{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" },
  hero:      { position: "relative", zIndex: 2 },
  heroPill:  { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 20, marginBottom: 14, letterSpacing: "0.5px", transition: "all 0.8s ease" },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, margin: "0 0 10px" },
  heroSub:   { color: "#6666aa", fontSize: 13, margin: 0 },

  inputInner: { padding: "20px 22px 16px" },
  inputLabel: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10, transition: "color 0.8s ease" },
  textarea: {
    width: "100%", minHeight: 108,
    background: "rgba(0,0,0,0.5)", border: "1px solid",
    borderRadius: 10, padding: 14, color: "#e0e0f0", fontSize: 14,
    fontFamily: "'Space Grotesk', sans-serif", resize: "vertical",
    transition: "border-color 0.3s, box-shadow 0.3s", lineHeight: 1.6,
  },

  exRow:    { display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12, alignItems: "center" },
  tryLabel: { fontSize: 11, color: "#333355" },
  exBtn:    { fontSize: 11, padding: "5px 11px", borderRadius: 20, cursor: "pointer", border: "1px solid", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" },

  scanBtn: {
    width: "100%", marginTop: 14, padding: "16px",
    border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700,
    fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer", transition: "all 0.25s ease",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.3px",
  },
  scanSpinner: {
    display: "inline-block", width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },
  hint: { textAlign: "center", fontSize: 11, color: "#1e1e36", marginTop: 8 },

  loadCard:  { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 18px", marginTop: 18 },
  loadTop:   { textAlign: "center", marginBottom: 14 },
  spinner:   { width: 34, height: 34, border: "2px solid rgba(255,255,255,0.07)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 10px", transition: "border-top-color 0.8s ease" },
  loadTitle: { fontWeight: 700, color: "#ccc", margin: "0 0 4px", fontSize: 13 },
  loadSub:   { color: "#333355", fontSize: 11, margin: 0 },

  errorCard: { marginTop: 18, background: "rgba(255,77,109,0.07)", border: "1px solid rgba(255,77,109,0.25)", borderRadius: 12, padding: "13px 18px", color: "#ff4d6d", fontSize: 13 },

  scoreHeader:  { padding: "22px 22px 14px", display: "flex", gap: 18, alignItems: "center" },
  circle:       { width: 86, height: 86, borderRadius: "50%", border: "2.5px solid", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", transition: "box-shadow 0.4s" },
  circleNum:    { fontSize: 24, fontWeight: 900, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 },
  circleLabel:  { fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 },
  verdictBadge: { display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.3px", marginBottom: 8 },
  categoryText: { fontSize: 11, color: "#6666aa", marginBottom: 8 },
  barOuter:     { height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" },
  barInner:     { height: "100%", borderRadius: 100, transition: "width 1.3s ease" },

  section:      { padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.05)" },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: "#5555aa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 },

  signalList: { display: "flex", flexDirection: "column", gap: 7 },
  signal:     { display: "flex", gap: 11, padding: "9px 13px", borderRadius: 8, alignItems: "flex-start" },
  signalIcon:  { fontSize: 14, flexShrink: 0, marginTop: 1 },
  signalTitle: { fontSize: 12, fontWeight: 700, color: "#ddddf0" },
  signalDesc:  { fontSize: 11, color: "#7777aa", marginTop: 2, lineHeight: 1.5 },

  langTabs:    { display: "flex", gap: 6, marginBottom: 10 },
  langTab:     { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#7777aa", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" },
  langContent: { background: "rgba(0,0,0,0.3)", borderRadius: 9, padding: "12px 14px", fontSize: 12, lineHeight: 1.7, color: "#bbbbcc" },

  statBar:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid rgba(255,255,255,0.05)" },
  statItem:  { padding: "12px", textAlign: "center" },
  statNum:   { fontSize: 16, fontWeight: 800, fontFamily: "'Cormorant Garamond', serif" },
  statLabel: { fontSize: 9, color: "#5555aa", marginTop: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" },

  actions:   { display: "flex", gap: 8, padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.05)" },
  actionBtn: { flex: 1, padding: "10px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#9999bb", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" },

  feedbackWrap:   { padding: "14px 18px" },
  feedbackLabel:  { fontSize: 12, color: "#7777aa", marginBottom: 10, textAlign: "center", fontWeight: 600 },
  feedbackBtns:   { display: "flex", gap: 10, justifyContent: "center" },
  feedbackBtn: {
    padding: "8px 22px", borderRadius: 20, fontSize: 12, fontWeight: 700,
    cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)", color: "#9999bb",
    transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif",
  },
  feedbackThanks: { fontSize: 13, color: "#22c55e", textAlign: "center", fontWeight: 600, padding: "4px 0", animation: "fadeIn 0.4s ease" },
  correctionWrap:  { marginTop: 12, animation: "fadeIn 0.3s ease" },
  correctionLabel: { fontSize: 11, color: "#6666aa", marginBottom: 6 },
  correctionInput: {
    width: "100%", minHeight: 70,
    background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, padding: 10, color: "#e0e0f0", fontSize: 12,
    fontFamily: "'Space Grotesk', sans-serif", resize: "vertical",
    outline: "none", lineHeight: 1.5,
  },
  submitBtn: {
    marginTop: 8, padding: "8px 20px", borderRadius: 8,
    fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid",
    transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif",
  },
};