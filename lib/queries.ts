export function buildUPIQueries(question: string): string[] {
  return [
    `UPI fees charges ${question}`,
    `UPI transaction charges India ${question}`,
    `UPI charges NPCI ${question}`,
    `UPI bank charges ${question}`,
  ];
}