# 🛡️ Is This Scam?

### 🇮🇳 India's AI-Powered Scam Detector

**Think a message, URL, UPI ID, or job offer looks suspicious? Check it before you trust it.**

Is This Scam? uses **AI + cybersecurity intelligence** to analyze suspicious content and return a **Scam Probability Score (0–100%)** with a clear explanation in **English, Hindi, or Bengali**.

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-run-locally">Run Locally</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Llama%203.1-7C3AED?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## 🎯 What Does It Do?

Scams don't always look like scams.

A suspicious domain, a fake UPI ID, an urgent WhatsApp message, or a too-good-to-be-true job offer can all be warning signs.

**Is This Scam?** brings multiple signals together to help you make a safer decision.

| Input           | Analysis                               |
| --------------- | -------------------------------------- |
| 🔗 URL          | Phishing & suspicious-domain detection |
| 💳 UPI ID       | Fraud-risk analysis                    |
| 📱 Phone Number | Suspicious-number analysis             |
| 💬 Message      | AI-powered scam detection              |
| 💼 Job Offer    | Scam-pattern analysis                  |
| 📸 Screenshot   | OCR analysis *(coming soon)*           |

---

## ✨ Features

### 🔗 URL Phishing Detection

Analyze suspicious links using domain intelligence and phishing databases.

### 💳 UPI & Phone Fraud Check

Check potentially fraudulent UPI IDs and phone numbers before making a payment or responding.

### 🧠 AI-Powered Text Analysis

Llama-powered analysis identifies common scam patterns, manipulation tactics, urgency signals, and suspicious language.

### 🌐 Built for India

Get explanations in **English 🇬🇧 · Hindi 🇮🇳 · Bengali 🇮🇳**.

### 📊 Scam Probability Score

Receive an easy-to-understand **0–100% risk score** instead of a confusing technical report.

### 📸 Screenshot Analysis

OCR-based scam detection is **coming soon**.

---

## 🔍 How It Works

```text
        USER INPUT
            │
            ▼
   ┌─────────────────┐
   │ URL / UPI / SMS │
   │ Message / Phone │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Signal Analysis │
   │                 │
   │ • Domain data   │
   │ • Threat feeds  │
   │ • AI analysis   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Risk Assessment │
   │                 │
   │  0 ─────── 100% │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Explanation     │
   │ 🇬🇧 English      │
   │ 🇮🇳 Hindi        │
   │ 🇮🇳 Bengali      │
   └─────────────────┘
```

---

## ⚙️ Tech Stack

| Layer                   | Technology                              |
| ----------------------- | --------------------------------------- |
| 🎨 Frontend             | React.js + Tailwind CSS                 |
| ⚡ Backend               | Python + FastAPI                        |
| 🧠 AI                   | Groq + Llama 3.1                        |
| 🌐 Domain Intelligence  | RDAP Protocol                           |
| 🛡️ Threat Intelligence | MHA Cybercrime, CERT-In, RBI, OpenPhish |

---

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Sahina-coder/isthisscam.git
cd isthisscam
```

### 2. Start the frontend

```bash
npm install
npm start
```

### 3. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🗺️ Roadmap

* [x] 🔗 URL phishing detection
* [x] 🧠 AI text analysis
* [x] 🌐 English / Hindi / Bengali
* [x] 💳 UPI analysis
* [ ] 📸 Screenshot OCR
* [ ] 📱 Mobile-friendly experience
* [ ] 📈 Scam trend dashboard
* [ ] 🔔 Real-time threat alerts

---

## 👩‍💻 Built By

**Sahina Khatun & Madhumita Saha**

Two students from **Kolkata, India 🇮🇳**, building technology to make everyday digital interactions safer.

---

## 📜 License

This project is licensed under the **MIT License**.

Copyright © 2025 Sahina Khatun & Madhumita Saha.

> ⚠️ **Disclaimer:** Is This Scam? is an informational security tool. Its results are predictions based on available signals and should not be treated as a guarantee that a website, message, phone number, or payment identity is safe or fraudulent.
