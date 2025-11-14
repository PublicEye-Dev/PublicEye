import type { Report, ReportIssue, Status } from "../Types/report";

//converteste un Report in ReportIssue
export function reportToIssue(report: Report): ReportIssue {
  return {
    id: report.id.toString(),
    title: report.description.substring(0, 50) + "...", //primele 50 de caractere
    status: report.status,
    position: [report.latitude, report.longitude],
    votes: report.votes,
    description: report.description,
    imageUrl: report.imageUrl,
  };
}

//converteste o lista de Report intr-o lista de ReportIssue
export function reportToIssues(reports: Report[]): ReportIssue[] {
  return reports.map(reportToIssue);
}

export function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    DEPUSA: "Depusă",
    PLANIFICATA: "Planificată",
    IN_LUCRU: "În lucru",
    REDIRECTIONATA: "Redirecționată",
    REZOLVATA: "Rezolvată",
  };
  return labels[status];
}

//mapeaza view-ul din ReportsFilter la perioada pentru backend
export function mapViewToPeriod(
  view: "allTime" | "last30Days" | "lastYear"
): string {
  const mapping = {
    allTime: "30z",
    last30Days: "30z",
    lastYear: "1year",
  };
  return mapping[view];
}

//mapeaza cheile din ReportsFilter la Status-ul din backend
export function mapFilterKeyToStatus(key: string): Status | null {
  const mapping: Record<string, Status> = {
    depuse: "DEPUSA",
    planificate: "PLANIFICATA",
    inLucru: "IN_LUCRU",
    redirectionate: "REDIRECTIONATA",
    rezolvate: "REZOLVATA",
  };
  return mapping[key] || null;
}
