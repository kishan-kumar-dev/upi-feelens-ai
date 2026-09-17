# UPI FeeLens AI

> **Know the fee before you pay.**

UPI FeeLens AI is an AI-powered research assistant that helps users understand UPI transaction fees and charges.

Instead of relying on a single static answer, the application searches the live web using SerpApi and then uses Gemini AI to analyze the retrieved information and provide a simple explanation with source links.

## 🚀 Live Demo

https://upi-feelens-ai.vercel.app/

## 🎥 Demo Video

https://drive.google.com/file/d/1VR1DNinlW8Mx-v32znbqOxCwBqZ0oawR/view?usp=drive_link

## 💻 GitHub

https://github.com/kishan-kumar-dev/upi-feelens-ai

---

## 🎯 Problem

UPI payments are widely used, but users can be confused about:

* Whether a UPI transaction has a fee
* Whether fees are different for customers and merchants
* Whether transaction amount affects charges
* Whether payment type affects charges
* Whether bank, wallet, or payment provider rules are different
* Which information is current

Online information can also come from different sources and may contain different dates, transaction categories, or fee structures.

UPI FeeLens AI helps users research these questions quickly.

---

## 💡 Solution

UPI FeeLens AI combines:

1. **Live web research**
2. **Source collection**
3. **AI analysis**
4. **Simple explanations**
5. **Source transparency**

The application retrieves relevant information from the web and sends the retrieved evidence to Gemini AI.

The AI then explains the information while being instructed not to invent fees or unsupported numbers.

---

## ✨ Features

### 🔎 Live Web Research

Uses SerpApi to search the web for UPI fee information.

### 🤖 AI-Powered Analysis

Uses Google Gemini to analyze retrieved search results and explain them in simple language.

### 📚 Source Transparency

Displays the sources used for the AI explanation so users can inspect the original information.

### 🧠 Multiple Search Queries

The application generates multiple UPI-focused search queries for better research coverage.

### ⚠️ Conflict Awareness

The AI is instructed to identify conflicting information instead of presenting different fee structures as one universal rule.

### 📱 Simple Interface

Clean and minimal interface focused on one task:

> Ask a UPI fee question and get a researched explanation.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │  UPI Fee Question   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Next.js UI      │
                    │   React + Tailwind  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    /api/research    │
                    │   Next.js API Route │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       SerpApi       │
                    │    Live Web Search  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Retrieved Sources  │
                    │ Titles + Snippets   │
                    │    + URLs           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Gemini AI      │
                    │   Evidence Analysis │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FeeLens Result   │
                    │ Answer + Details    │
                    │    + Sources        │
                    └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* React Markdown

### Backend

* Next.js App Router
* Next.js API Routes

### AI

* Google Gemini
* `@google/genai`

### Web Research

* SerpApi
* Google Search results

### Deployment

* Vercel

### Version Control

* Git
* GitHub

---

## 📁 Project Structure

```text
upi-feelens-ai/

├── app/
│   ├── api/
│   │   └── research/
│   │       └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   ├── gemini.ts
│   ├── queries.ts
│   └── serpapi.ts
│
├── types/
│   └── research.ts
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🔄 How It Works

### Step 1 — User asks a question

Example:

```text
Is there any fee for a ₹5,000 UPI payment?
```

### Step 2 — Search queries are generated

The application creates multiple research queries related to the user's question.

### Step 3 — SerpApi performs live searches

The application sends the generated queries to SerpApi.

### Step 4 — Duplicate sources are removed

The application combines the search results and removes duplicate URLs.

### Step 5 — Gemini analyzes the evidence

Gemini analyzes the retrieved source information and explains the relevant findings.

### Step 6 — User receives the result

The application displays:

```text
Answer

Details

Sources

Important
```

This makes the result easier to understand and verify.

---

## 🔐 Environment Variables

Create a local file:

```text
.env.local
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key
```

### Important

Never commit `.env.local` to GitHub.

The project `.gitignore` contains:

```gitignore
.env*
```

---

## ▶️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/kishan-kumar-dev/upi-feelens-ai.git
```

### 2. Open the project

```bash
cd upi-feelens-ai
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env.local`

```env
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Open the application

```text
http://localhost:3000
```

---

## 🏭 Production Build

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## 🔌 API

### POST `/api/research`

Researches a UPI fee question using SerpApi and Gemini.

### Request

```json
{
  "question": "Is there any fee for a ₹5,000 UPI payment?"
}
```

### Response

```json
{
  "question": "Is there any fee for a ₹5,000 UPI payment?",
  "queries": [],
  "sources": [],
  "aiSummary": "..."
}
```

---

## 🧪 Example Questions

```text
Is there any fee for a ₹5,000 UPI payment?
```

```text
Are UPI merchant payments charged?
```

```text
Does the customer pay a UPI transaction fee?
```

```text
Are UPI payments free for customers?
```

```text
Do UPI merchant transactions have charges?
```

---

## 🧩 Design Principles

### Evidence First

The AI receives retrieved web evidence before generating the explanation.

### No Unsupported Claims

The Gemini prompt explicitly tells the model not to invent:

* Fees
* Percentages
* Dates
* Limits
* Transaction conditions

### Source Transparency

Users can see the sources used by the research process.

### Clear Uncertainty

If retrieved sources disagree, the application tells the user instead of hiding the disagreement.

### Simple UX

The interface focuses on one primary action:

```text
Ask → Research → Explain → Verify
```

---

## ⚠️ Disclaimer

UPI fees and transaction rules can depend on factors such as transaction type, payment method, participant, merchant category, applicable rules, and effective dates.

UPI FeeLens AI is a research and information tool.

The information shown by the application should be verified against the relevant official source before making decisions based on it.

The application does not provide financial advice.

---

## 🔮 Future Improvements

Possible future improvements include:

* Official-source prioritization
* Better source filtering
* NPCI and government source verification
* Source reliability indicators
* Fee comparison tables
* Transaction-type filters
* Bank/payment-provider specific research
* Historical fee changes
* Better search query optimization
* Cached research results
* User-friendly fee breakdowns
* Multi-language support
* Voice-based questions
* More advanced AI research agents

---

## 🎥 Hackathon Demo Flow

A simple demo can follow this flow:

```text
1. Introduce UPI FeeLens AI

2. Enter:
   "Is there any fee for a ₹5,000 UPI payment?"

3. Click:
   "Check UPI Fees"

4. Show:
   Live Research

5. Show:
   AI-generated explanation

6. Scroll to:
   Sources

7. Explain:
   The AI uses retrieved evidence and
   highlights uncertainty or conflicting information.

8. Finish with:
   "Know the fee before you pay."
```

---

## 👨‍💻 Author

**Kishan Modi**

Full Stack Developer

GitHub:

https://github.com/kishan-kumar-dev

Portfolio:

https://kishan-modi-portfolio.vercel.app/

---

## 📄 License

This project was created as a hackathon project and demonstration application.
