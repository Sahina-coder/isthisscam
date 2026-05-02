import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Particles from "./Particles";
import Landing from "./pages/Landing";
import Scanner from "./pages/Scanner";
import About from "./pages/About";
import { THEMES } from "./theme";

// ─── Load fonts ───────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Space+Grotesk:wght@400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── Scroll to top on route change ───────────────────────────────────────────
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ─── Inner app (needs router context) ────────────────────────────────────────
function AppInner() {
  const [themeKey, setThemeKey] = useState("default");
  const theme = THEMES[themeKey] || THEMES.default;

  return (
    <div style={{
      backgroundColor: "#050510",
      minHeight: "100vh",
      transition: "background-color 1s ease",
      position: "relative",
    }}>

      {/* Global animated CSS */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050510; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.primary}55; border-radius: 2px; }

        /* Smooth theme color transitions everywhere */
        a { transition: color 0.5s ease; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow    { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
      `}</style>

      {/* Background particles — color shifts with theme */}
      <Particles
        particleCount={65}
        particleSpread={11}
        speed={0.05}
        particleColors={theme.particles}
        alphaParticles={true}
        particleBaseSize={48}
        moveParticlesOnHover={true}
        particleHoverFactor={0.25}
      />

      <ScrollTop />
      <Navbar theme={theme} />

      <Routes>
        <Route path="/"      element={<Landing theme={theme} />} />
        <Route path="/scan"  element={<Scanner theme={theme} setThemeKey={setThemeKey} />} />
        <Route path="/about" element={<About   theme={theme} />} />
        {/* Catch-all → home */}
        <Route path="*"      element={<Landing theme={theme} />} />
      </Routes>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}