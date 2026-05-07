import { useState, useRef } from "react";

export default function ImageUpload({ theme, onTextExtracted }) {
  const [open, setOpen]         = useState(false);
  const [preview, setPreview]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus]     = useState("");
  const [extracted, setExtracted] = useState("");
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setExtracted("");
    setProgress(0);
    setLoading(true);
    setStatus("Loading OCR engine...");

    const Tesseract = await import("tesseract.js");

    await Tesseract.recognize(file, "eng+hin", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
          setStatus(`Reading text... ${Math.round(m.progress * 100)}%`);
        } else {
          setStatus(m.status);
        }
      },
    }).then(({ data: { text } }) => {
      setExtracted(text.trim());
      setStatus("Done ✅");
      setLoading(false);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${theme.primary}44`,
          color: theme.primaryLight,
          padding: "8px 18px",
          borderRadius: 20,
          cursor: "pointer",
          fontSize: 13,
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: open ? 12 : 0,
          transition: "all 0.2s",
        }}
      >
        📸 {open ? "Hide Screenshot Upload" : "Upload Screenshot"}
      </button>

      {open && (
        <div>
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current.click()}
            style={{
              border: `2px dashed ${theme.primary}55`,
              borderRadius: 12,
              padding: "28px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: "rgba(255,255,255,0.02)",
              color: "#8888aa",
              fontSize: 13,
              transition: "all 0.2s",
            }}
          >
            🖼️ Drag & drop a screenshot here, or click to upload
            <br />
            <span style={{ fontSize: 11, color: "#555577" }}>PNG, JPG, WEBP — image never leaves your device</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{ width: "100%", maxHeight: 180, objectFit: "contain", marginTop: 10, borderRadius: 8 }}
            />
          )}

          {/* Progress */}
          {loading && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, color: "#8888aa", marginBottom: 5 }}>{status}</div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 100, height: 5 }}>
                <div style={{
                  width: `${progress}%`, height: "100%", borderRadius: 100,
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryLight})`,
                  transition: "width 0.3s",
                }} />
              </div>
            </div>
          )}

          {/* Extracted text + scan button */}
          {extracted && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: "#555577", marginBottom: 5 }}>Text extracted from image:</div>
              <div style={{
                background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "10px 14px",
                fontSize: 12, color: "#aaaacc", lineHeight: 1.6, maxHeight: 100, overflowY: "auto",
              }}>
                {extracted}
              </div>
              <button
                onClick={() => { onTextExtracted(extracted); setOpen(false); }}
                style={{
                  marginTop: 10, width: "100%", padding: "10px",
                  background: theme.scanBtn, border: "none", borderRadius: 8,
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                🔍 Scan This Text
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}