import { GoogleGenAI } from "@google/genai";
import { SearchSource } from "@/types/research";

export async function analyzeUPIResults(
  question: string,
  sources: SearchSource[],
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from .env.local");
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const sourceText = sources
    .map(
      (source, index) => `
SOURCE ${index + 1}

Title:
${source.title}

URL:
${source.link}

Snippet:
${source.snippet}
`,
    )
    .join("\n");

  const prompt = `
You are UPI FeeLens AI, a research assistant that explains
UPI transaction fees using retrieved web sources.

USER QUESTION:
${question}

RETRIEVED SOURCES:
${sourceText}

TASK:

Analyze the retrieved sources and give the user a short,
clear, accurate explanation.

IMPORTANT RULES:

1. Use only information supported by the retrieved sources.

2. Do not invent fees, percentages, dates, limits,
   transaction conditions, or regulatory requirements.

3. Clearly distinguish between:
   - consumer/customer charges
   - merchant charges
   - bank-to-bank UPI payments
   - wallet/PPI payments
   - P2P payments
   - P2M/merchant payments

4. Focus only on information directly relevant to the user's
   question. Do not introduce unrelated UPI features,
   limits, cash withdrawals, UPI Lite rules, or account
   restrictions unless they are necessary to answer the
   question.

5. If sources discuss different dates or different fee
   structures, clearly mention that they may refer to
   different effective dates or transaction categories.

6. Do not combine conflicting numbers as though they are
   one current rule.

7. If sources conflict or are unclear, say:
   "The retrieved sources are not fully consistent."

8. Prioritize sources in this order:
   - NPCI
   - Government sources
   - Banks and regulated financial institutions
   - Established payment providers
   - Reputable news organizations
   - Other websites

9. Do not treat Facebook, YouTube, social media posts,
   forums, or user-generated content as authoritative rules.

10. If an official or primary source is available, use it
    as the main basis for the explanation.

11. If only secondary sources are available, clearly say
    that the information should be verified with the relevant
    official source.

12. Never claim that a customer must pay a merchant-side fee
    unless the sources explicitly support that claim.

13. Do not provide financial advice.

14. Keep the answer concise and easy to understand.

15. Use Markdown headings and bullet points.

16. Do not repeat the entire source snippets. Summarize the
    relevant information instead.

17. Do not mention information that does not help answer the
    user's specific question.

Return exactly these sections:

## ANSWER

Give the simplest direct answer to the user's question.

## DETAILS

Explain only the important conditions, transaction types,
thresholds, dates, or exceptions that are directly relevant
to the question and supported by the sources.

## SOURCES

Briefly summarize what the most relevant retrieved sources
say. Mention when reliable sources disagree.

## IMPORTANT

Tell the user what information should be verified before
relying on the answer.
`;

  let response;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Gemini request attempt ${attempt}/3`);

      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      break;
    } catch (error) {
      console.error(`Gemini attempt ${attempt} failed:`, error);

      if (attempt === 3) {
        throw new Error(
          "Gemini is temporarily busy. Please try again in a few seconds.",
        );
      }

      const delay = attempt * 2000;

      console.log(`Waiting ${delay}ms before retry...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return response?.text || "No AI analysis was returned. Please try again.";
}
