type CsvRow = Record<string, string | number | boolean | null | undefined>;

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsv(rows: CsvRow[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(",")),
  ];
  return lines.join("\n");
}

export function resultsToCsvRows(results: Record<string, unknown>[]): CsvRow[] {
  return results.map((r) => ({
    created_at: r.created_at as string,
    student_name: r.student_name as string,
    email: r.email as string,
    phone: r.phone as string,
    age: r.age as number,
    objective: r.objective as string,
    self_declared_level: r.self_declared_level as string,
    raw_score: r.raw_score as number,
    max_score: r.max_score as number,
    percentage: r.percentage as number,
    cefr_level: r.cefr_level as string,
    recommended_course: r.recommended_course as string,
    writing_answer: r.writing_answer as string,
  }));
}
