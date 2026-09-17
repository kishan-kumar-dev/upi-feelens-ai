export function buildUPIQueries(question: string): string[] {
  return [
    `site:npci.org.in UPI charges fees ${question}`,
    `site:gov.in UPI charges fees ${question}`,
    `site:bank.in UPI transaction charges ${question}`,
    `UPI transaction charges India ${question}`,
  ];
}