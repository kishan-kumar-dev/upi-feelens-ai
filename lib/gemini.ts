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
clear explanation.

IMPORTANT RULES:

1. Use only information supported by the retrieved sources.

2. Do not invent fees, percentages, dates, limits, rules,
   or transaction conditions.

3. Clearly distinguish between:
   - consumer/customer charges
   - merchant charges
   - bank-to-bank UPI payments
   - wallet/PPI payments
   - P2P payments
   - P2M/merchant payments

4. If sources discuss different dates or different fee
   structures, clearly mention that they may refer to
   different effective dates or transaction categories.

5. Do not combine conflicting numbers as though they are
   one current rule.

6. If the retrieved sources conflict or are unclear, say:
   "The retrieved sources are not fully consistent."

7. Prefer official or primary sources when they are present,
   especially NPCI or government sources.

8. News articles and payment-company articles can provide
   context, but do not treat them as official rules.

9. Never claim that a customer must pay a merchant-side fee
   unless the sources explicitly support that claim.

10. Do not provide financial advice.

11. Keep the answer concise and easy to understand.

12. Use Markdown headings and bullet points.

Return exactly these sections:

## ANSWER

Give the simplest answer to the user's question.

## DETAILS

Explain the important conditions, transaction types,
thresholds, dates, or exceptions supported by the sources.

## SOURCES

Summarize what the retrieved sources say.
Mention when sources disagree.

## IMPORTANT

Tell the user what information should be verified
before relying on the answer.
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
