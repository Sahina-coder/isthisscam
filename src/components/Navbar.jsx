import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ theme }) {
  const location = useLocation();
  const [menuOpen] = useState(false);
  const primary = theme?.primary || "#4361ee";

  const links = [
    { to: "/",       label: "Home"    },
    { to: "/scan",   label: "Scanner" },
    { to: "/about",  label: "About"   },
  ];

  return (
    <nav style={{ ...styles.navbar, borderBottom: `1px solid ${primary}22` }}>
      <style>{`
        .nav-link { text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: ${primary} !important; }
        @media (max-width: 600px) {
          .nav-links { display: ${menuOpen ? "flex" : "none"} !important; }
        }
      `}</style>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <span style={{ ...styles.brand, textShadow: `0 0 20px ${primary}66` }}>
            Is This <span style={{ color: primary }}>Scam?</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="nav-links" style={styles.links}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="nav-link"
              style={{
                ...styles.link,
                color: location.pathname === l.to ? primary : "#8888aa",
                borderBottom: location.pathname === l.to ? `2px solid ${primary}` : "2px solid transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={styles.right}>
          <Link to="/scan" style={{ textDecoration: "none" }}>
            <button style={{
              ...styles.ctaBtn,
              background: `${primary}18`,
              border: `1px solid ${primary}55`,
              color: primary,
            }}>
              🔍 Scan Now
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(5,5,16,0.85)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    padding: "0 28px",
    height: 60,
    transition: "border-color 0.8s ease",
  },
  inner: {
    maxWidth: 1100, margin: "0 auto", height: "100%",
    display: "flex", alignItems: "center", gap: 12,
  },
  brand: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 20, fontWeight: 700, color: "#fff",
    letterSpacing: "0.3px",
    transition: "text-shadow 0.8s ease",
  },
  links: {
    display: "flex", alignItems: "center", gap: 4, marginLeft: 28,
  },
  link: {
    fontSize: 13, fontWeight: 600,
    padding: "4px 10px",
    fontFamily: "'Space Grotesk', sans-serif",
    paddingBottom: 2,
    transition: "color 0.2s, border-color 0.2s",
  },
  right: { marginLeft: "auto" },
  ctaBtn: {
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    padding: "6px 16px", borderRadius: 20,
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "all 0.3s ease",
  },
};