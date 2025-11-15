import type { Report, ReportIssue, Status } from "../Types/report";

export function reportToIssue(report: Report): ReportIssue {
  const title =
    report.description.length > 50
      ? `${report.description.substring(0, 50)}…`
      : report.description;

  return {
    id: report.id.toString(),
    title,
    status: report.status,
    position: [report.latitude, report.longitude],
    votes: report.votes,
    description: report.description,
    imageUrl: report.imageUrl,
    updatedAtLabel: report.updatedAt
      ? new Date(report.updatedAt).toLocaleDateString("ro-RO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : undefined,
    categoryName: report.categoryName,
  };
}

export function reportsToIssues(reports: Report[]): ReportIssue[] {
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

export function mapFilterKeyToStatus(key: string): Status | null {
  const mapping: Record<string, Status> = {
    depuse: "DEPUSA",
    planificate: "PLANIFICATA",
    inLucru: "IN_LUCRU",
    rezolvate: "REZOLVATA",
    redirectionate: "REDIRECTIONATA",
  };
  return mapping[key] || null;
}

