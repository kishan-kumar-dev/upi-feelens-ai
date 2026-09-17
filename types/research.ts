export interface SearchSource {
  title: string;
  link: string;
  snippet: string;
  source?: string;
}

export interface ResearchResponse {
  question: string;
  queries: string[];
  sources: SearchSource[];
  aiSummary: string;
}