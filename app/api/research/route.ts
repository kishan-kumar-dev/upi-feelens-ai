import { NextResponse } from "next/server";

import { buildUPIQueries } from "@/lib/queries";
import { searchUPI } from "@/lib/serpapi";
import { analyzeUPIResults } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    // Step 1: Read the request body
    const body = await request.json();

    const question = body.question?.trim();

    // Step 2: Validate the question
    if (!question) {
      return NextResponse.json(
        {
          error: "Please enter a UPI question.",
        },
        {
          status: 400,
        },
      );
    }

    // Step 3: Create multiple UPI research queries
    const queries = buildUPIQueries(question);

    // Step 4: Search the web using SerpApi
    const searchResults = await Promise.all(
      queries.map((query) => searchUPI(query)),
    );

    // Step 5: Combine all search results
    const allSources = searchResults.flat();

    // Step 6: Remove duplicate URLs
    const uniqueSources = Array.from(
      new Map(allSources.map((source) => [source.link, source])).values(),
    );

    // Step 7: Keep the most relevant sources
    const sources = uniqueSources.slice(0, 12);

    // Step 8: Ask Gemini to analyze the retrieved evidence
    const aiSummary = await analyzeUPIResults(question, sources);

    // Step 9: Return the final result to the frontend
    return NextResponse.json({
      question,
      queries,
      sources,
      aiSummary,
    });
  } catch (error) {
    // Print the real error in the terminal
    console.error("Research error:", error);

    // Get a useful error message
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    // Return the real error to the frontend
    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
