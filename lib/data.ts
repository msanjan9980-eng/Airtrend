import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { SensorReading } from "./types";
import { generateDemoData } from "./utils";

const CSV_PATH = path.join(process.cwd(), "public", "airtrend_data.csv");

export function loadCsv(): SensorReading[] {
  try {
    if (!fs.existsSync(CSV_PATH)) {
      console.warn("CSV not found, using demo data");
      return generateDemoData();
    }
    const raw = fs.readFileSync(CSV_PATH, "utf-8");
    const parsed = Papa.parse<SensorReading>(raw, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });
    const rows = parsed.data.filter((r) => r.timestamp && typeof r.reading === "number");
    return rows.length ? rows.slice(-500) : generateDemoData();
  } catch (err) {
    console.error("CSV load failed:", err);
    return generateDemoData();
  }
}

export function computeStats(rows: SensorReading[]) {
  if (!rows.length) {
    return {
      current: null,
      totalReadings: 0, watchCount: 0, anomalyCount: 0,
      avgReading: 0, maxReading: 0, minReading: 0, uptime: "0s",
    };
  }
  const readings = rows.map((r) => r.reading).filter(Number.isFinite);
  const watchCount = rows.filter((r) => r.status === "WATCH").length;
  const anomalyCount = rows.filter((r) => r.status === "ANOMALY").length;

  const first = new Date(rows[0].timestamp).getTime();
  const last = new Date(rows[rows.length - 1].timestamp).getTime();
  const seconds = Math.max(0, Math.floor((last - first) / 1000));
  const uptime = seconds > 3600
    ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
    : seconds > 60
    ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    : `${seconds}s`;

  return {
    current: rows[rows.length - 1],
    totalReadings: rows.length, watchCount, anomalyCount,
    avgReading: readings.reduce((a, b) => a + b, 0) / readings.length,
    maxReading: Math.max(...readings),
    minReading: Math.min(...readings),
    uptime,
  };
}
