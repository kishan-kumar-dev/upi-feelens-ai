import { SearchSource } from "@/types/research";

const TRUSTED_DOMAINS = [
  "npci.org.in",
  "rbi.org.in",
  "pib.gov.in",
  "hdfc.bank.in",
  "sbi.bank.in",
  "yes.bank.in",
  "centralbank.bank.in",
  "kotak.bank.in",
  "indusind.bank.in",
  "icicibank.com",
  "axisbank.com",
  "bankofbaroda.in",
  "phonepe.com",
  "razorpay.com",
  "paytm.com",
  "google.com",
];

const REPUTABLE_NEWS_DOMAINS = [
  "reuters.com",
  "thehindu.com",
  "hindustantimes.com",
  "indiatoday.in",
  "indianexpress.com",
  "business-standard.com",
  "ndtv.com",
];

const BLOCKED_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "tiktok.com",
  "reddit.com",
];

const IRRELEVANT_KEYWORDS = [
  "gambling",
  "casino",
  "betting",
  "lottery",
  "profit calculation",
  "bonus",
  "apk download",
  "game download",
  "mountain game",
  "online game",
];

const RELEVANT_KEYWORDS = [
  "upi",
  "upi fee",
  "upi fees",
  "upi charge",
  "upi charges",
  "transaction charge",
  "transaction charges",
  "transaction fee",
  "transaction fees",
  "merchant discount rate",
  "mdr",
  "merchant",
  "p2m",
  "p2p",
  "payment charge",
  "payment charges",
];

function getDomain(link: string): string {
  try {
    return new URL(link).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isDomainMatch(domain: string, trustedDomain: string): boolean {
  return domain === trustedDomain || domain.endsWith(`.${trustedDomain}`);
}

function isTrustedDomain(domain: string): boolean {
  return TRUSTED_DOMAINS.some((trustedDomain) =>
    isDomainMatch(domain, trustedDomain),
  );
}

function isReputableNewsDomain(domain: string): boolean {
  return REPUTABLE_NEWS_DOMAINS.some((newsDomain) =>
    isDomainMatch(domain, newsDomain),
  );
}

function isBlockedDomain(domain: string): boolean {
  return BLOCKED_DOMAINS.some((blockedDomain) =>
    isDomainMatch(domain, blockedDomain),
  );
}

function containsIrrelevantKeyword(title: string, snippet: string): boolean {
  const text = `${title} ${snippet}`.toLowerCase();

  return IRRELEVANT_KEYWORDS.some((keyword) => text.includes(keyword));
}

function hasRelevantContent(title: string, snippet: string): boolean {
  const text = `${title} ${snippet}`.toLowerCase();

  return RELEVANT_KEYWORDS.some((keyword) => text.includes(keyword));
}

function getSourceScore(source: SearchSource): number {
  const domain = getDomain(source.link);

  let score = 0;

  if (isTrustedDomain(domain)) {
    score += 100;
  }

  if (isReputableNewsDomain(domain)) {
    score += 70;
  }

  const text = `${source.title} ${source.snippet}`.toLowerCase();

  if (text.includes("npcI".toLowerCase())) {
    score += 30;
  }

  if (text.includes("reserve bank of india")) {
    score += 25;
  }

  if (text.includes("government")) {
    score += 20;
  }

  if (text.includes("merchant discount rate")) {
    score += 20;
  }

  if (text.includes("mdr")) {
    score += 10;
  }

  if (text.includes("upi")) {
    score += 10;
  }

  if (text.includes("fee")) {
    score += 5;
  }

  if (text.includes("charge")) {
    score += 5;
  }

  return score;
}

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

  const rawResults: SearchSource[] = (data.organic_results || [])
    .slice(0, 10)
    .map((result: any) => ({
      title: result.title || "Untitled",
      link: result.link || "#",
      snippet: result.snippet || "",
      source: result.displayed_link || "",
    }));

  const filteredResults = rawResults.filter((source) => {
    const domain = getDomain(source.link);

    if (!domain) {
      return false;
    }

    if (isBlockedDomain(domain)) {
      return false;
    }

    if (containsIrrelevantKeyword(source.title, source.snippet)) {
      return false;
    }

    const trusted = isTrustedDomain(domain);

    const reputableNews = isReputableNewsDomain(domain);

    const relevant = hasRelevantContent(source.title, source.snippet);

    /*
     * Keep only:
     * 1. Trusted official/bank/payment sources
     * 2. Reputable news sources with relevant content
     *
     * This prevents random websites on generic
     * government subdomains from entering the results.
     */
    if (trusted) {
      return true;
    }

    if (reputableNews && relevant) {
      return true;
    }

    return false;
  });

  const uniqueResults = Array.from(
    new Map(filteredResults.map((source) => [source.link, source])).values(),
  );

  return uniqueResults
    .sort((a, b) => getSourceScore(b) - getSourceScore(a))
    .slice(0, 5);
}
