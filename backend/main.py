from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import httpx
import re
import json
import os

app = FastAPI()

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Groq client ─────────────────────────────────────────────────────────────
# Get your FREE key at https://console.groq.com (takes 2 mins)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "gsk_xxxx")
client = Groq(api_key=GROQ_API_KEY)

# ─── Input model ─────────────────────────────────────────────────────────────
class InputData(BaseModel):
    text: str

# ─── Helpers ─────────────────────────────────────────────────────────────────

def extract_domain(text: str) -> str | None:
    """Pull the first URL's domain out of the text."""
    match = re.search(r"https?://([^/\s?#]+)", text)
    return match.group(1) if match else None


async def check_domain_rdap(domain: str) -> dict:
    """
    Free RDAP lookup — no API key, no cost, unlimited.
    Returns domain age in days + registrar info.
    """
    try:
        async with httpx.AsyncClient(timeout=6) as client_http:
            resp = await client_http.get(f"https://rdap.org/domain/{domain}")
            if resp.status_code != 200:
                return {}
            data = resp.json()

            # Pull registration date
            reg_date = None
            for event in data.get("events", []):
                if event.get("eventAction") == "registration":
                    reg_date = event.get("eventDate", "")[:10]
                    break

            # Calculate age in days
            age_days = None
            if reg_date:
                from datetime import date
                registered = date.fromisoformat(reg_date)
                age_days = (date.today() - registered).days

            registrar = ""
            for entity in data.get("entities", []):
                roles = entity.get("roles", [])
                if "registrar" in roles:
                    vcard = entity.get("vcardArray", [])
                    if vcard and len(vcard) > 1:
                        for item in vcard[1]:
                            if item[0] == "fn":
                                registrar = item[3]
                                break

            return {
                "registration_date": reg_date,
                "age_days": age_days,
                "registrar": registrar,
            }
    except Exception:
        return {}


async def check_google_safe_browsing(url: str) -> bool:
    """
    Google Safe Browsing API — 10,000 free requests/day.
    Get key at https://console.cloud.google.com
    Returns True if URL is flagged as dangerous.
    """
    GSB_KEY = os.getenv("GOOGLE_SAFE_BROWSING_KEY", "")
    if not GSB_KEY:
        return False  # Skip silently if no key set yet
    try:
        payload = {
            "client": {"clientId": "isthisscam", "clientVersion": "1.0"},
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}],
            },
        }
        async with httpx.AsyncClient(timeout=6) as h:
            resp = await h.post(
                f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GSB_KEY}",
                json=payload,
            )
            data = resp.json()
            return bool(data.get("matches"))
    except Exception:
        return False


def build_domain_signals(domain: str, rdap: dict, gsb_flagged: bool) -> list[dict]:
    """Turn RDAP + GSB data into signal cards for the frontend."""
    signals = []
    age = rdap.get("age_days")

    if gsb_flagged:
        signals.append({
            "type": "red",
            "icon": "🚨",
            "title": "Flagged by Google Safe Browsing",
            "description": "This URL is in Google's database of known malware and phishing sites.",
        })

    if age is not None:
        if age <= 7:
            signals.append({
                "type": "red",
                "icon": "🆕",
                "title": f"Domain created just {age} day(s) ago",
                "description": "Scam sites are created days before attacks. Legitimate banks use domains years old.",
            })
        elif age <= 30:
            signals.append({
                "type": "yellow",
                "icon": "⚠️",
                "title": f"Domain only {age} days old",
                "description": "Very new domain. Proceed with extreme caution.",
            })
        else:
            signals.append({
                "type": "green",
                "icon": "✅",
                "title": f"Domain is {age} days old ({age // 365} yr)",
                "description": "Older domains are generally more trustworthy.",
            })

    # Suspicious TLDs
    suspicious_tlds = [".xyz", ".tk", ".ml", ".ga", ".cf", ".gq", ".info", ".top", ".click"]
    for tld in suspicious_tlds:
        if domain.endswith(tld):
            signals.append({
                "type": "red",
                "icon": "🌐",
                "title": f"Suspicious domain extension: {tld}",
                "description": "Scammers prefer free/cheap TLDs to create throwaway phishing domains.",
            })
            break

    # Brand impersonation
    indian_brands = [
        "sbi", "hdfc", "icici", "axis", "kotak", "paytm", "phonepe",
        "googlepay", "irctc", "flipkart", "amazon", "uidai", "npci",
        "incometax", "gst", "epfo", "lic", "bsnl", "jio",
    ]
    for brand in indian_brands:
        if brand in domain and domain not in [
            f"{brand}.com", f"{brand}.co.in", f"www.{brand}.com", f"www.{brand}.co.in"
        ]:
            signals.append({
                "type": "red",
                "icon": "🎭",
                "title": f"Impersonating '{brand.upper()}'",
                "description": f"Domain contains '{brand}' but is NOT the official site. Classic phishing tactic.",
            })
            break

    # Short links
    if any(s in domain for s in ["bit.ly", "tinyurl", "t.co", "goo.gl", "rb.gy"]):
        signals.append({
            "type": "yellow",
            "icon": "🔗",
            "title": "Shortened URL detected",
            "description": "Short links hide the real destination. Scammers use them to disguise phishing URLs.",
        })

    return signals


def run_groq_analysis(text: str, domain_context: str) -> dict:
    """
    Send text to Groq (Llama 3.1 8B) for AI scam analysis.
    Groq is FREE — get key at console.groq.com
    Runs on their servers, zero RAM on your laptop.
    """
    prompt = f"""
You are an expert AI scam detector trained specifically for Indian online frauds.

Analyze the following input for scam patterns:
INPUT: {text}

DOMAIN CONTEXT (if URL was detected): {domain_context}

VERY IMPORTANT RULES — READ BEFORE ANALYZING:
- If the input is a normal greeting, casual message, random words, or everyday conversation
  (like "hello", "hi how are you", "good morning", "hello sahina", "bhai kya haal hai") 
  — it is NOT a scam. Give scam_score of 0-5.
- If the input is a real sentence but has NO scam indicators at all — give scam_score of 0-10.
- Only give HIGH scores (70+) if there are CLEAR and MULTIPLE scam signals present.
- Do NOT hallucinate signals that are not clearly present in the text.
- Do NOT flag normal Hindi/Bengali words like "abhi", "turant", "jaldi" UNLESS they are
  combined with other scam signals like money requests, prize claims, or account threats.
- A message needs AT LEAST 2-3 CLEAR and OBVIOUS scam signals to score above 50.
- If you are not sure, always give a LOW score. It is better to miss a scam than to 
  flag innocent messages.
- Greetings with names (like "hello sahina", "hi rahul") are NEVER scams.

Check for these Indian scam patterns ONLY if CLEARLY present in the text:
1. Urgency language COMBINED WITH money/prize/account threats
2. Advance fee demands (paying money to receive money, prizes, or loans)
3. Impersonation of Indian institutions (SBI, HDFC, RBI, KBC, CBI, Income Tax, Aadhaar, EPFO)
4. Impersonation of celebrities (Amitabh Bachchan, PM Modi, etc.)
5. Unrealistic salary promises (₹50,000/month for liking YouTube videos)
6. OTP, PIN, Aadhaar, PAN requests through informal channels
7. Pressure tactics COMBINED WITH financial offers
8. Asking victim to move to WhatsApp or Telegram FROM a professional platform
9. UPI collect request fraud (paying disguised as receiving)
10. Fake government scheme names with money promises
11. Job scams WITH advance fee or clearly unrealistic pay
12. KBC/lottery WITH processing fee to release prize
13. Investment scams promising guaranteed high returns

Respond ONLY with this exact JSON. No extra text, no markdown fences:
{{
  "scam_score": <integer 0-100>,
  "risk_level": "<safe|suspicious|high|critical>",
  "scam_category": "<specific scam type in plain English, or 'Not a Scam'>",
  "signals": [
    {{
      "type": "<red|yellow|green>",
      "icon": "<single emoji>",
      "title": "<short 5-8 word title>",
      "description": "<one clear sentence explaining why this is a red flag>"
    }}
  ],
  "explanation": {{
    "english": "<2-3 sentences in simple English. If safe, reassure the user clearly. If scam, explain why + what to do. End with action if scam: Call 1930 or report at cybercrime.gov.in>",
    "hindi": "<same explanation in simple conversational Hindi>",
    "bengali": "<same explanation in simple conversational Bengali>"
  }},
  "stats": {{
    "reports": "<number as string e.g. '14,203' or 'N/A' if not a scam>",
    "loss": "<estimated total money lost e.g. '₹8.7Cr' or 'N/A' if not a scam>",
    "victims": "<number as string or 'N/A' if not a scam>"
  }}
}}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",  # Free on Groq
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert scam detector for Indian users. "
                    "ALWAYS respond with valid JSON only. "
                    "No markdown, no code blocks, no extra text. Pure JSON. "
                    "Never flag normal greetings or casual messages as scams. "
                    "Be conservative — only flag something as a scam if you are very sure."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,   # Low = more consistent and accurate
        max_tokens=1200,
    )

    raw = response.choices[0].message.content.strip()

    # Strip accidental markdown fences just in case
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*",     "", raw)
    raw = re.sub(r"\s*```$",     "", raw)

    return json.loads(raw)


# ─── Main endpoint ────────────────────────────────────────────────────────────

@app.post("/check")
async def check_scam(data: InputData):
    text = data.text.strip()

    # Step 1 — Extract domain if URL is present
    domain = extract_domain(text)
    rdap_data      = {}
    gsb_flagged    = False
    domain_signals = []

    if domain:
        rdap_data      = await check_domain_rdap(domain)
        gsb_flagged    = await check_google_safe_browsing(text)
        domain_signals = build_domain_signals(domain, rdap_data, gsb_flagged)

    # Step 2 — Build domain context string to give Groq extra info
    domain_context = "No URL detected."
    if domain:
        age = rdap_data.get("age_days")
        domain_context = (
            f"Domain: {domain} | "
            f"Age: {age} days | "
            f"Registrar: {rdap_data.get('registrar', 'Unknown')} | "
            f"Google Safe Browsing flagged: {gsb_flagged}"
        )

    # Step 3 — Run Groq AI analysis
    try:
        ai_result = run_groq_analysis(text, domain_context)
    except (json.JSONDecodeError, Exception):
        ai_result = {
            "scam_score": 50,
            "risk_level": "suspicious",
            "scam_category": "Unable to analyze",
            "signals": [],
            "explanation": {
                "english": "AI analysis could not complete. Please try again.",
                "hindi":   "AI विश्लेषण पूरा नहीं हो सका। कृपया पुनः प्रयास करें।",
                "bengali": "AI বিশ্লেষণ সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
            },
            "stats": {"reports": "N/A", "loss": "N/A", "victims": "N/A"},
        }

    # Step 4 — Merge: domain signals first, then AI signals
    all_signals = domain_signals + ai_result.get("signals", [])

    # Step 5 — Boost score for hard evidence
    score = ai_result.get("scam_score", 50)
    if gsb_flagged:
        score = min(100, score + 20)
    if rdap_data.get("age_days") is not None and rdap_data["age_days"] <= 7:
        score = min(100, score + 15)

    # Step 6 — Return full response (matches App.js expected shape)
    return {
        "scam_score":    score,
        "risk_level":    ai_result.get("risk_level", "suspicious"),
        "scam_category": ai_result.get("scam_category", "Unknown"),
        "signals":       all_signals,
        "explanation":   ai_result.get("explanation", {}),
        "stats":         ai_result.get("stats", {}),
    }


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "IsThisScam backend running ✅"}