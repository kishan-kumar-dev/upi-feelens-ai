import { SearchSource } from "@/types/research";

export async function searchUPI(query: string): Promise<SearchSource[]> {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    throw new Error("SERPAPI_KEY is missing from .env.local");
  }

  const params = new URLSearchParams({
    engine: "google",
    q: query,
    api_key: apiKey,
    gl: "in",
    hl: "en",
    output: "json",
  });

  const url = `https://serpapi.com/search?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error("SerpApi error:", data);

    throw new Error(data.error || "SerpApi request failed");
  }

  return (data.organic_results || []).slice(0, 5).map((result: any) => ({
    title: result.title || "Untitled",
    link: result.link || "#",
    snippet: result.snippet || "",
    source: result.displayed_link || "",
  }));
}
