import ImageUpload from "../ImageUpload";
import { SafetyTips } from "../components/SafetyTips";
import { useState, useEffect, useRef, useCallback } from "react";
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
  { label: "📦 Courier Fee",      text: "Your parcel is held at customs. Pay ₹299 clearance fee now: http://delivery-update-india.xyz", cat: "scam" },
  { label: "💸 Loan Approval",    text: "Congratulations! Your instant loan is approved. Pay ₹2,100 processing fee to receive funds today.", cat: "scam" },
  { label: "📲 OTP Scam",         text: "Your OTP is 839201 for account verification. Share it with our executive to complete process.", cat: "scam" },
  { label: "🎓 Scholarship Scam", text: "You are selected for Govt scholarship ₹75,000. Pay ₹1,500 registration fee to claim.", cat: "scam" },
  { label: "💼 Fake HR",          text: "We saw your profile on Naukri. Job confirmed. Send ₹999 for document verification.", cat: "scam" },
  { label: "🏦 RBI Alert",        text: "RBI notice: Your account will be frozen. Verify immediately: http://rbi-secure-update.xyz", cat: "scam" },
  { label: "🎁 Gift Link",        text: "You received a gift 🎁 Click to claim now: http://freegift-card.xyz", cat: "scam" },
  { label: "🏦 Bank Debit",       text: "₹1,250 debited from A/c XX1234 on 02-May. If not you, contact your bank immediately.", cat: "safe" },
  { label: "📱 OTP Secure",       text: "Your OTP for login is 552918. Do not share this code with anyone.", cat: "safe" },
  { label: "🚕 Ola Ride",         text: "Your Ola ride is confirmed. Driver Rajesh will arrive in 3 mins.", cat: "safe" },
  { label: "📧 Interview Mail",   text: "Dear candidate, your interview is scheduled tomorrow at 10 AM. Please join via Google Meet.", cat: "safe" },
  { label: "💳 Transaction Alert",text: "INR 2,000 spent on your HDFC card ending 8890 at Amazon.", cat: "safe" },
  { label: "📢 Sale Ad",          text: "Mega Sale! 70% OFF on all items today only. Visit our website now!", cat: "grey" },
  { label: "💬 Unknown DM",       text: "Hey, are you looking for part-time income? I have a simple opportunity.", cat: "grey" },
  { label: "🔗 Short Link",       text: "Bro this is crazy 😂 https://tinyurl.com/2p9abcde", cat: "grey" },
  { label: "📈 Investment Tip",   text: "Invest ₹5,000 today and earn guaranteed ₹15,000 in 7 days!", cat: "grey" },
  { label: "📨 Random Offer",     text: "We have an exclusive offer for you. Reply YES to know more.", cat: "grey" },
];

const LOADING_STEPS = [
  "🔍 Checking scam databases (MHA + CERT-In + OpenPhish)…",
  "🌐 Analyzing domain age via RDAP…",
  "🧠 Running AI pattern analysis (Groq + Llama 3.1)…",
  "📞 Cross-referencing UPI / phone via Sanchar Saathi…",
  "📊 Calculating scam probability score…",
];

// ── Count-Up Hook ─────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    if (target === 0) return;
    let current = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ── Daily Stats Hook (scan counter + streak) ──────────────────────────────────
function useDailyStats() {
  const getToday = () => new Date().toISOString().slice(0, 10);

  const load = () => {
    try {
      const raw = JSON.parse(localStorage.getItem("isthisscam_daily") || "{}");
      const today = getToday();
      if (raw.date !== today) return { date: today, total: 0, scamsCaught: 0 };
      return raw;
    } catch { return { date: getToday(), total: 0, scamsCaught: 0 }; }
  };

  const [stats, setStats] = useState(load);

  const increment = useCallback((score) => {
    setStats((prev) => {
      const today = getToday();
      const base  = prev.date === today ? prev : { date: today, total: 0, scamsCaught: 0 };
      const next  = { ...base, total: base.total + 1, scamsCaught: base.scamsCaught + (score >= 61 ? 1 : 0) };
      localStorage.setItem("isthisscam_daily", JSON.stringify(next));
      return next;
    });
  }, []);

  return { stats, increment };
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x:   Math.random() * canvas.width,
      y:   -10 - Math.random() * 200,
      r:   4 + Math.random() * 6,
      d:   0.5 + Math.random() * 2,
      color: ["#22c55e","#4ade80","#86efac","#bbf7d0","#fff","#fbbf24"][Math.floor(Math.random() * 6)],
      tilt: Math.random() * 10 - 5,
      tiltSpeed: 0.05 + Math.random() * 0.1,
      angle: Math.random() * Math.PI * 2,
    }));

    let frame;
    let elapsed = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;
      pieces.forEach((p) => {
        p.angle += p.tiltSpeed;
        p.tilt   = Math.sin(p.angle) * 12;
        p.y     += p.d + Math.sin(elapsed * 0.01) * 0.3;
        p.x     += Math.sin(elapsed * 0.008) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x + p.r, p.y + p.r);
        ctx.rotate(p.tilt * Math.PI / 180);
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      });
      if (elapsed < 200) frame = requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none" }}
    />
  );
}

// ── Compare Panel ─────────────────────────────────────────────────────────────
function ComparePanel({ primary, onScanA, onScanB, resultA, resultB, loadingA, loadingB }) {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");

  const scoreA = resultA ? (resultA.scam_score ?? resultA.score ?? 0) : null;
  const scoreB = resultB ? (resultB.scam_score ?? resultB.score ?? 0) : null;
  const riskA  = scoreA !== null ? getRiskConfig(scoreA) : null;
  const riskB  = scoreB !== null ? getRiskConfig(scoreB) : null;

  const borderC = "rgba(255,255,255,0.06)";
  const inputStyle = {
    width: "100%", minHeight: 72,
    background: "rgba(0,0,0,0.45)", border: `1px solid ${primary}22`,
    borderRadius: 8, padding: 10, color: "#e0e0f0", fontSize: 12,
    fontFamily: "'Space Grotesk', sans-serif", resize: "vertical", lineHeight: 1.5,
    outline: "none",
  };

  return (
    <div style={{ border: `1px solid ${borderC}`, borderRadius: 16, overflow: "hidden", marginBottom: 16, background: "rgba(255,255,255,0.015)" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${borderC}`, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#9999cc" }}>🔄 Compare Two Messages</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* Message A */}
        <div style={{ padding: "14px 14px 14px 16px", borderRight: `1px solid ${borderC}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: `${primary}aa`, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Message A</div>
          <textarea value={textA} onChange={(e) => setTextA(e.target.value)} placeholder="Paste first message…" style={inputStyle} />
          <button
            onClick={() => onScanA(textA)}
            disabled={!textA.trim() || loadingA}
            style={{ marginTop: 8, width: "100%", padding: "8px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${primary}, ${primary}bb)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: textA.trim() ? "pointer" : "not-allowed", opacity: textA.trim() ? 1 : 0.5, fontFamily: "'Space Grotesk', sans-serif" }}
          >{loadingA ? "Scanning…" : "Scan A"}</button>
          {riskA && (
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: `${riskA.color}12`, border: `1px solid ${riskA.color}30`, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: riskA.color, fontFamily: "'Cormorant Garamond', serif" }}>{scoreA}</div>
              <div style={{ fontSize: 10, color: riskA.color, fontWeight: 700 }}>{riskA.label}</div>
            </div>
          )}
        </div>

        {/* Message B */}
        <div style={{ padding: "14px 16px 14px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: `${primary}aa`, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Message B</div>
          <textarea value={textB} onChange={(e) => setTextB(e.target.value)} placeholder="Paste second message…" style={inputStyle} />
          <button
            onClick={() => onScanB(textB)}
            disabled={!textB.trim() || loadingB}
            style={{ marginTop: 8, width: "100%", padding: "8px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${primary}, ${primary}bb)`, color: "#fff", fontSize: 12, fontWeight: 700, cursor: textB.trim() ? "pointer" : "not-allowed", opacity: textB.trim() ? 1 : 0.5, fontFamily: "'Space Grotesk', sans-serif" }}
          >{loadingB ? "Scanning…" : "Scan B"}</button>
          {riskB && (
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 8, background: `${riskB.color}12`, border: `1px solid ${riskB.color}30`, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: riskB.color, fontFamily: "'Cormorant Garamond', serif" }}>{scoreB}</div>
              <div style={{ fontSize: 10, color: riskB.color, fontWeight: 700 }}>{riskB.label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Winner banner */}
      {scoreA !== null && scoreB !== null && (
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${borderC}`, textAlign: "center", fontSize: 12, color: "#9999cc", fontWeight: 600 }}>
          {scoreA === scoreB
            ? "⚖️ Both messages have equal risk"
            : scoreA > scoreB
              ? `⚠️ Message A is riskier by ${scoreA - scoreB} points`
              : `⚠️ Message B is riskier by ${scoreB - scoreA} points`
          }
        </div>
      )}
    </div>
  );
}

// ── Copy Result Button ─────────────────────────────────────────────────────────
function CopyResultBtn({ result, primary }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const score    = result.scam_score ?? result.score ?? 0;
    const risk     = getRiskConfig(score);
    const signals  = (result.signals ?? []).map((s) => `  • ${s.title}: ${s.description}`).join("\n");
    const eng      = result.explanation?.english || result.result || "—";
    const text = [
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🛡️ IsThisScam.in Scan Report`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `Scam Score   : ${score}%`,
      `Verdict      : ${risk.label}`,
      result.scam_category ? `Category     : ${result.scam_category}` : "",
      signals ? `\nSignals Detected:\n${signals}` : "",
      `\nExplanation:\n${eng.replace(/<[^>]*>/g, "")}`,
      `\nScanned at isthisscam.vercel.app`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
    ].filter(Boolean).join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "8px 16px", borderRadius: 8, fontSize: 11, fontWeight: 700,
        cursor: "pointer", border: `1px solid ${copied ? "#22c55e55" : "rgba(255,255,255,0.08)"}`,
        background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
        color: copied ? "#22c55e" : "#9999bb",
        transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif",
        display: "flex", alignItems: "center", gap: 6,
      }}
    >
      {copied ? "✅ Copied!" : "📋 Copy Result"}
    </button>
  );
}

// ── Stats Bar (counter + streak + response time) ──────────────────────────────
function StatsBar({ stats, responseTime, primary }) {
  if (stats.total === 0 && !responseTime) return null;

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14,
      padding: "10px 14px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      animation: "fadeIn 0.3s ease",
    }}>
      {stats.total > 0 && (
        <div style={chip}>
          <span>🔢</span>
          <span style={{ color: primary, fontWeight: 700 }}>{stats.total}</span>
          <span style={chipTxt}>scanned today</span>
        </div>
      )}
      {stats.scamsCaught > 0 && (
        <div style={chip}>
          <span>🔥</span>
          <span style={{ color: "#ff4d6d", fontWeight: 700 }}>{stats.scamsCaught}</span>
          <span style={chipTxt}>{stats.scamsCaught === 1 ? "scam caught" : "scams caught"} today</span>
        </div>
      )}
      {responseTime && (
        <div style={chip}>
          <span>⏱️</span>
          <span style={{ color: "#fbbf24", fontWeight: 700 }}>{responseTime}s</span>
          <span style={chipTxt}>response time</span>
        </div>
      )}
    </div>
  );
}

const chip    = { display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontFamily: "'Space Grotesk', sans-serif" };
const chipTxt = { color: "#7777aa" };

// ── Scan History ──────────────────────────────────────────────────────────────
function ScanHistory({ history, onReload, theme }) {
  const [open, setOpen] = useState(true);
  const primary = theme?.primary || "#4361ee";
  if (history.length === 0) return null;

  return (
    <div style={{ marginBottom: 16, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.015)", animation: "fadeIn 0.3s ease" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "transparent", border: "none", borderBottom: `1px solid ${primary}22`, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#7777aa", flex: 1, textAlign: "left" }}>🕐 Recent Scans</span>
        <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20, background: `${primary}22`, color: primary }}>{history.length}</span>
        <span style={{ fontSize: 9, color: "#444466" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && history.map((item, i) => {
        const risk    = getRiskConfig(item.score);
        const preview = item.text.length > 55 ? item.text.slice(0, 55) + "…" : item.text;
        return (
          <button key={i} onClick={() => onReload(item)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", textAlign: "left", fontFamily: "'Space Grotesk', sans-serif" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: risk.color }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "#ccccdd", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{preview}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                <span style={{ color: risk.color, fontWeight: 700 }}>{item.score}%</span>
                <span style={{ color: "#333355" }}>·</span>
                <span style={{ color: "#555577" }}>{risk.label}</span>
                <span style={{ color: "#333355" }}>·</span>
                <span style={{ color: "#333355" }}>{item.time}</span>
              </div>
            </div>
            <span style={{ fontSize: 14, color: "#333355", flexShrink: 0 }}>↩</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Feedback ──────────────────────────────────────────────────────────────────
function FeedbackSection({ theme }) {
  const [feedback,   setFeedback]   = useState(null);
  const [showInput,  setShowInput]  = useState(false);
  const [correction, setCorrection] = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const primary = theme?.primary || "#4361ee";

  const handleYes = () => { setFeedback("yes"); setShowInput(false); setSubmitted(true); };
  const handleNo  = () => { setFeedback("no");  setShowInput(true);  setSubmitted(false); };
  const handleSubmit = () => {
    if (!correction.trim()) return;
    const ex = JSON.parse(sessionStorage.getItem("isthisscam_feedback") || "[]");
    ex.push({ feedback: "wrong", correction, timestamp: new Date().toISOString() });
    sessionStorage.setItem("isthisscam_feedback", JSON.stringify(ex));
    setSubmitted(true); setShowInput(false);
  };

  if (submitted) return (
    <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ fontSize: 13, color: "#22c55e", textAlign: "center", fontWeight: 600, animation: "fadeIn 0.4s ease" }}>
        {feedback === "yes" ? "✅" : "🙏"} Thank you for your valuable feedback!
      </div>
    </div>
  );

  return (
    <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ fontSize: 12, color: "#7777aa", marginBottom: 10, textAlign: "center", fontWeight: 600 }}>Was this result correct?</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {[
          { label: "👍 Yes, Correct", val: "yes", act: { background: "rgba(34,197,94,0.15)", borderColor: "#22c55e", color: "#22c55e" } },
          { label: "👎 No, Wrong",    val: "no",  act: { background: "rgba(255,77,109,0.15)", borderColor: "#ff4d6d", color: "#ff4d6d" } },
        ].map(({ label, val, act }) => (
          <button key={val} onClick={val === "yes" ? handleYes : handleNo}
            style={{ padding: "8px 22px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#9999bb", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif", ...(feedback === val ? act : {}) }}
          >{label}</button>
        ))}
      </div>
      {showInput && (
        <div style={{ marginTop: 12, animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontSize: 11, color: "#6666aa", marginBottom: 6 }}>What was it actually? (optional)</div>
          <textarea value={correction} onChange={(e) => setCorrection(e.target.value)} placeholder="e.g. This was a legitimate bank message..."
            style={{ width: "100%", minHeight: 70, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 10, color: "#e0e0f0", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", resize: "vertical", outline: "none", lineHeight: 1.5 }}
          />
          <button onClick={handleSubmit}
            style={{ marginTop: 8, padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: `1px solid ${primary}55`, background: `${primary}22`, color: primary, transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" }}
          >Submit Feedback</button>
        </div>
      )}
    </div>
  );
}

// ── Score components ──────────────────────────────────────────────────────────
function ScoreCircle({ score, color }) {
  const animated = useCountUp(score, 1200);
  return (
    <div style={{ width: 86, height: 86, borderRadius: "50%", border: `2.5px solid ${color}`, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", boxShadow: `0 0 28px ${color}44`, transition: "box-shadow 0.4s" }}>
      <span style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1, color }}>{animated}</span>
      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>SCAM %</span>
    </div>
  );
}

function ScoreBar({ score, color }) {
  const animated = useCountUp(score, 1200);
  return (
    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 100, width: `${animated}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }} />
    </div>
  );
}

function SignalItem({ signal }) {
  const { bar, bg } = getSignalColor(signal.type);
  return (
    <div style={{ display: "flex", gap: 11, padding: "9px 13px", borderRadius: 8, alignItems: "flex-start", background: bg, borderLeft: `3px solid ${bar}` }}>
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{signal.icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#ddddf0" }}>{signal.title}</div>
        <div style={{ fontSize: 11, color: "#7777aa", marginTop: 2, lineHeight: 1.5 }}>{signal.description}</div>
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
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {LANGUAGES.map((l) => (
          <button key={l.key}
            style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif", ...(lang === l.key ? { background: primary, borderColor: primary, color: "#fff", border: `1px solid ${primary}` } : { background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#7777aa" }) }}
            onClick={() => setLang(l.key)}
          >{l.label}</button>
        ))}
      </div>
      <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 9, padding: "12px 14px", fontSize: 12, lineHeight: 1.7, color: "#bbbbcc" }}
        dangerouslySetInnerHTML={{ __html: explanation[lang] || "—" }}
      />
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
  const t           = THEMES[getThemeFromScore(score)];
  const secBdr      = "1px solid rgba(255,255,255,0.05)";

  return (
    <BorderGlow colors={t.glowColors} glowColor={t.glowColor} backgroundColor="rgba(5,5,18,0.98)" borderRadius={18} glowIntensity={1.4} edgeSensitivity={20}>
      {/* Score header */}
      <div style={{ padding: "22px 22px 14px", display: "flex", gap: 18, alignItems: "center" }}>
        <ScoreCircle score={score} color={risk.color} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: "0.3px", marginBottom: 8, background: `${risk.color}20`, color: risk.color, border: `1px solid ${risk.color}40` }}>{risk.label}</div>
          {result.scam_category && <div style={{ fontSize: 11, color: "#6666aa", marginBottom: 8 }}>{result.scam_category}</div>}
          <ScoreBar score={score} color={risk.color} />
        </div>
      </div>

      {signals.length > 0 && (
        <div style={{ padding: "14px 22px", borderTop: secBdr }}>
          <div style={s.sectionLabel}>🔍 Signals Detected</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {signals.map((sig, i) => <SignalItem key={i} signal={sig} />)}
          </div>
        </div>
      )}

      <div style={{ padding: "14px 22px", borderTop: secBdr }}>
        <LangExplanation explanation={explanation} theme={theme} />
      </div>

      {(stats.reports || stats.loss || stats.victims) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: secBdr }}>
          {[{ num: stats.reports, label: "Reports" }, { num: stats.loss, label: "Est. Loss" }, { num: stats.victims, label: "Victims" }].map((it, i) => (
            <div key={i} style={{ padding: "12px", textAlign: "center", borderRight: i < 2 ? secBdr : "none" }}>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Cormorant Garamond', serif", color: risk.color }}>{it.num || "—"}</div>
              <div style={{ fontSize: 9, color: "#5555aa", marginTop: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{it.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Actions row — includes Copy Result */}
      <div style={{ display: "flex", gap: 8, padding: "12px 18px", borderTop: secBdr, flexWrap: "wrap" }}>
        <button
          style={hoveredBtn === "r" ? { ...s.actionBtn, background: "rgba(255,77,109,0.1)", borderColor: "rgba(255,77,109,0.4)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.4)" } : s.actionBtn}
          onMouseEnter={() => setHoveredBtn("r")} onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => window.open("https://cybercrime.gov.in", "_blank")}
        >🚨 Report This</button>
        <button
          style={hoveredBtn === "s" ? { ...s.actionBtn, background: `${theme?.primary}18`, borderColor: `${theme?.primary}44`, color: theme?.primary, border: `1px solid ${theme?.primary}44` } : s.actionBtn}
          onMouseEnter={() => setHoveredBtn("s")} onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => { const t = encodeURIComponent(`⚠️ Scam Alert! Risk Score: ${score}%\nStay safe! Check at isthisscam.vercel.app`); window.open(`https://wa.me/?text=${t}`, "_blank"); }}
        >📤 Share Warning</button>
        <CopyResultBtn result={result} primary={theme?.primary || "#4361ee"} />
      </div>

      <FeedbackSection theme={theme} />
    </BorderGlow>
  );
}

// ── Main Scanner ──────────────────────────────────────────────────────────────
export default function Scanner({ theme, setThemeKey }) {
  const [input,        setInput]        = useState("");
  const [result,       setResult]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [scanHover,    setScanHover]    = useState(false);
  const [exHovered,    setExHovered]    = useState(null);
  const [history,      setHistory]      = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [showCompare,  setShowCompare]  = useState(false);
  const [compareA,     setCompareA]     = useState(null);
  const [compareB,     setCompareB]     = useState(null);
  const [loadingA,     setLoadingA]     = useState(false);
  const [loadingB,     setLoadingB]     = useState(false);

  const { stats, increment } = useDailyStats();
  const primary = theme?.primary || "#4361ee";

  const addToHistory = (text, data) => {
    const score = data.scam_score ?? data.score ?? 0;
    const time  = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setHistory((prev) => [{ text, score, time, result: data }, ...prev.filter((h) => h.text !== text)].slice(0, 5));
  };

  const handleReload = (item) => {
    setInput(item.text); setResult(item.result);
    setThemeKey(getThemeFromScore(item.score)); setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doScan = async (text) => {
    const res = await fetch("https://isthisscam-backend.onrender.com/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return res.json();
  };

  const handleCheck = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null); setError(null);
    setThemeKey("default"); setResponseTime(null); setShowConfetti(false);
    const t0 = Date.now();
    try {
      const data  = await doScan(input);
      const score = data.scam_score ?? data.score ?? 0;
      const ms    = Date.now() - t0;
      setResponseTime((ms / 1000).toFixed(1));
      setResult(data);
      setThemeKey(getThemeFromScore(score));
      addToHistory(input, data);
      increment(score);
      if (score < 31) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
      }
    } catch (err) {
      setError(err.message || "Backend error. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleScanA = async (text) => {
    if (!text.trim()) return;
    setLoadingA(true);
    try { setCompareA(await doScan(text)); } catch { setCompareA(null); } finally { setLoadingA(false); }
  };

  const handleScanB = async (text) => {
    if (!text.trim()) return;
    setLoadingB(true);
    try { setCompareB(await doScan(text)); } catch { setCompareB(null); } finally { setLoadingB(false); }
  };

  const canScan = !loading && input.trim();

  return (
    <div style={s.page}>
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        * { box-sizing: border-box; }
        textarea:focus { border-color: ${primary}66 !important; box-shadow: 0 0 0 3px ${primary}14 !important; outline: none; }
        .ex-btn:hover { border-color: ${primary}66 !important; color: ${primary} !important; background: ${primary}10 !important; }

        /* ── Mobile responsive ── */
        @media (max-width: 600px) {
          .scan-main   { padding: 18px 12px 48px !important; }
          .hero-title  { font-size: 28px !important; }
          .scan-btn    { font-size: 14px !important; padding: 14px !important; }
          .score-hdr   { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
          .circle-wrap { align-self: center; }
          .ex-row      { gap: 5px !important; }
          .ex-btn      { font-size: 10px !important; padding: 4px 8px !important; }
          .stat-bar    { grid-template-columns: repeat(3,1fr) !important; }
          .actions-row { flex-wrap: wrap !important; }
          .actions-row button { flex: 1 1 40% !important; font-size: 10px !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .compare-grid > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06) !important; }
          .lang-tabs   { flex-wrap: wrap !important; }
          .stats-bar   { gap: 6px !important; }
        }
      `}</style>

      {/* Confetti */}
      <Confetti active={showConfetti} />

      <div style={s.main} className="scan-main">

        {/* Hero */}
        <div style={s.heroWrap}>
          <div style={s.auroraWrap}>
            <Aurora colorStops={theme?.aurora || ["#4361ee","#3a86ff","#7209b7"]} amplitude={0.7} blend={0.5} speed={0.35} />
          </div>
          <div style={s.hero}>
            <div style={{ ...s.heroPill, background: `${primary}18`, border: `1px solid ${primary}44`, color: primary }}>
              🇮🇳 India's AI Scam Detector
            </div>
            <h1 className="hero-title" style={s.heroTitle}>
              Paste Anything.<br />
              <em style={{ color: primary, fontStyle: "italic" }}>Know Instantly.</em>
            </h1>
            <p style={s.heroSub}>URL · UPI ID · Phone Number · Job Offer · WhatsApp Message</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <StatsBar stats={stats} responseTime={responseTime} primary={primary} />
        </div>

        {/* Scan History */}
        <ScanHistory history={history} onReload={handleReload} theme={theme} />

        {/* Compare toggle */}
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setShowCompare((v) => !v)}
            style={{ fontSize: 11, padding: "5px 14px", borderRadius: 20, cursor: "pointer", border: `1px solid ${showCompare ? `${primary}55` : "rgba(255,255,255,0.08)"}`, color: showCompare ? primary : "#8888aa", background: showCompare ? `${primary}12` : "rgba(255,255,255,0.03)", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >{showCompare ? "✕ Close Compare" : "🔄 Compare Two Messages"}</button>
        </div>

        {/* Compare Panel */}
        {showCompare && (
          <div className="compare-grid-wrap" style={{ animation: "fadeIn 0.3s ease" }}>
            <ComparePanel
              primary={primary}
              onScanA={handleScanA}
              onScanB={handleScanB}
              resultA={compareA}
              resultB={compareB}
              loadingA={loadingA}
              loadingB={loadingB}
            />
          </div>
        )}

        {/* Image Upload */}
        <ImageUpload
          theme={theme}
          onTextExtracted={(text) => { setInput(text); setResult(null); setThemeKey("default"); setError(null); }}
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
            <div style={s.exRow} className="ex-row">
              <span style={s.tryLabel}>Try:</span>
              {EXAMPLES.map((ex) => (
                <button key={ex.label} className="ex-btn"
                  style={{ ...s.exBtn, borderColor: exHovered === ex.label ? `${primary}55` : "rgba(255,255,255,0.08)", color: exHovered === ex.label ? primary : "#8888aa", background: exHovered === ex.label ? `${primary}10` : "rgba(255,255,255,0.03)" }}
                  onMouseEnter={() => setExHovered(ex.label)} onMouseLeave={() => setExHovered(null)}
                  onClick={() => { setInput(ex.text); setResult(null); setThemeKey("default"); setError(null); }}
                >{ex.label}</button>
              ))}
            </div>
          </div>
        </BorderGlow>

        {/* Scan button */}
        <button className="scan-btn"
          onClick={handleCheck} disabled={!canScan}
          style={{ ...s.scanBtn, background: theme?.scanBtn || "linear-gradient(135deg, #4361ee, #3a86ff)", boxShadow: scanHover && canScan ? `0 8px 36px ${primary}55` : `0 4px 20px ${primary}33`, opacity: canScan ? 1 : 0.5, transform: scanHover && canScan ? "translateY(-2px)" : "translateY(0)" }}
          onMouseEnter={() => setScanHover(true)} onMouseLeave={() => setScanHover(false)}
        >
          {loading ? <><span style={s.scanSpinner} /> Analyzing…</> : "🔍 Scan for Scam"}
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
  page:      { background: "#050510", minHeight: "calc(100vh - 60px)", color: "#e0e0f0", fontFamily: "'Space Grotesk', sans-serif" },
  main:      { maxWidth: 820, margin: "0 auto", padding: "32px 20px 60px", position: "relative", zIndex: 1 },
  heroWrap:  { position: "relative", textAlign: "center", marginBottom: 28, padding: "44px 20px 36px", borderRadius: 20, overflow: "hidden" },
  auroraWrap:{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" },
  hero:      { position: "relative", zIndex: 2 },
  heroPill:  { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 20, marginBottom: 14, letterSpacing: "0.5px", transition: "all 0.8s ease" },
  heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 5vw, 50px)", fontWeight: 700, color: "#fff", lineHeight: 1.12, margin: "0 0 10px" },
  heroSub:   { color: "#6666aa", fontSize: 13, margin: 0 },
  inputInner:{ padding: "20px 22px 16px" },
  inputLabel:{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10, transition: "color 0.8s ease" },
  textarea:  { width: "100%", minHeight: 108, background: "rgba(0,0,0,0.5)", border: "1px solid", borderRadius: 10, padding: 14, color: "#e0e0f0", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", resize: "vertical", transition: "border-color 0.3s, box-shadow 0.3s", lineHeight: 1.6 },
  exRow:     { display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12, alignItems: "center" },
  tryLabel:  { fontSize: 11, color: "#333355" },
  exBtn:     { fontSize: 11, padding: "5px 11px", borderRadius: 20, cursor: "pointer", border: "1px solid", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" },
  scanBtn:   { width: "100%", marginTop: 14, padding: "16px", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer", transition: "all 0.25s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.3px" },
  scanSpinner:{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  hint:      { textAlign: "center", fontSize: 11, color: "#1e1e36", marginTop: 8 },
  loadCard:  { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 18px", marginTop: 18 },
  loadTop:   { textAlign: "center", marginBottom: 14 },
  spinner:   { width: 34, height: 34, border: "2px solid rgba(255,255,255,0.07)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 10px", transition: "border-top-color 0.8s ease" },
  loadTitle: { fontWeight: 700, color: "#ccc", margin: "0 0 4px", fontSize: 13 },
  loadSub:   { color: "#333355", fontSize: 11, margin: 0 },
  errorCard: { marginTop: 18, background: "rgba(255,77,109,0.07)", border: "1px solid rgba(255,77,109,0.25)", borderRadius: 12, padding: "13px 18px", color: "#ff4d6d", fontSize: 13 },
  sectionLabel:{ fontSize: 10, fontWeight: 700, color: "#5555aa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 },
  actionBtn: { flex: 1, padding: "10px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#9999bb", transition: "all 0.2s", fontFamily: "'Space Grotesk', sans-serif" },
};