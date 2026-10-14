import type { SensorReading } from "./types";

export function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportCsv(rows: SensorReading[], filename = "airtrend.csv") {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]) as (keyof SensorReading)[];
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => String(r[h])).join(","));
  downloadBlob(lines.join("\n"), filename, "text/csv");
}

export function exportJson(rows: SensorReading[], filename = "airtrend.json") {
  downloadBlob(JSON.stringify(rows, null, 2), filename, "application/json");
}

export function exportSvg(svgEl: SVGSVGElement | null, filename = "airtrend-chart.svg") {
  if (!svgEl) return;
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.style.background = "#0a0e1a";
  const xml = new XMLSerializer().serializeToString(clone);
  downloadBlob(xml, filename, "image/svg+xml");
}
