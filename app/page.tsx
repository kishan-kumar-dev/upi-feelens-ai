"use client";

import { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Source {
  title: string;
  link: string;
  snippet: string;
  source?: string;
}

interface ResearchResult {
  question: string;
  queries: string[];
  sources: Source[];
  aiSummary: string;
}

const exampleQuestions = [
  "Is there any fee for a ₹5,000 UPI payment?",
  "Are UPI merchant payments charged?",
  "Does UPI have transaction charges?",
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter your UPI question.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Research failed.");
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleExampleClick(example: string) {
    setQuestion(example);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* HEADER */}
        <header className="mb-12 text-center">
          <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            🔎 Live web research + AI
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            UPI FeeLens AI
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Know the fee before you pay.
            <br />
            Get a simple explanation based on live web research.
          </p>
        </header>

        {/* QUESTION CARD */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="question"
              className="mb-3 block text-sm font-semibold text-slate-300"
            >
              Ask your UPI fee question
            </label>

            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: Is there any fee for a ₹5,000 UPI payment?"
              className="min-h-32 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white placeholder:text-slate-600 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
            />

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Searches live sources before generating an explanation.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Researching..." : "Check UPI Fees"}
              </button>
            </div>
          </form>

          {/* EXAMPLE QUESTIONS */}
          <div className="mt-7">
            <p className="mb-3 text-sm text-slate-500">Try an example:</p>

            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <div className="font-semibold">
              Research could not be completed.
            </div>

            <div className="mt-1 text-sm">{error}</div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex items-center gap-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />

              <div>
                <p className="font-semibold">
                  Researching UPI fee information...
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Searching live sources with SerpApi and analyzing the evidence
                  with Gemini.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* RESULTS */}
        {result && !loading && (
          <section className="mt-8 space-y-6">
            {/* AI RESULT */}
            <div className="rounded-3xl border border-emerald-400/20 bg-slate-900 p-6 shadow-xl sm:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-300">
                    AI Research Result
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    FeeLens Explanation
                  </h2>
                </div>

                <div className="w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  ✓ Live Research
                </div>
              </div>

              {/* MARKDOWN RESULT */}
              <div className="space-y-6 text-slate-300">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold text-white">
                        {children}
                      </h2>
                    ),

                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-white">
                        {children}
                      </h3>
                    ),

                    p: ({ children }) => (
                      <p className="leading-7 text-slate-300">{children}</p>
                    ),

                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),

                    ul: ({ children }) => (
                      <ul className="ml-6 list-disc space-y-3 text-slate-300">
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="ml-6 list-decimal space-y-3 text-slate-300">
                        {children}
                      </ol>
                    ),

                    li: ({ children }) => (
                      <li className="leading-7">{children}</li>
                    ),

                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 underline hover:text-emerald-200"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {result.aiSummary}
                </ReactMarkdown>
              </div>
            </div>

            {/* SEARCH QUERIES */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-bold">Search Queries</h2>

              <p className="mt-1 text-sm text-slate-500">
                These queries were sent to SerpApi.
              </p>

              <div className="mt-5 space-y-3">
                {result.queries.map((query, index) => (
                  <div
                    key={`${query}-${index}`}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <span className="mr-3 font-semibold text-emerald-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm text-slate-300">{query}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SOURCES */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Sources</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Open the original source to verify the information.
                </p>
              </div>

              <div className="grid gap-4">
                {result.sources.map((source, index) => (
                  <a
                    key={`${source.link}-${index}`}
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-emerald-400/50 hover:bg-slate-900"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-sm font-bold text-emerald-300">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-emerald-300">
                          {source.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {source.snippet}
                        </p>

                        <p className="mt-3 break-all text-xs text-emerald-300">
                          {source.link}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* DISCLAIMER */}
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-slate-400">
              <strong className="text-amber-300">Important:</strong> UPI fee
              rules can depend on the payment type, merchant arrangement, bank,
              and applicable rules. Verify important payment information with
              the relevant official source or your bank before making a
              transaction.
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="mt-16 border-t border-slate-800 pt-6 text-center text-sm text-slate-600">
          UPI FeeLens AI · Next.js · SerpApi · Gemini
        </footer>
      </div>
    </main>
  );
}
